import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { createSkill } from '../services/api';

const CATEGORIES = ['Backend', 'Frontend', 'Database', 'DevOps', 'AI/ML', 'Engineering'];

export interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddSkillModal({ isOpen, onClose, onSuccess }: AddSkillModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Backend');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setError('Please enter a Skill Name');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await createSkill({ name, category, description: `${category} skill` });
      setName('');
      setCategory('Backend');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create skill in CognoDB');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 8, 17, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '440px',
        margin: '0 auto',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        border: '1px solid var(--accent-purple)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', padding: '8px', borderRadius: '10px', color: '#fff' }}>
              <Plus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Add New Skill Node</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Creates a `(:Skill)` node in CognoDB</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', borderRadius: '8px', padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', fontSize: '0.82rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>SKILL NAME</label>
            <input
              type="text"
              placeholder="e.g. GraphQL, Rust, PyTorch"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.9)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>CATEGORY</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(15, 23, 42, 0.95)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem', outline: 'none' }}
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', color: '#fff', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 2, padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', color: '#fff', fontWeight: 700 }}
            >
              {loading ? 'Creating Skill...' : 'Create Skill Node'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
