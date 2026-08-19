import React, { useState } from 'react';
import { Sparkles, Users, CheckCircle2, Plus, ChevronDown, ChevronUp, Building2, Mail } from 'lucide-react';
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
  onOpenAddSkill?: () => void;
}

export default function TeamAssembler({ availableSkills = [], onOpenAddSkill }: TeamAssemblerProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['FastAPI', 'React.js', 'Cypher & CognoDB']);
  const [teamSize, setTeamSize] = useState<number>(2);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TeamAssembleResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [expandedTeamOptionIndices, setExpandedTeamOptionIndices] = useState<number[]>([]);

  const toggleTeamOptionExpanded = (teamIdx: number) => {
    if (expandedTeamOptionIndices.includes(teamIdx)) {
      setExpandedTeamOptionIndices(expandedTeamOptionIndices.filter(i => i !== teamIdx));
    } else {
      setExpandedTeamOptionIndices([...expandedTeamOptionIndices, teamIdx]);
    }
  };

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              REQUIRED SKILLS
            </label>
            {onOpenAddSkill && (
              <button
                type="button"
                onClick={onOpenAddSkill}
                title="Add New Skill"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: 'var(--accent-purple)',
                  border: '1px solid rgba(139, 92, 246, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <Plus size={14} />
              </button>
            )}
          </div>

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

        {/* Skill Selector Chips Container */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            marginBottom: '16px',
            maxHeight: isExpanded ? '1000px' : '82px',
            overflow: 'hidden',
            transition: 'max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
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
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  boxShadow: isSelected ? '0 0 14px rgba(6, 182, 212, 0.3)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {isSelected && <CheckCircle2 size={13} color="var(--accent-cyan)" />} {sk.name}
              </button>
            );
          })}
        </div>

        {/* Bottom Action Bar: Calculate Button (Left) & Expand Button (Right Aligned) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
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

          {/* Icon-only expand button right-aligned with Calculate button */}
          {availableSkills.length > 8 && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse Skills" : "Expand Skills"}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: isExpanded ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: isExpanded ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid rgba(255, 255, 255, 0.1)',
                color: isExpanded ? 'var(--accent-cyan)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
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
              {result.recommended_partnerships.map((path, idx) => {
                const isTeamExpanded = expandedTeamOptionIndices.includes(idx);
                return (
                  <div key={idx} className="glow-card" style={{ padding: '22px' }}>
                    {/* Team Option Header with Expand/Collapse Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={15} /> #{idx + 1}
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleTeamOptionExpanded(idx)}
                        style={{
                          background: isTeamExpanded ? 'rgba(6, 182, 212, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                          border: isTeamExpanded ? '1px solid rgba(6, 182, 212, 0.35)' : '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '50%',
                          width: '26px',
                          height: '26px',
                          color: isTeamExpanded ? 'var(--accent-cyan)' : 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        title={isTeamExpanded ? "Collapse Team Details" : "Expand Team Details"}
                      >
                        {isTeamExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

                    {/* Teammate Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                      {path.members && path.members.map((m, mIdx) => {
                        const matchedSkills = m.skills?.filter(sk => selectedSkills.includes(sk)) || [];
                        const displaySkills = isTeamExpanded ? (m.skills || []) : (matchedSkills.length > 0 ? matchedSkills : (m.skills || []));

                        return (
                          <div
                            key={m.id || mIdx}
                            style={{
                              background: isTeamExpanded ? 'rgba(6, 182, 212, 0.06)' : 'rgba(15, 23, 42, 0.6)',
                              border: isTeamExpanded ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '12px',
                              padding: '16px',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div>
                              {/* Member Header */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <div style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  background: 'rgba(255, 255, 255, 0.04)',
                                  color: 'var(--accent-cyan)',
                                  fontWeight: 700,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '0.85rem',
                                  flexShrink: 0,
                                  pointerEvents: 'none'
                                }}>
                                  {m.name ? m.name.charAt(0) : 'E'}
                                </div>
                                <div>
                                  <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{m.name}</h4>
                                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{m.title}</span>
                                </div>
                              </div>

                              {/* Department & Email (Email revealed when Team is expanded) */}
                              <div style={{ fontSize: '0.76rem', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '12px' }}>
                                <div style={{ color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Building2 size={13} color="var(--accent-cyan)" /> {m.department || 'Engineering'}
                                </div>
                                {isTeamExpanded && m.email && (
                                  <div style={{ color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', marginTop: '2px' }}>
                                    <Mail size={13} color="var(--accent-cyan)" /> {m.email}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Skill Chips */}
                            <div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {displaySkills.map((sk, i) => {
                                  const isMatchedSkill = selectedSkills.includes(sk);
                                  return (
                                    <span
                                      key={i}
                                      style={{
                                        fontSize: '0.7rem',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        background: isMatchedSkill ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                        color: isMatchedSkill ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                        border: isMatchedSkill ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                                        fontWeight: isMatchedSkill ? 700 : 500
                                      }}
                                    >
                                      {isMatchedSkill && '✓ '}
                                      {sk}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
