const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail?.message || 'CognoDB API is unreachable');
  }
  return res.json();
}

export async function fetchGraphVisualization() {
  const res = await fetch(`${API_BASE}/graph/visualization`);
  if (!res.ok) throw new Error('Failed to load graph visualization payload');
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch(`${API_BASE}/skills`);
  if (!res.ok) throw new Error('Failed to load skills list');
  return res.json();
}

export async function createSkill(payload) {
  const res = await fetch(`${API_BASE}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create skill in CognoDB');
  return res.json();
}

export async function fetchEmployees() {
  const res = await fetch(`${API_BASE}/employees`);
  if (!res.ok) throw new Error('Failed to load employees list');
  return res.json();
}

export async function createEmployee(payload) {
  const res = await fetch(`${API_BASE}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to create employee in CognoDB');
  return res.json();
}

export async function fetchMultiHopSkillNetwork(skillName) {
  const res = await fetch(`${API_BASE}/skills/multi-hop-network?skill=${encodeURIComponent(skillName)}`);
  if (!res.ok) throw new Error(`Multi-hop Cypher traversal failed for ${skillName}`);
  return res.json();
}

export async function assembleTeam(requiredSkills, teamSize = 2) {
  const res = await fetch(`${API_BASE}/teams/assemble?team_size=${teamSize}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requiredSkills)
  });
  if (!res.ok) throw new Error('Team assembly Cypher query failed');
  return res.json();
}

export async function fetchKnowledgeSilos() {
  const res = await fetch(`${API_BASE}/teams/knowledge-silos`);
  if (!res.ok) throw new Error('Failed to load knowledge silos');
  return res.json();
}
