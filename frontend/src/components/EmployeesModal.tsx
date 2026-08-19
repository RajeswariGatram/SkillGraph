import React, { useState } from 'react';
import { Users, Search, Mail, Building2, X } from 'lucide-react';
import { Employee } from '../types';

export interface ExtendedEmployee extends Employee {
  title?: string;
  email?: string;
}

export interface EmployeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees?: ExtendedEmployee[];
}

export default function EmployeesModal({ isOpen, onClose, employees = [] }: EmployeesModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredEmployees = employees.filter(emp => {
    const term = searchTerm.toLowerCase();
    return (
      emp.name?.toLowerCase().includes(term) ||
      emp.title?.toLowerCase().includes(term) ||
      emp.role?.toLowerCase().includes(term) ||
      emp.department?.toLowerCase().includes(term) ||
      emp.skills?.some(s => s.toLowerCase().includes(term))
    );
  });

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
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '900px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        {/* Sticky Header & Search Bar */}
        <div style={{
          padding: '24px 28px 16px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(10px)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'linear-gradient(135deg, var(--accent-purple), var(--accent-blue))', padding: '10px', borderRadius: '10px', color: '#fff' }}>
                <Users size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>Employee Directory</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Showing all {filteredEmployees.length} registered employees</p>
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <X size={20} />
            </button>
          </div>

          {/* Search Input Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search employees by name, title, department, or skill (e.g. FastAPI, Cypher)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 14px 12px 42px',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.9rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Employees Cards Scrollable Container */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px', padding: '20px 28px 28px' }}>
          {filteredEmployees.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No employees matched your search term.
            </div>
          ) : (
            filteredEmployees.map(emp => (
              <div
                key={emp.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.04)',
                      color: 'var(--accent-cyan)',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.88rem',
                      flexShrink: 0,
                      pointerEvents: 'none'
                    }}>
                      {emp.name ? emp.name.charAt(0) : 'E'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff' }}>{emp.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>{emp.title || emp.role}</span>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Building2 size={13} color="var(--accent-purple)" />
                      <span>{emp.department}</span>
                    </div>
                    {emp.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Mail size={13} color="var(--text-muted)" />
                        <span>{emp.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skill Chips */}
                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {emp.skills && emp.skills.length > 0 ? (
                      emp.skills.map((sk, idx) => (
                        <span key={idx} style={{
                          fontSize: '0.7rem',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: 'var(--accent-green)',
                          border: '1px solid rgba(16, 185, 129, 0.3)',
                          fontWeight: 600
                        }}>
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No skills linked</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
