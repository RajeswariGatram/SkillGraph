import React, { useEffect, useState } from 'react';
import { ShieldAlert, UserCheck, Building2, AlertTriangle } from 'lucide-react';
import { fetchKnowledgeSilos } from '../services/api';

export default function KnowledgeSilos() {
  const [silos, setSilos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchKnowledgeSilos();
        setSilos(data.silos || []);
      } catch (err) {
        setError(err.message || 'Failed to load knowledge silos');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>
          <AlertTriangle size={16} /> GRAPH RISK ANALYTICS
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>Departmental Knowledge Silos & Bottlenecks</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
          Graph aggregation query identifying critical skills where only <strong style={{ color: 'var(--accent-amber)' }}>one single employee</strong> in a department holds expertise (Single Point of Failure).
        </p>
      </div>

      {loading && <div style={{ color: 'var(--text-muted)' }}>Analyzing graph topology for knowledge bottlenecks...</div>}

      {error && (
        <div style={{ padding: '16px', borderRadius: '10px', background: 'rgba(244,63,94,0.15)', color: 'var(--accent-rose)' }}>
          {error}
        </div>
      )}

      {!loading && !error && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {silos.map((item, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '20px', borderTop: '4px solid var(--accent-amber)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', background: 'rgba(245,158,11,0.15)', padding: '3px 10px', borderRadius: '12px' }}>
                  SINGLE EXPERT RISK
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building2 size={14} /> {item.department}
                </span>
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                {item.critical_skill}
              </h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                Category: <span style={{ color: 'var(--accent-cyan)' }}>{item.category}</span>
              </p>

              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: 'var(--accent-amber)', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={20} color="#000" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#ffffff' }}>{item.expert_name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.expert_title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', marginTop: '2px' }}>{item.expert_email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
