import React, { useEffect, useRef, useState } from 'react';
import { Network } from 'vis-network';
import 'vis-network/styles/vis-network.css';
import { Info, RefreshCw } from 'lucide-react';

const NODE_COLORS = {
  Employee: { background: '#3b82f6', border: '#1d4ed8', highlight: { background: '#60a5fa', border: '#2563eb' } },
  Skill: { background: '#10b981', border: '#047857', highlight: { background: '#34d399', border: '#059669' } },
  Project: { background: '#f59e0b', border: '#b45309', highlight: { background: '#fbbf24', border: '#d97706' } },
  Department: { background: '#8b5cf6', border: '#6d28d9', highlight: { background: '#a78bfa', border: '#7c3aed' } },
  Entity: { background: '#6b7280', border: '#374151', highlight: { background: '#9ca3af', border: '#4b5563' } }
};

export default function GraphCanvas({ graphData, onRefresh }) {
  const containerRef = useRef(null);
  const networkRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (!containerRef.current || !graphData?.nodes) return;

    // Map backend nodes to vis-network dataset
    const formattedNodes = graphData.nodes.map(node => {
      const colorScheme = NODE_COLORS[node.label] || NODE_COLORS.Entity;
      return {
        id: node.id,
        label: node.name,
        shape: node.label === 'Employee' ? 'dot' : node.label === 'Skill' ? 'diamond' : 'box',
        size: node.label === 'Employee' ? 22 : 18,
        color: colorScheme,
        font: { color: '#ffffff', face: 'Plus Jakarta Sans', size: 14, multi: true },
        nodeData: node
      };
    });

    // Map backend edges
    const formattedEdges = graphData.edges.map(edge => ({
      id: edge.id,
      from: edge.source,
      to: edge.target,
      label: edge.label || edge.type,
      font: { color: '#9ca3af', size: 10, align: 'top' },
      color: { color: '#233054', highlight: '#3b82f6', hover: '#06b6d4' },
      arrows: { to: { enabled: true, scaleFactor: 0.6 } },
      smooth: { type: 'continuous' }
    }));

    const data = { nodes: formattedNodes, edges: formattedEdges };
    const options = {
      nodes: {
        borderWidth: 2,
        shadow: true
      },
      edges: {
        width: 1.5,
        selectionWidth: 3
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08
        },
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true
      }
    };

    networkRef.current = new Network(containerRef.current, data, options);

    // Event listener for node clicks
    networkRef.current.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const clickedNode = formattedNodes.find(n => n.id === nodeId);
        setSelectedNode(clickedNode?.nodeData || null);
      } else {
        setSelectedNode(null);
      }
    });

    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
        networkRef.current = null;
      }
    };
  }, [graphData]);

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 120px)', display: 'flex' }}>
      {/* Graph Legend */}
      <div className="glass-panel" style={{ position: 'absolute', top: '16px', left: '20px', zIndex: 10, padding: '12px 16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: NODE_COLORS.Employee.background }}></span>
          <span>Employee</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: NODE_COLORS.Skill.background, transform: 'rotate(45deg)' }}></span>
          <span>Skill</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: NODE_COLORS.Project.background }}></span>
          <span>Project</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: NODE_COLORS.Department.background }}></span>
          <span>Department</span>
        </div>
        <button onClick={onRefresh} style={{ background: 'rgba(255,255,255,0.08)', padding: '6px 10px', borderRadius: '6px', color: '#fff', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <RefreshCw size={12} /> Reload Graph
        </button>
      </div>

      {/* Main Vis.js Canvas */}
      <div ref={containerRef} style={{ flex: 1, width: '100%', height: '100%', background: '#0b0f19' }} />

      {/* Node Details Inspector Drawer */}
      {selectedNode && (
        <div className="glass-panel" style={{ width: '320px', margin: '16px', padding: '20px', zIndex: 10, alignSelf: 'flex-start', borderLeft: '3px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(6, 182, 212, 0.2)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
              {selectedNode.label.toUpperCase()}
            </span>
            <button onClick={() => setSelectedNode(null)} style={{ background: 'none', color: 'var(--text-muted)', fontSize: '1rem' }}>✕</button>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px', color: '#ffffff' }}>{selectedNode.name}</h3>
          
          <div style={{ marginTop: '14px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {Object.entries(selectedNode.properties || {}).map(([key, val]) => (
              <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{key}:</span>
                <span style={{ fontWeight: 600, color: '#f3f4f6' }}>{Array.isArray(val) ? val.join(', ') : String(val)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
