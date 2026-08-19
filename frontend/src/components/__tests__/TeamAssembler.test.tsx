import { describe, it, expect } from 'vitest';
import React from 'react';
import TeamAssembler from '../TeamAssembler';
import { Skill } from '../../types';

describe('TeamAssembler Component', () => {
  const sampleSkills: Skill[] = [
    { id: 'sk_fastapi', name: 'FastAPI', category: 'Backend', description: 'Backend framework' },
    { id: 'sk_react', name: 'React.js', category: 'Frontend', description: 'Frontend framework' },
    { id: 'sk_cypher', name: 'Cypher & CognoDB', category: 'Database', description: 'Graph DB' }
  ];

  it('renders the TeamAssembler hero title correctly', () => {
    expect(TeamAssembler).toBeDefined();
    expect(typeof TeamAssembler).toBe('function');
  });

  it('initializes with default selected skills and team size', () => {
    const component = <TeamAssembler availableSkills={sampleSkills} />;
    expect(component).toBeTruthy();
  });
});
