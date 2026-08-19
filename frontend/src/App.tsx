import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import TeamAssembler from './components/TeamAssembler';
import AddEmployeeModal from './components/AddEmployeeModal';
import AddSkillModal from './components/AddSkillModal';
import EmployeesModal from './components/EmployeesModal';
import InfoModal from './components/InfoModal';
import { fetchHealth, fetchSkills, fetchEmployees } from './services/api';
import { Database, AlertTriangle, RefreshCw, Info } from 'lucide-react';
import { Skill, Employee } from './types';

export default function App() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false);
  const [isDirectoryOpen, setIsDirectoryOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; status?: string }>({ connected: false, status: 'loading' });
  const [skills, setSkills] = useState<Skill[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Health check
      const health: any = await fetchHealth().catch((err) => ({ connected: false, error: err.message }));
      setDbStatus(health);

      if (health.connected) {
        // 2. Load skills & employees
        const [skData, empData] = await Promise.all([
          fetchSkills(),
          fetchEmployees()
        ]);
        setSkills(skData);
        setEmployees(empData);
      } else {
        setError(health.error || 'CognoDB Database is unreachable. Please verify backend connection.');
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-dark)', position: 'relative' }}>
      <Header
        dbStatus={dbStatus}
        onOpenAddEmployee={() => setIsAddModalOpen(true)}
        onOpenDirectory={() => setIsDirectoryOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative' }}>
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
            <div className="pulse" style={{ background: 'var(--accent-blue)', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={24} color="#fff" />
            </div>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Connecting to CognoDB...</p>
          </div>
        )}

        {!loading && error && (
          <div style={{ maxWidth: '600px', margin: '60px auto', padding: '24px', borderRadius: '12px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#ffffff', textAlign: 'center' }}>
            <AlertTriangle size={36} color="var(--accent-rose)" style={{ marginBottom: '12px' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Database Connectivity Warning</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>{error}</p>
            <button onClick={loadInitialData} style={{ padding: '10px 20px', borderRadius: '8px', background: 'var(--accent-rose)', color: '#fff', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <RefreshCw size={16} /> Retry Connection
            </button>
          </div>
        )}

        {!loading && !error && (
          <TeamAssembler availableSkills={skills} onOpenAddSkill={() => setIsAddSkillOpen(true)} />
        )}
      </main>

      {/* Floating Info Button (i) */}
      <button
        onClick={() => setIsInfoOpen(true)}
        title="About SkillGraph & How It Works"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          background: 'rgba(139, 92, 246, 0.2)',
          color: 'var(--accent-purple)',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
          zIndex: 100,
          transition: 'all 0.2s ease'
        }}
      >
        <Info size={15} />
      </button>

      {/* Add Skill Modal */}
      <AddSkillModal
        isOpen={isAddSkillOpen}
        onClose={() => setIsAddSkillOpen(false)}
        onSuccess={loadInitialData}
      />

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        skills={skills}
        onSuccess={loadInitialData}
      />

      {/* Employees Directory Modal */}
      <EmployeesModal
        isOpen={isDirectoryOpen}
        onClose={() => setIsDirectoryOpen(false)}
        employees={employees}
      />

      {/* Info Dialog Modal */}
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </div>
  );
}
