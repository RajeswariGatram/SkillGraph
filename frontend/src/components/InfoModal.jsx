import React from 'react';
import { Info, X, Sparkles, Database, Layers } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
      padding: '24px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '28px',
        position: 'relative',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        border: '1px solid var(--accent-cyan)',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))', padding: '10px', borderRadius: '12px', color: '#fff' }}>
              <Info size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>About SkillGraph & CognoDB</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Enterprise Talent & Team Recommendation Engine</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '0.88rem', lineHeight: 1.6, color: '#e2e8f0' }}>
          
          {/* Section 1: What SkillGraph Serves */}
          <div style={{ background: 'rgba(6, 182, 212, 0.08)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(6, 182, 212, 0.2)' }}>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={18} /> What SkillGraph Serves
            </h4>
            <p style={{ color: 'var(--text-secondary)' }}>
              SkillGraph is an enterprise talent recommendation platform designed to assemble optimal project teams based on required technical skills and target team sizes. It models company talent as an interconnected graph of <strong>Employees</strong>, <strong>Skills</strong>, and <strong>Departments</strong> to discover balanced team combinations that fulfill project requirements.
            </p>
          </div>

          {/* Section 2: Why CognoDB (Graph DB) over SQL or NoSQL */}
          <div>
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="var(--accent-purple)" /> Why CognoDB (Graph DB) over SQL or NoSQL?
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent-cyan)' }}>1. Graph DB vs. Relational SQL:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  In SQL, discovering multi-skill coverage across many-to-many relationship tables requires expensive JOIN operations across multiple junction tables. As employee and skill datasets grow, SQL JOIN performance degrades significantly. In CognoDB (Graph Database), relationships are first-class entities stored as direct memory pointers (index-free adjacency), allowing instant, millisecond graph traversals regardless of dataset size.
                </p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <strong style={{ color: 'var(--accent-purple)' }}>2. Graph DB vs. Document NoSQL:</strong>
                <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Document databases (such as MongoDB) denormalize data into individual JSON documents. Querying cross-document relationships, matching overlapping skills across people, or forming dynamic team combinations requires heavy aggregation pipelines or slow client-side filtering loops. CognoDB naturally queries connected relationships across the entire graph natively and efficiently.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
