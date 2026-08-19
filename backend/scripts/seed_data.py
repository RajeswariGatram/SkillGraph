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
    {"id": "dep_prod", "name": "Product & Design", "location": "Seattle"},
    {"id": "dep_mobile", "name": "Mobile & Edge Computing", "location": "Chicago"},
]

SKILLS = [
    {"id": "sk_fastapi", "name": "FastAPI", "category": "Backend"},
    {"id": "sk_python", "name": "Python", "category": "Backend"},
    {"id": "sk_typescript", "name": "TypeScript", "category": "Frontend"},
    {"id": "sk_react", "name": "React.js", "category": "Frontend"},
    {"id": "sk_nextjs", "name": "Next.js", "category": "Frontend"},
    {"id": "sk_cypher", "name": "Cypher & CognoDB", "category": "Database"},
    {"id": "sk_postgres", "name": "PostgreSQL", "category": "Database"},
    {"id": "sk_redis", "name": "Redis & Caching", "category": "Database"},
    {"id": "sk_docker", "name": "Docker & K8s", "category": "DevOps"},
    {"id": "sk_aws", "name": "AWS & Cloud Infra", "category": "DevOps"},
    {"id": "sk_pytorch", "name": "PyTorch & LLMs", "category": "AI/ML"},
    {"id": "sk_sysarch", "name": "System Architecture", "category": "Engineering"},
    {"id": "sk_graphql", "name": "GraphQL", "category": "Backend"},
    {"id": "sk_go", "name": "Go & Microservices", "category": "Backend"},
    {"id": "sk_rust", "name": "Rust & Systems", "category": "Engineering"},
    {"id": "sk_mobile", "name": "Flutter & React Native", "category": "Mobile"},
    {"id": "sk_zerotrust", "name": "Zero-Trust Security", "category": "Security"},
    {"id": "sk_tailwind", "name": "Tailwind CSS", "category": "Frontend"}
]

EMPLOYEES = [
    {"id": "emp_alex", "name": "Alex Rivera", "title": "Staff Backend Engineer", "email": "alex.rivera@test.com", "dept_id": "dep_eng", "skills": ["sk_fastapi", "sk_python", "sk_cypher", "sk_sysarch", "sk_postgres"]},
    {"id": "emp_sarah", "name": "Sarah Chen", "title": "Principal UI/UX Architect", "email": "sarah.chen@test.com", "dept_id": "dep_eng", "skills": ["sk_react", "sk_typescript", "sk_tailwind", "sk_graphql", "sk_nextjs"]},
    {"id": "emp_david", "name": "David Kim", "title": "Lead Data Scientist", "email": "david.kim@test.com", "dept_id": "dep_ds", "skills": ["sk_python", "sk_pytorch", "sk_cypher", "sk_postgres"]},
    {"id": "emp_elena", "name": "Elena Rostova", "title": "DevOps Lead Specialist", "email": "elena.rostova@test.com", "dept_id": "dep_devops", "skills": ["sk_docker", "sk_aws", "sk_sysarch", "sk_postgres"]},
    {"id": "emp_marcus", "name": "Marcus Vance", "title": "Senior Graph Engineer", "email": "marcus.vance@test.com", "dept_id": "dep_eng", "skills": ["sk_cypher", "sk_fastapi", "sk_postgres", "sk_redis"]},
    {"id": "emp_priya", "name": "Priya Sharma", "title": "Frontend Engineer", "email": "priya.sharma@test.com", "dept_id": "dep_eng", "skills": ["sk_react", "sk_typescript", "sk_graphql", "sk_tailwind"]},
    {"id": "emp_james", "name": "James Wilson", "title": "AI Research Scientist", "email": "james.wilson@test.com", "dept_id": "dep_ds", "skills": ["sk_pytorch", "sk_python", "sk_fastapi"]},
    {"id": "emp_hannah", "name": "Hannah Abbott", "title": "Cloud Security Lead", "email": "hannah.abbott@test.com", "dept_id": "dep_sec", "skills": ["sk_docker", "sk_zerotrust", "sk_sysarch", "sk_aws"]},
    {"id": "emp_liam", "name": "Liam O'Connor", "title": "Senior Go Systems Engineer", "email": "liam.oconnor@test.com", "dept_id": "dep_eng", "skills": ["sk_go", "sk_sysarch", "sk_docker", "sk_redis"]},
    {"id": "emp_maya", "name": "Maya Lin", "title": "Staff Mobile Engineer", "email": "maya.lin@test.com", "dept_id": "dep_mobile", "skills": ["sk_mobile", "sk_typescript", "sk_graphql"]},
    {"id": "emp_carlos", "name": "Carlos Mendez", "title": "Full-Stack Engineer", "email": "carlos.mendez@test.com", "dept_id": "dep_eng", "skills": ["sk_fastapi", "sk_react", "sk_typescript", "sk_postgres"]},
    {"id": "emp_aisha", "name": "Aisha Patel", "title": "ML Platform Engineer", "email": "aisha.patel@test.com", "dept_id": "dep_ds", "skills": ["sk_pytorch", "sk_python", "sk_docker", "sk_aws"]},
    {"id": "emp_victor", "name": "Victor Hugo", "title": "Lead Product Designer", "email": "victor.hugo@test.com", "dept_id": "dep_prod", "skills": ["sk_react", "sk_tailwind"]},
    {"id": "emp_sophie", "name": "Sophie Taylor", "title": "Site Reliability Engineer", "email": "sophie.taylor@test.com", "dept_id": "dep_devops", "skills": ["sk_aws", "sk_docker", "sk_go", "sk_redis"]},
    {"id": "emp_kenji", "name": "Kenji Sato", "title": "Rust Systems Architect", "email": "kenji.sato@test.com", "dept_id": "dep_eng", "skills": ["sk_rust", "sk_sysarch", "sk_redis"]},
    {"id": "emp_rachel", "name": "Rachel Green", "title": "Database Performance Engineer", "email": "rachel.green@test.com", "dept_id": "dep_eng", "skills": ["sk_postgres", "sk_cypher", "sk_redis"]},
    {"id": "emp_omar", "name": "Omar Farooq", "title": "Application Security Specialist", "email": "omar.farooq@test.com", "dept_id": "dep_sec", "skills": ["sk_zerotrust", "sk_python", "sk_fastapi"]},
    {"id": "emp_emily", "name": "Emily Zhang", "title": "Growth & Product Lead", "email": "emily.zhang@test.com", "dept_id": "dep_prod", "skills": ["sk_typescript", "sk_nextjs", "sk_react"]}
]

PROJECTS = [
    {"id": "proj_cognoscan", "name": "CognoDB Graph Migration", "status": "Active", "tech": ["Cypher & CognoDB", "FastAPI", "Docker & K8s"]},
    {"id": "proj_airadar", "name": "AI Talent Radar", "status": "Active", "tech": ["PyTorch & LLMs", "React.js", "FastAPI"]},
    {"id": "proj_cloudsec", "name": "Zero-Trust Cloud Mesh", "status": "Planning", "tech": ["Docker & K8s", "Zero-Trust Security", "System Architecture"]},
    {"id": "proj_designsys", "name": "Next-Gen Design System", "status": "Completed", "tech": ["React.js", "TypeScript", "Tailwind CSS"]},
    {"id": "proj_mobileapp", "name": "Enterprise Field App", "status": "Active", "tech": ["Flutter & React Native", "GraphQL", "TypeScript"]},
    {"id": "proj_microservices", "name": "Go Event Mesh Pipeline", "status": "Active", "tech": ["Go & Microservices", "Redis & Caching", "AWS & Cloud Infra"]},
    {"id": "proj_rustcore", "name": "High-Throughput Rust Engine", "status": "Planning", "tech": ["Rust & Systems", "System Architecture"]},
    {"id": "proj_nextportal", "name": "Customer Self-Service Portal", "status": "Active", "tech": ["Next.js", "TypeScript", "FastAPI"]}
]

EMPLOYEE_PROJECTS = [
    {"emp_id": "emp_alex", "proj_id": "proj_cognoscan", "role": "Tech Lead"},
    {"emp_id": "emp_marcus", "proj_id": "proj_cognoscan", "role": "Core Graph Developer"},
    {"emp_id": "emp_elena", "proj_id": "proj_cognoscan", "role": "DevOps Integrator"},
    {"emp_id": "emp_rachel", "proj_id": "proj_cognoscan", "role": "Database Tuning Lead"},
    {"emp_id": "emp_david", "proj_id": "proj_airadar", "role": "AI Architect"},
    {"emp_id": "emp_alex", "proj_id": "proj_airadar", "role": "API Backend Lead"},
    {"emp_id": "emp_sarah", "proj_id": "proj_airadar", "role": "Frontend Designer"},
    {"emp_id": "emp_aisha", "proj_id": "proj_airadar", "role": "ML Infra Engineer"},
    {"emp_id": "emp_sarah", "proj_id": "proj_designsys", "role": "Design Lead"},
    {"emp_id": "emp_priya", "proj_id": "proj_designsys", "role": "UI Engineer"},
    {"emp_id": "emp_victor", "proj_id": "proj_designsys", "role": "UX Lead"},
    {"emp_id": "emp_hannah", "proj_id": "proj_cloudsec", "role": "Security Architect"},
    {"emp_id": "emp_elena", "proj_id": "proj_cloudsec", "role": "Infrastructure Engineer"},
    {"emp_id": "emp_omar", "proj_id": "proj_cloudsec", "role": "SecOps Tester"},
    {"emp_id": "emp_maya", "proj_id": "proj_mobileapp", "role": "Mobile Lead Architect"},
    {"emp_id": "emp_carlos", "proj_id": "proj_mobileapp", "role": "Full-Stack Integrator"},
    {"emp_id": "emp_liam", "proj_id": "proj_microservices", "role": "Systems Lead"},
    {"emp_id": "emp_sophie", "proj_id": "proj_microservices", "role": "SRE Integrator"},
    {"emp_id": "emp_kenji", "proj_id": "proj_rustcore", "role": "Engine Architect"},
    {"emp_id": "emp_emily", "proj_id": "proj_nextportal", "role": "Product Owner"},
    {"emp_id": "emp_carlos", "proj_id": "proj_nextportal", "role": "Lead Web Developer"}
]

COLLABORATIONS = [
    {"emp1": "emp_alex", "emp2": "emp_marcus", "count": 4},
    {"emp1": "emp_alex", "emp2": "emp_sarah", "count": 3},
    {"emp1": "emp_alex", "emp2": "emp_david", "count": 2},
    {"emp1": "emp_sarah", "emp2": "emp_priya", "count": 5},
    {"emp1": "emp_david", "emp2": "emp_james", "count": 6},
    {"emp1": "emp_david", "emp2": "emp_aisha", "count": 4},
    {"emp1": "emp_elena", "emp2": "emp_hannah", "count": 3},
    {"emp1": "emp_elena", "emp2": "emp_sophie", "count": 5},
    {"emp1": "emp_liam", "emp2": "emp_kenji", "count": 3},
    {"emp1": "emp_maya", "emp2": "emp_carlos", "count": 4},
    {"emp1": "emp_victor", "emp2": "emp_sarah", "count": 6},
    {"emp1": "emp_hannah", "emp2": "emp_omar", "count": 4},
    {"emp1": "emp_marcus", "emp2": "emp_rachel", "count": 5}
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

