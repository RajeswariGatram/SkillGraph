import React from 'react';
import { Network, UserPlus, Users } from 'lucide-react';

export interface HeaderProps {
  dbStatus?: { connected: boolean };
  onOpenAddEmployee: () => void;
  onOpenDirectory: () => void;
}

export default function Header({ dbStatus, onOpenAddEmployee, onOpenDirectory }: HeaderProps) {
  const isHealthy = dbStatus?.connected;

  return (
    <header className="glass-panel" style={{ padding: '16px 28px', margin: '20px 24px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      {/* Brand Title & Logo Mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Network size={26} color="var(--accent-cyan)" style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.4))' }} />
        <h1 className="gradient-text" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em' }}>SkillGraph</h1>
      </div>

      {/* Action Controls & DB Status — Unified Glass Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Directory Button */}
        <button
          onClick={onOpenDirectory}
          style={{
            height: '36px',
            padding: '0 16px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 600,
            background: 'rgba(139, 92, 246, 0.12)',
            color: 'var(--accent-purple)',
            border: '1px solid rgba(139, 92, 246, 0.28)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <Users size={16} /> Directory
        </button>

        {/* Add Employee Button */}
        <button
          onClick={onOpenAddEmployee}
          style={{
            height: '36px',
            padding: '0 16px',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 600,
            background: 'rgba(6, 182, 212, 0.12)',
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(6, 182, 212, 0.28)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <UserPlus size={16} /> Add New Employee
        </button>

        {/* DB Connection Badge */}
        <div style={{
          height: '36px',
          padding: '0 16px',
          borderRadius: '10px',
          fontSize: '0.82rem',
          fontWeight: 600,
          background: isHealthy ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
          border: `1px solid ${isHealthy ? 'rgba(16, 185, 129, 0.28)' : 'rgba(244, 63, 94, 0.28)'}`,
          color: isHealthy ? 'var(--accent-green)' : 'var(--accent-rose)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: isHealthy ? 'var(--accent-green)' : 'var(--accent-rose)',
            boxShadow: `0 0 8px ${isHealthy ? 'var(--accent-green)' : 'var(--accent-rose)'}`,
            display: 'inline-block'
          }}></span>
          <span>{isHealthy ? 'CognoDB Connected' : 'DB Disconnected'}</span>
        </div>
      </div>
    </header>
  );
}
