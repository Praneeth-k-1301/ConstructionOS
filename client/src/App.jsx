import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [role, setRole] = useState('Project Manager');
  
  // New Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('Site Engineer');
  const [priority, setPriority] = useState('Medium');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectsRes = await axios.get('http://localhost:5000/api/projects');
      const tasksRes = await axios.get('http://localhost:5000/api/tasks');
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (err) {
      console.log('Using fallback local state');
      setProjects([
        { id: 1, name: 'Downtown Commercial Tower', status: 'In Progress', progress: 65 },
        { id: 2, name: 'Suburban Residential Complex', status: 'Planning', progress: 15 }
      ]);
      setTasks([
        { id: 101, projectId: 1, title: 'Foundation Concrete Pouring', assignedTo: 'Site Engineer', status: 'Completed', priority: 'High' },
        { id: 102, projectId: 1, title: 'Structural Steel Framing', assignedTo: 'Contractor', status: 'In Progress', priority: 'High' }
      ]);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle) return;

    try {
      const res = await axios.post('http://localhost:5000/api/tasks', {
        projectId: 1,
        title: taskTitle,
        assignedTo,
        priority
      });
      setTasks([...tasks, res.data]);
    } catch (err) {
      const newTask = {
        id: Date.now(),
        projectId: 1,
        title: taskTitle,
        assignedTo,
        status: 'Pending',
        priority
      };
      setTasks([...tasks, newTask]);
    }

    setTaskTitle('');
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'In Progress' : currentStatus === 'In Progress' ? 'Completed' : 'Pending';
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}`, { status: nextStatus });
    } catch (err) {
      console.log('Backend offline, updating UI locally');
    }
    setTasks(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t));
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', background: '#f4f6f8', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>🏗️ ConstructionOS - Phase 1: Planning & Tasks</h1>
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

      {/* Task Creation Form (Phase 1) */}
      <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h2>Assign New Task</h2>
        <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Task Description (e.g., Install Rebar)" 
            value={taskTitle} 
            onChange={(e) => setTaskTitle(e.target.value)}
            style={{ flex: 1, minWidth: '250px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
            <option>Site Engineer</option>
            <option>Contractor</option>
            <option>Worker</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            + Create Task
          </button>
        </form>
      </section>

      {/* Tasks Overview List */}
      <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Task List ({tasks.length})</h2>
        <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
          {tasks.map(t => (
            <li key={t.id} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{t.title}</strong>
                <span style={{ marginLeft: '15px', fontSize: '0.85rem', color: '#4b5563', background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>
                  Assigned to: {t.assignedTo}
                </span>
                <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: t.priority === 'High' ? '#dc2626' : '#d97706' }}>
                  [{t.priority} Priority]
                </span>
              </div>
              <button 
                onClick={() => toggleTaskStatus(t.id, t.status)}
                style={{ 
                  background: t.status === 'Completed' ? '#22c55e' : t.status === 'In Progress' ? '#3b82f6' : '#eab308', 
                  color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' 
                }}
              >
                Status: {t.status}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default App;