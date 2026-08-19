import React, { useState } from 'react';
import { UserPlus, CheckCircle2, X } from 'lucide-react';
import { createEmployee } from '../services/api';

const DEPARTMENTS = [
  { id: 'dep_eng', name: 'Software Engineering' },
  { id: 'dep_ds', name: 'Data Science & AI' },
  { id: 'dep_devops', name: 'Cloud Platform & DevOps' },
  { id: 'dep_sec', name: 'Cybersecurity' }
];

export default function AddEmployeeModal({ isOpen, onClose, skills = [], onSuccess }) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [departmentId, setDepartmentId] = useState('dep_eng');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const toggleSkill = (skId) => {
    if (selectedSkills.includes(skId)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skId));
    } else {
      setSelectedSkills([...selectedSkills, skId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !title || !email) {
      setError('Please fill in Name, Title, and Email');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await createEmployee({
        name,
        title,
        email,
        department_id: departmentId,
        skill_ids: selectedSkills
      });
      // Reset form
      setName('');
      setTitle('');
      setEmail('');
      setSelectedSkills([]);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create employee in CognoDB');
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
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyInContent: 'center',
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '520px',
        margin: '0 auto',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--accent-cyan)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--accent-cyan)', padding: '8px', borderRadius: '8px', color: '#000' }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Add New Employee Node</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Creates `(:Employee)` node and graph edges in CognoDB</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1.2rem' }}>
            <X size={20} />
          </button>
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: '8px', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--accent-rose)', fontSize: '0.82rem', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Full Name</label>
            <input
              type="text"
              placeholder="e.g. Maya Lin"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Job Title</label>
              <input
                type="text"
                placeholder="e.g. Graph Specialist"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Email</label>
              <input
                type="email"
                placeholder="maya@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Department</label>
            <select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(19, 27, 46, 0.95)', border: '1px solid var(--border-color)', color: '#fff', fontSize: '0.9rem' }}
            >
              {DEPARTMENTS.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Attach Skills (`[:HAS_SKILL]` Edges)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '120px', overflowY: 'auto', padding: '8px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
              {skills.map(sk => {
                const isSelected = selectedSkills.includes(sk.id);
                return (
                  <button
                    key={sk.id}
                    type="button"
                    onClick={() => toggleSkill(sk.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '14px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: isSelected ? 'var(--accent-green)' : 'rgba(255,255,255,0.08)',
                      color: isSelected ? '#000' : 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isSelected && <CheckCircle2 size={12} />} {sk.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', color: '#fff', fontWeight: 600 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 2, padding: '10px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', color: '#fff', fontWeight: 700 }}
            >
              {loading ? 'Executing Cypher Write...' : 'Create Employee Node'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
