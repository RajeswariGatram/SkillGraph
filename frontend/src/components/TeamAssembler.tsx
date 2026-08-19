import React, { useState } from 'react';
import { Sparkles, Users, CheckCircle2 } from 'lucide-react';
import { assembleTeam } from '../services/api';
import { Skill } from '../types';

export interface TeamMember {
  id?: string;
  name: string;
  title?: string;
  department?: string;
  email?: string;
  skills?: string[];
}

export interface RecommendedPartnership {
  members: TeamMember[];
}

export interface TeamAssembleResponse {
  total_matches?: number;
  recommended_partnerships?: RecommendedPartnership[];
}

export interface TeamAssemblerProps {
  availableSkills?: Skill[];
}

export default function TeamAssembler({ availableSkills = [] }: TeamAssemblerProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['FastAPI', 'React.js', 'Cypher & CognoDB']);
  const [teamSize, setTeamSize] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TeamAssembleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const handleAssemble = async (targetSize = teamSize) => {
    if (selectedSkills.length === 0) return;
    setLoading(true);
    setError(null);
    try {
      const data: any = await assembleTeam(selectedSkills, targetSize);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to assemble team.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px 24px', maxWidth: '1120px', margin: '0 auto' }}>
      {/* Clean Hero Title */}
      <div style={{ marginBottom: '14px' }}>
        <h2 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
          Assemble Optimal Teams
        </h2>
      </div>

      {/* Skill & Team Size Selector Controls */}
      <div className="glass-panel" style={{ padding: '18px 20px', marginBottom: '20px' }}>

        {/* Header row: Label & Team Size Input */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Select Required Project Skills
          </label>

          {/* Custom Stepper Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(5, 8, 17, 0.6)', padding: '5px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <Users size={14} color="var(--accent-cyan)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Team Size:</span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.9)', padding: '2px 5px', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
              <button
                type="button"
                onClick={() => setTeamSize(Math.max(1, teamSize - 1))}
                disabled={teamSize <= 1}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '5px',
                  background: teamSize > 1 ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: teamSize > 1 ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: teamSize <= 1 ? 0.4 : 1
                }}
              >
                -
              </button>

              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', minWidth: '22px', textAlign: 'center' }}>
                {teamSize}
              </span>

              <button
                type="button"
                onClick={() => setTeamSize(Math.min(10, teamSize + 1))}
                disabled={teamSize >= 10}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '5px',
                  background: teamSize < 10 ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  color: teamSize < 10 ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: teamSize >= 10 ? 0.4 : 1
                }}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Skill Selector Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {availableSkills.map(sk => {
            const isSelected = selectedSkills.includes(sk.name);
            return (
              <button
                key={sk.id || sk.name}
                onClick={() => toggleSkill(sk.name)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  background: isSelected ? 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#ffffff' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: isSelected ? '0 4px 12px rgba(6, 182, 212, 0.25)' : 'none'
                }}
              >
                {isSelected && <CheckCircle2 size={13} />} {sk.name}
              </button>
            );
          })}
        </div>

        {/* Calculate Button */}
        <button
          onClick={() => handleAssemble(teamSize)}
          disabled={loading || selectedSkills.length === 0}
          style={{
            padding: '10px 22px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.88rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 16px rgba(6, 182, 212, 0.3)',
            opacity: loading || selectedSkills.length === 0 ? 0.5 : 1,
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <Sparkles size={16} /> {loading ? 'Calculating...' : 'Calculate Optimal Teams'}
        </button>
      </div>

      {/* Clean Spinner Only */}
      {loading && (
        <div style={{ padding: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '3px solid rgba(6, 182, 212, 0.15)',
            borderTopColor: 'var(--accent-cyan)',
            animation: 'spin 0.8s linear infinite'
          }}></div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.3)', color: 'var(--accent-rose)', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {/* Results Section */}
      {!loading && result && (
        <div className="animate-fade-in">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={22} color="var(--accent-cyan)" /> Recommended Team Combinations ({result.total_matches || 0} Teams Assembled)
            </h3>
          </div>

          {!result.recommended_partnerships || result.recommended_partnerships.length === 0 ? (
            <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Users size={34} color="var(--accent-cyan)" style={{ marginBottom: '12px', opacity: 0.6 }} />
              <h4 style={{ fontSize: '1.05rem', color: '#ffffff', fontWeight: 700 }}>No Exact {teamSize}-Member Teams Found</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '440px', margin: '6px auto 0' }}>
                No past project collaborations with exactly {teamSize} members were found for these selected skills. Try selecting <strong>Team Size = 2 or 3</strong>, or use <strong>+ Add New Employee</strong> to register more team members!
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '20px' }}>
              {result.recommended_partnerships.map((path, idx) => (
                <div key={idx} className="glow-card" style={{ padding: '22px' }}>
                  {/* Team Option Header */}
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={15} /> RECOMMENDED TEAM OPTION #{idx + 1}
                  </div>

                  {/* Teammate Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                    {path.members && path.members.map((m, mIdx) => (
                      <div
                        key={m.id || mIdx}
                        style={{
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: '12px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          {/* Member Header */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
                              color: '#ffffff',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1rem',
                              flexShrink: 0,
                              boxShadow: '0 4px 10px rgba(6, 182, 212, 0.25)'
                            }}>
                              {m.name ? m.name.charAt(0) : 'E'}
                            </div>
                            <div>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{m.name}</h4>
                              <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{m.title}</span>
                            </div>
                          </div>

                          {/* Dept & Email */}
                          <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                            <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>📁 {m.department || 'Engineering'}</div>
                            <div>✉️ {m.email}</div>
                          </div>
                        </div>

                        {/* Skill Chips */}
                        <div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {m.skills && m.skills.map((sk, i) => (
                              <span key={i} style={{
                                fontSize: '0.7rem',
                                padding: '2px 8px',
                                borderRadius: '10px',
                                background: 'rgba(16, 185, 129, 0.15)',
                                color: 'var(--accent-green)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                fontWeight: 600
                              }}>
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
