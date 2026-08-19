import logging
from typing import Optional, Any, Dict, List
from neo4j import GraphDatabase, Driver, AsyncGraphDatabase, AsyncDriver
from neo4j.exceptions import Neo4jError, ServiceUnavailable, AuthError
from app.core.config import settings

logger = logging.getLogger("cognodb")

class CognoDBManager:
    """
    Singleton Connection Manager for CognoDB over Bolt Protocol using Neo4j Driver.
    Handles driver initialization, session lifecycle, connection testing, and graceful errors.
    """
    _instance: Optional["CognoDBManager"] = None
    _driver: Optional[AsyncDriver] = None

    def __new__(cls) -> "CognoDBManager":
        if cls._instance is None:
            cls._instance = super(CognoDBManager, cls).__new__(cls)
        return cls._instance

    async def initialize(self) -> None:
        """Initialize the Neo4j AsyncDriver connection pool."""
        if self._driver is not None:
            return

        try:
            logger.info(f"Connecting to CognoDB at {settings.COGNODB_URI}...")
            # Automatically handle bolt+ssc (self-signed cert) if standard bolt+s SSL handshake fails
            uri = settings.COGNODB_URI
            self._driver = AsyncGraphDatabase.driver(
                uri,
                auth=(settings.COGNODB_USER, settings.COGNODB_PASSWORD),
                max_connection_pool_size=50,
                connection_timeout=15.0
            )
            # Verify connectivity
            await self._driver.verify_connectivity()
            logger.info("Successfully connected to CognoDB!")
        except Exception as e:
            logger.error(f"Failed to connect to CognoDB: {str(e)}")
            # Try bolt+ssc:// fallback if URI started with bolt+s://
            if settings.COGNODB_URI.startswith("bolt+s://"):
                try:
                    fallback_uri = settings.COGNODB_URI.replace("bolt+s://", "bolt+ssc://")
                    logger.info(f"Retrying with self-signed certificate URI: {fallback_uri}...")
                    self._driver = AsyncGraphDatabase.driver(
                        fallback_uri,
                        auth=(settings.COGNODB_USER, settings.COGNODB_PASSWORD),
                        connection_timeout=15.0
                    )
                    await self._driver.verify_connectivity()
                    logger.info("Successfully connected to CognoDB via bolt+ssc://!")
                    return
                except Exception as fallback_err:
                    logger.error(f"Fallback connection also failed: {fallback_err}")
            self._driver = None

    async def close(self) -> None:
        """Close driver connection pool gracefully."""
        if self._driver:
            await self._driver.close()
            self._driver = None
            logger.info("CognoDB driver pool closed successfully.")

    def get_driver(self) -> AsyncDriver:
        """Return the active driver instance or raise clear connection exception."""
        if self._driver is None:
            raise ServiceUnavailable(
                "CognoDB database is currently unreachable. Please check your credentials and internet connection."
            )
        return self._driver

    async def check_health(self) -> Dict[str, Any]:
        """Perform database ping healthcheck."""
        if self._driver is None:
            return {"status": "offline", "connected": False, "error": "Driver not initialized"}
        try:
            await self._driver.verify_connectivity()
            async with self._driver.session() as session:
                result = await session.run("RETURN 1 AS ping")
                record = await result.single()
                if record and record["ping"] == 1:
                    return {"status": "healthy", "connected": True, "uri": settings.COGNODB_URI}
            return {"status": "degraded", "connected": False}
        except Exception as e:
            return {"status": "offline", "connected": False, "error": str(e)}

    async def execute_query(self, query: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """
        Execute a parameterized openCypher query safely.
        """
        driver = self.get_driver()
        parameters = parameters or {}
        try:
            async with driver.session() as session:
                result = await session.run(query, parameters)
                records = await result.data()
                return records
        except ServiceUnavailable as e:
            logger.error(f"CognoDB unavailable: {e}")
            raise
        except Exception as e:
            logger.error(f"Cypher execution error: {e}")
            raise

db_manager = CognoDBManager()
