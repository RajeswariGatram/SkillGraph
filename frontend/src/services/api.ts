import {
  Skill,
  Employee,
  GraphPayload,
  TeamAssemblyResult,
  KnowledgeSilo,
  CreateEmployeeInput,
  HealthCheckResponse
} from '../types';

const envUrl = (import.meta.env.VITE_API_URL || '/api/v1').trim().replace(/\/+$/, '');
const API_BASE = envUrl.endsWith('/api/v1') ? envUrl : `${envUrl}/api/v1`;

export async function fetchHealth(): Promise<HealthCheckResponse> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail?.message || 'CognoDB API is unreachable');
  }
  return res.json();
}

export async function fetchGraphVisualization(): Promise<GraphPayload> {
  const res = await fetch(`${API_BASE}/graph/visualization`);
  if (!res.ok) throw new Error('Failed to load graph visualization payload');
  return res.json();
}

export async function fetchSkills(): Promise<Skill[]> {
  const res = await fetch(`${API_BASE}/skills`);
  if (!res.ok) throw new Error('Failed to load skills list');
  return res.json();
}

export async function createSkill(payload: Omit<Skill, 'id'> | Skill): Promise<Skill> {
  const res = await fetch(`${API_BASE}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create skill in CognoDB');
  return res.json();
}

export async function fetchEmployees(): Promise<Employee[]> {
  const res = await fetch(`${API_BASE}/employees`);
  if (!res.ok) throw new Error('Failed to load employees list');
  return res.json();
}

export async function createEmployee(payload: CreateEmployeeInput | Omit<Employee, 'id'> | Employee): Promise<Employee> {
  const res = await fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create employee in CognoDB');
  return res.json();
}

export async function fetchMultiHopSkillNetwork(skillName: string): Promise<GraphPayload> {
  const res = await fetch(`${API_BASE}/skills/multi-hop-network?skill=${encodeURIComponent(skillName)}`);
  if (!res.ok) throw new Error(`Multi-hop Cypher traversal failed for ${skillName}`);
  return res.json();
}

export async function assembleTeam(requiredSkills: string[], teamSize: number = 2): Promise<TeamAssemblyResult> {
  const res = await fetch(`${API_BASE}/teams/assemble?team_size=${teamSize}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requiredSkills)
  });
  if (!res.ok) throw new Error('Team assembly Cypher query failed');
  return res.json();
}

export async function fetchKnowledgeSilos(): Promise<KnowledgeSilo[]> {
  const res = await fetch(`${API_BASE}/teams/knowledge-silos`);
  if (!res.ok) throw new Error('Failed to load knowledge silos');
  return res.json();
}
