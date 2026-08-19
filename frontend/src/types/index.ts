export interface Skill {
  id: string;
  name: string;
  category: string;
  description: string;
}

export interface Employee {
  id: string;
  name: string;
  title?: string;
  role?: string;
  department: string;
  email?: string;
  skills: string[];
}

export interface CreateEmployeeInput {
  name: string;
  title: string;
  email: string;
  department_id: string;
  skill_ids?: string[];
}

export interface GraphNode {
  id: string;
  label: string;
  group: 'employee' | 'skill';
  shape?: string;
  color?: string | { background: string; border: string; highlight: { background: string; border: string } };
  title?: string;
  font?: { color: string; face: string };
  size?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
  arrows?: string;
  color?: string | { color: string; highlight: string };
  width?: number;
  dashes?: boolean;
}

export interface GraphPayload {
  nodes: GraphNode[];
  edges: GraphEdge[];
  total_skills?: number;
  total_employees?: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  matched_skills: string[];
  department?: string;
}

export interface TeamAssemblyResult {
  team: TeamMember[];
  coverage: number;
  unmatched_skills: string[];
  total_required_skills?: number;
}

export interface KnowledgeSilo {
  skill: string;
  employee_count: number;
  employees: string[];
  risk_level: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface HealthCheckResponse {
  status: string;
  database?: string;
  version?: string;
}
