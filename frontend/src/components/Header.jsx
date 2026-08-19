import React from 'react';
import { Network, Database, UserPlus, Users, Plus } from 'lucide-react';

export default function Header({ dbStatus, onOpenAddEmployee, onOpenAddSkill, onOpenDirectory }) {
  const isHealthy = dbStatus?.connected;

  return (
    <header className="glass-panel" style={{ padding: '16px 28px', margin: '20px 24px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      {/* Brand Title with Gradient */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
          width: '44px',
          height: '44px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 20px rgba(6, 182, 212, 0.35)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <Network size={24} color="#ffffff" />
        </div>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em' }}>SkillGraph</h1>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px', fontWeight: 500 }}>Enterprise Talent & Team Recommendation Graph Platform</p>
        </div>
      </div>

      {/* Action Controls & DB Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Directory Button */}
        <button
          onClick={onOpenDirectory}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'rgba(255, 255, 255, 0.04)',
            color: '#ffffff',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Users size={17} color="var(--accent-purple)" /> Directory
        </button>

        {/* Add Skill Button */}
        <button
          onClick={onOpenAddSkill}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 600,
            background: 'rgba(139, 92, 246, 0.15)',
            color: 'var(--accent-purple)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> Add Skill
        </button>

        {/* Primary CTA: Add Employee */}
        <button
          onClick={onOpenAddEmployee}
          style={{
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '0.88rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 18px rgba(6, 182, 212, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}
        >
          <UserPlus size={18} /> Add New Employee
        </button>

        {/* DB Connection Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 16px',
          borderRadius: '20px',
          background: isHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
          border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
          fontSize: '0.82rem',
          fontWeight: 700,
          color: isHealthy ? 'var(--accent-green)' : 'var(--accent-rose)',
          marginLeft: '4px'
        }}>
          <Database size={15} />
          <span>{isHealthy ? 'CognoDB Connected' : 'DB Disconnected'}</span>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isHealthy ? 'var(--accent-green)' : 'var(--accent-rose)',
            boxShadow: `0 0 10px ${isHealthy ? 'var(--accent-green)' : 'var(--accent-rose)'}`
          }}></span>
        </div>
      </div>
    </header>
  );
}
