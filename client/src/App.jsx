import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [role, setRole] = useState('Project Manager');

  useEffect(() => {
    axios.get('http://localhost:5000/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => {
        setProjects([
          { id: 1, name: 'Downtown Commercial Tower', status: 'In Progress', progress: 65 },
          { id: 2, name: 'Suburban Residential Complex', status: 'Planning', progress: 15 }
        ]);
      });
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', background: '#f4f6f8', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>🏗️ ConstructionOS Dashboard</h1>
        <div>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Active Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
            <option>Project Manager</option>
            <option>Site Engineer</option>
            <option>Contractor / Supervisor</option>
            <option>Worker</option>
          </select>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Active Projects</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{projects.length}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>Current Portal</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#16a34a' }}>{role}</p>
        </div>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <h3>AI Delay Alerts</h3>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#dc2626' }}>0 Active Flags</p>
        </div>
      </div>

      <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Project Overviews</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          {projects.map(p => (
            <li key={p.id} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{p.name}</strong>
                <span style={{ marginLeft: '15px', fontSize: '0.9rem', color: '#6b7280' }}>Status: {p.status}</span>
              </div>
              <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '12px', fontWeight: 'bold' }}>
                {p.progress}% Complete
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;