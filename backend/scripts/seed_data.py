import os
import sys
import asyncio
import logging
from pathlib import Path

# Add backend directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))

from neo4j import AsyncGraphDatabase
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("seed_data")

# Real / Realistic Corporate Seed Data
DEPARTMENTS = [
    {"id": "dep_eng", "name": "Software Engineering", "location": "San Francisco"},
    {"id": "dep_ds", "name": "Data Science & AI", "location": "New York"},
    {"id": "dep_devops", "name": "Cloud Platform & DevOps", "location": "Austin"},
    {"id": "dep_sec", "name": "Cybersecurity", "location": "Remote"},
]

SKILLS = [
    {"id": "sk_fastapi", "name": "FastAPI", "category": "Backend"},
    {"id": "sk_python", "name": "Python", "category": "Backend"},
    {"id": "sk_react", "name": "React.js", "category": "Frontend"},
    {"id": "sk_cypher", "name": "Cypher & CognoDB", "category": "Database"},
    {"id": "sk_postgres", "name": "PostgreSQL", "category": "Database"},
    {"id": "sk_docker", "name": "Docker & K8s", "category": "DevOps"},
    {"id": "sk_pytorch", "name": "PyTorch & LLMs", "category": "AI/ML"},
    {"id": "sk_sysarch", "name": "System Architecture", "category": "Engineering"},
    {"id": "sk_graphql", "name": "GraphQL", "category": "Backend"},
    {"id": "sk_tailwind", "name": "Tailwind CSS", "category": "Frontend"}
]

EMPLOYEES = [
    {"id": "emp_alex", "name": "Alex Rivera", "title": "Staff Backend Engineer", "email": "alex.rivera@test.com", "dept_id": "dep_eng", "skills": ["sk_fastapi", "sk_python", "sk_cypher", "sk_sysarch"]},
    {"id": "emp_sarah", "name": "Sarah Chen", "title": "Principal UI/UX Architect", "email": "sarah.chen@test.com", "dept_id": "dep_eng", "skills": ["sk_react", "sk_tailwind", "sk_graphql"]},
    {"id": "emp_david", "name": "David Kim", "title": "Lead Data Scientist", "email": "david.kim@test.com", "dept_id": "dep_ds", "skills": ["sk_python", "sk_pytorch", "sk_cypher"]},
    {"id": "emp_elena", "name": "Elena Rostova", "title": "DevOps Lead Specialist", "email": "elena.rostova@test.com", "dept_id": "dep_devops", "skills": ["sk_docker", "sk_sysarch", "sk_postgres"]},
    {"id": "emp_marcus", "name": "Marcus Vance", "title": "Senior Graph Engineer", "email": "marcus.vance@test.com", "dept_id": "dep_eng", "skills": ["sk_cypher", "sk_fastapi", "sk_postgres"]},
    {"id": "emp_priya", "name": "Priya Sharma", "title": "Frontend Engineer", "email": "priya.sharma@test.com", "dept_id": "dep_eng", "skills": ["sk_react", "sk_graphql"]},
    {"id": "emp_james", "name": "James Wilson", "title": "AI Research Scientist", "email": "james.wilson@test.com", "dept_id": "dep_ds", "skills": ["sk_pytorch", "sk_python"]},
    {"id": "emp_hannah", "name": "Hannah Abbott", "title": "Cloud Security Lead", "email": "hannah.abbott@test.com", "dept_id": "dep_sec", "skills": ["sk_docker", "sk_sysarch"]}
]

PROJECTS = [
    {"id": "proj_cognoscan", "name": "CognoDB Graph Migration", "status": "Active", "tech": ["Cypher & CognoDB", "FastAPI", "Docker & K8s"]},
    {"id": "proj_airadar", "name": "AI Talent Radar", "status": "Active", "tech": ["PyTorch & LLMs", "React.js", "FastAPI"]},
    {"id": "proj_cloudsec", "name": "Zero-Trust Cloud Mesh", "status": "Planning", "tech": ["Docker & K8s", "System Architecture"]},
    {"id": "proj_designsys", "name": "Next-Gen Design System", "status": "Completed", "tech": ["React.js", "Tailwind CSS"]}
]

EMPLOYEE_PROJECTS = [
    {"emp_id": "emp_alex", "proj_id": "proj_cognoscan", "role": "Tech Lead"},
    {"emp_id": "emp_marcus", "proj_id": "proj_cognoscan", "role": "Core Graph Developer"},
    {"emp_id": "emp_elena", "proj_id": "proj_cognoscan", "role": "DevOps Integrator"},
    {"emp_id": "emp_david", "proj_id": "proj_airadar", "role": "AI Architect"},
    {"emp_id": "emp_alex", "proj_id": "proj_airadar", "role": "API Backend Lead"},
    {"emp_id": "emp_sarah", "proj_id": "proj_airadar", "role": "Frontend Designer"},
    {"emp_id": "emp_sarah", "proj_id": "proj_designsys", "role": "Design Lead"},
    {"emp_id": "emp_priya", "proj_id": "proj_designsys", "role": "UI Engineer"},
    {"emp_id": "emp_hannah", "proj_id": "proj_cloudsec", "role": "Security Architect"},
    {"emp_id": "emp_elena", "proj_id": "proj_cloudsec", "role": "Infrastructure Engineer"}
]

COLLABORATIONS = [
    {"emp1": "emp_alex", "emp2": "emp_marcus", "count": 4},
    {"emp1": "emp_alex", "emp2": "emp_sarah", "count": 3},
    {"emp1": "emp_alex", "emp2": "emp_david", "count": 2},
    {"emp1": "emp_sarah", "emp2": "emp_priya", "count": 5},
    {"emp1": "emp_david", "emp2": "emp_james", "count": 6},
    {"emp1": "emp_elena", "emp2": "emp_hannah", "count": 3}
]

async def seed_database():
    uri = settings.COGNODB_URI
    logger.info(f"Connecting to CognoDB at {uri}...")
    driver = None
    try:
        driver = AsyncGraphDatabase.driver(
            uri,
            auth=(settings.COGNODB_USER, settings.COGNODB_PASSWORD)
        )
        await driver.verify_connectivity()
    except Exception as err:
        logger.warning(f"Standard bolt+s connection failed: {err}")
        if uri.startswith("bolt+s://"):
            fallback_uri = uri.replace("bolt+s://", "bolt+ssc://")
            logger.info(f"Retrying connection with self-signed certificate URI: {fallback_uri}...")
            if driver:
                await driver.close()
            driver = AsyncGraphDatabase.driver(
                fallback_uri,
                auth=(settings.COGNODB_USER, settings.COGNODB_PASSWORD)
            )
            await driver.verify_connectivity()
        else:
            raise err

    try:
        logger.info("Connection verified. Clearing existing data...")

        async with driver.session() as session:
            # 1. Clear database
            await session.run("MATCH (n) DETACH DELETE n")
            logger.info("Cleared old nodes and relationships.")

            # 2. Create Departments
            for dep in DEPARTMENTS:
                await session.run(
                    "CREATE (:Department {id: $id, name: $name, location: $location})",
                    dep
                )
            logger.info(f"Created {len(DEPARTMENTS)} Departments.")

            # 3. Create Skills
            for sk in SKILLS:
                await session.run(
                    "CREATE (:Skill {id: $id, name: $name, category: $category})",
                    sk
                )
            logger.info(f"Created {len(SKILLS)} Skills.")

            # 4. Create Projects
            for proj in PROJECTS:
                await session.run(
                    "CREATE (:Project {id: $id, name: $name, status: $status, tech_stack: $tech})",
                    proj
                )
            logger.info(f"Created {len(PROJECTS)} Projects.")

            # 5. Create Employees and link to Department & Skills
            for emp in EMPLOYEES:
                skills_list = emp["skills"]
                emp_data = {
                    "id": emp["id"],
                    "name": emp["name"],
                    "title": emp["title"],
                    "email": emp["email"],
                    "dept_id": emp["dept_id"]
                }
                # Create Employee Node
                await session.run(
                    "CREATE (:Employee {id: $id, name: $name, title: $title, email: $email})",
                    emp_data
                )
                # Link to Department
                await session.run(
                    """
                    MATCH (e:Employee {id: $id}), (d:Department {id: $dept_id})
                    CREATE (e)-[:BELONGS_TO]->(d)
                    """,
                    {"id": emp["id"], "dept_id": emp["dept_id"]}
                )
                # Link to Skills
                for sk_id in skills_list:
                    await session.run(
                        """
                        MATCH (e:Employee {id: $emp_id}), (s:Skill {id: $sk_id})
                        CREATE (e)-[:HAS_SKILL {proficiency: 'Expert'}]->(s)
                        """,
                        {"emp_id": emp["id"], "sk_id": sk_id}
                    )
            logger.info(f"Created {len(EMPLOYEES)} Employees with Department & Skill edges.")

            # 6. Link Employees to Projects
            for ep in EMPLOYEE_PROJECTS:
                await session.run(
                    """
                    MATCH (e:Employee {id: $emp_id}), (p:Project {id: $proj_id})
                    CREATE (e)-[:WORKED_ON {role: $role}]->(p)
                    """,
                    ep
                )
            logger.info(f"Created {len(EMPLOYEE_PROJECTS)} Project assignment edges.")

            # 7. Create Collaboration edges
            for col in COLLABORATIONS:
                await session.run(
                    """
                    MATCH (e1:Employee {id: $emp1}), (e2:Employee {id: $emp2})
                    CREATE (e1)-[:COLLABORATED_WITH {projects_count: $count}]->(e2)
                    CREATE (e2)-[:COLLABORATED_WITH {projects_count: $count}]->(e1)
                    """,
                    col
                )
            logger.info(f"Created {len(COLLABORATIONS)} Collaboration relationship edges.")

            logger.info("Successfully seeded CognoDB graph database!")

    except Exception as e:
        logger.error(f"Error during CognoDB seeding: {str(e)}")
        sys.exit(1)
    finally:
        await driver.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
