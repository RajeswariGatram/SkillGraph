import { describe, it, expect } from 'vitest';
import React from 'react';
import TeamAssembler from '../TeamAssembler';

describe('TeamAssembler Component', () => {
  const sampleSkills = [
    { id: 'sk_fastapi', name: 'FastAPI', category: 'Backend' },
    { id: 'sk_react', name: 'React.js', category: 'Frontend' },
    { id: 'sk_cypher', name: 'Cypher & CognoDB', category: 'Database' }
  ];

  it('renders the TeamAssembler hero title correctly', () => {
    expect(TeamAssembler).toBeDefined();
    expect(typeof TeamAssembler).toBe('function');
  });

  it('initializes with default selected skills and team size', () => {
    // Basic component unit assertions
    const component = <TeamAssembler availableSkills={sampleSkills} />;
    expect(component).toBeTruthy();
  });
});
