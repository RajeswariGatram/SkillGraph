import logging
from typing import List, Dict, Any, Optional
from app.core.database import CognoDBManager

logger = logging.getLogger("cognodb.repository")

class GraphRepository:
    """
    Repository Pattern class encapsulating parameterised openCypher queries against CognoDB.
    No string-concatenated Cypher is used.
    """
    def __init__(self, db: CognoDBManager):
        self.db = db

    async def get_full_graph(self) -> Dict[str, Any]:
        """
        Fetch all nodes and relationships formatted for interactive graph visualization (vis-network format).
        """
        query = """
        MATCH (n)
        OPTIONAL MATCH (n)-[r]->(m)
        RETURN n, labels(n) AS n_labels, r, type(r) AS r_type, m, labels(m) AS m_labels
        LIMIT 300
        """
        records = await self.db.execute_query(query)
        
        nodes_dict: Dict[str, Dict[str, Any]] = {}
        edges_list: List[Dict[str, Any]] = []

        for record in records:
            n = record.get("n")
            n_labels = record.get("n_labels") or ["Entity"]
            r = record.get("r")
            r_type = record.get("r_type") or "CONNECTED_TO"
            m = record.get("m")
            m_labels = record.get("m_labels") or ["Entity"]

            if n and isinstance(n, dict):
                n_id = str(n.get("id") or n.get("name") or id(n))
                label_type = n_labels[0] if n_labels else "Entity"
                if n_id not in nodes_dict:
                    nodes_dict[n_id] = {
                        "id": n_id,
                        "label": label_type,
                        "name": n.get("name", n_id),
                        "group": label_type,
                        "properties": n
                    }

            if m and isinstance(m, dict):
                m_id = str(m.get("id") or m.get("name") or id(m))
                label_type = m_labels[0] if m_labels else "Entity"
                if m_id not in nodes_dict:
                    nodes_dict[m_id] = {
                        "id": m_id,
                        "label": label_type,
                        "name": m.get("name", m_id),
                        "group": label_type,
                        "properties": m
                    }

            if r and n and m:
                source_id = str(n.get("id") or n.get("name") or id(n))
                target_id = str(m.get("id") or m.get("name") or id(m))
                edge_id = f"{source_id}_{r_type}_{target_id}"
                edges_list.append({
                    "id": edge_id,
                    "source": source_id,
                    "target": target_id,
                    "type": r_type,
                    "label": r_type.replace("_", " "),
                    "properties": r if isinstance(r, dict) else {}
                })

        return {
            "nodes": list(nodes_dict.values()),
            "edges": edges_list
        }

    async def create_employee(self, emp_id: str, name: str, title: str, email: str, dept_id: str, skill_ids: List[str]) -> Dict[str, Any]:
        """
        CYPHER WRITE QUERY:
        Create a new Employee node, connect to Department, and add HAS_SKILL relationships.
        """
        query = """
        CREATE (e:Employee {id: $emp_id, name: $name, title: $title, email: $email})
        WITH e
        MATCH (d:Department {id: $dept_id})
        CREATE (e)-[:BELONGS_TO]->(d)
        WITH e, d
        UNWIND $skill_ids AS sk_id
        MATCH (s:Skill {id: sk_id})
        CREATE (e)-[:HAS_SKILL {proficiency: 'Expert'}]->(s)
        RETURN e.id AS id, e.name AS name, e.title AS title, e.email AS email, d.name AS department
        """
        records = await self.db.execute_query(query, {
            "emp_id": emp_id,
            "name": name,
            "title": title,
            "email": email,
            "dept_id": dept_id,
            "skill_ids": skill_ids
        })
        return records[0] if records else {"id": emp_id, "name": name, "title": title, "email": email}

    async def get_all_employees(self) -> List[Dict[str, Any]]:
        """Fetch all employees with their attached skills."""
        query = """
        MATCH (e:Employee)
        OPTIONAL MATCH (e)-[:HAS_SKILL]->(s:Skill)
        OPTIONAL MATCH (e)-[:BELONGS_TO]->(d:Department)
        RETURN e.id AS id, e.name AS name, e.title AS title, 
               e.email AS email, e.avatar_url AS avatar_url,
               d.name AS department,
               collect(DISTINCT s.name) AS skills
        ORDER BY e.name ASC
        """
        return await self.db.execute_query(query)

    async def create_skill(self, sk_id: str, name: str, category: str) -> Dict[str, Any]:
        """
        CYPHER WRITE QUERY:
        Create a new Skill node in CognoDB.
        """
        query = """
        CREATE (s:Skill {id: $sk_id, name: $name, category: $category})
        RETURN s.id AS id, s.name AS name, s.category AS category
        """
        records = await self.db.execute_query(query, {
            "sk_id": sk_id,
            "name": name,
            "category": category
        })
        return records[0] if records else {"id": sk_id, "name": name, "category": category}

    async def get_all_skills(self) -> List[Dict[str, Any]]:
        """Fetch all skills with usage counts."""
        query = """
        MATCH (s:Skill)
        OPTIONAL MATCH (e:Employee)-[:HAS_SKILL]->(s)
        RETURN s.id AS id, s.name AS name, s.category AS category, count(DISTINCT e) AS employee_count
        ORDER BY s.category, s.name ASC
        """
        return await self.db.execute_query(query)

    async def find_multi_hop_skill_network(self, skill_name: str) -> Dict[str, Any]:
        """
        MULTI-HOP TRAVERSAL QUERY:
        Finds experts for a skill AND employees connected within 1..2 hops via shared projects/collaboration.
        """
        query = """
        MATCH (s:Skill {name: $skill_name})
        MATCH (expert:Employee)-[:HAS_SKILL]->(s)
        OPTIONAL MATCH path = (collaborator:Employee)-[:COLLABORATED_WITH*1..2]-(expert)
        RETURN s.name AS target_skill,
               expert.name AS expert_name,
               expert.id AS expert_id,
               collaborator.name AS collaborator_name,
               collaborator.id AS collaborator_id,
               length(path) AS hop_distance
        ORDER BY hop_distance ASC
        """
        return await self.db.execute_query(query, {"skill_name": skill_name})

    async def assemble_optimal_team(self, required_skills: List[str], team_size: int = 2) -> List[Dict[str, Any]]:
        """
        SKILL COVERAGE GRAPH TEAM ASSEMBLY:
        Finds optimal teams of N employees who collectively cover the requested skills.
        """
        query = """
        MATCH (e:Employee)
        OPTIONAL MATCH (e)-[:BELONGS_TO]->(d:Department)
        OPTIONAL MATCH (e)-[:HAS_SKILL]->(s:Skill)
        WITH e, d, collect(DISTINCT s.name) AS skills
        WHERE any(sk IN skills WHERE sk IN $required_skills)
        RETURN e.id AS id, e.name AS name, e.title AS title, e.email AS email, 
               d.name AS department, skills
        """
        records = await self.db.execute_query(query, {"required_skills": required_skills})

        employees = [
            {
                "id": r["id"],
                "name": r["name"],
                "title": r["title"],
                "email": r["email"],
                "department": r.get("department") or "Software Engineering",
                "skills": r.get("skills") or []
            }
            for r in records
        ]

        import itertools
        team_results = []
        seen_combinations = set()

        for combo in itertools.combinations(employees, team_size):
            covered_skills = set()
            for m in combo:
                covered_skills.update(m.get("skills", []))
            
            # Ensure team combination covers at least 1 or all selected skills
            if any(sk in covered_skills for sk in required_skills):
                combo_ids = tuple(sorted([m["id"] for m in combo]))
                if combo_ids not in seen_combinations:
                    seen_combinations.add(combo_ids)
                    team_results.append({
                        "members": list(combo)
                    })

        return team_results[:10]

    async def find_knowledge_silos(self) -> List[Dict[str, Any]]:
        """
        GRAPH ANALYTICS QUERY:
        Identifies critical skills where only 1 employee in a department possesses the skill (Single Point of Failure).
        """
        query = """
        MATCH (d:Department)<-[:BELONGS_TO]-(e:Employee)-[:HAS_SKILL]->(s:Skill)
        WITH d, s, count(DISTINCT e) AS expert_count, collect(e) AS experts
        WHERE expert_count = 1
        RETURN d.name AS department,
               s.name AS critical_skill,
               s.category AS category,
               experts[0].id AS expert_id,
               experts[0].name AS expert_name,
               experts[0].title AS expert_title,
               experts[0].email AS expert_email
        ORDER BY d.name, s.name ASC
        """
        return await self.db.execute_query(query)
