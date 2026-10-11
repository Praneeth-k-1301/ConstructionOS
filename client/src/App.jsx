import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'inventory', 'labour'
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [role, setRole] = useState('Project Manager');
  
  // Phase 1 Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('Site Engineer');
  const [priority, setPriority] = useState('Medium');

  // Phase 2 Inventory Form
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('');
  const [itemUnit, setItemUnit] = useState('Bags');

  // Phase 3 Labour Form
  const [workerName, setWorkerName] = useState('');
  const [workerRole, setWorkerRole] = useState('Mason');
  const [dailyWage, setDailyWage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pRes, tRes, iRes, lRes] = await Promise.all([
        axios.get('http://localhost:5000/api/projects'),
        axios.get('http://localhost:5000/api/tasks'),
        axios.get('http://localhost:5000/api/inventory'),
        axios.get('http://localhost:5000/api/labour')
      ]);
      setProjects(pRes.data);
      setTasks(tRes.data);
      setInventory(iRes.data);
      setWorkers(lRes.data);
    } catch (err) {
      setTasks([{ id: 101, projectId: 1, title: 'Foundation Concrete Pouring', assignedTo: 'Site Engineer', status: 'Completed', priority: 'High' }]);
      setInventory([{ id: 1, itemName: 'Portland Cement (Bags)', quantity: 450, minThreshold: 100, unit: 'Bags' }]);
      setWorkers([
        { id: 1, name: 'Ramesh Kumar', role: 'Mason', dailyWage: 800, status: 'Present' },
        { id: 2, name: 'Suresh Verma', role: 'Steel Fixer', dailyWage: 850, status: 'Present' }
      ]);
    }
  };

  // Task Handlers
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle) return;
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', { projectId: 1, title: taskTitle, assignedTo, priority });
      setTasks([...tasks, res.data]);
    } catch (err) { setTasks([...tasks, { id: Date.now(), projectId: 1, title: taskTitle, assignedTo, status: 'Pending', priority }]); }
    setTaskTitle('');
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'In Progress' : currentStatus === 'In Progress' ? 'Completed' : 'Pending';
    try { await axios.patch(`http://localhost:5000/api/tasks/${id}`, { status: nextStatus }); } catch (err) {}
    setTasks(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t));
  };

  // Inventory Handlers
  const handleAddInventory = async (e) => {
    e.preventDefault();
    if (!itemName || !itemQty) return;
    try {
      const res = await axios.post('http://localhost:5000/api/inventory', { itemName, quantity: itemQty, unit: itemUnit, minThreshold: 50 });
      setInventory([...inventory, res.data]);
    } catch (err) { setInventory([...inventory, { id: Date.now(), itemName, quantity: Number(itemQty), unit: itemUnit, minThreshold: 50 }]); }
    setItemName(''); setItemQty('');
  };

  const updateQuantity = async (id, currentQty, change) => {
    const newQty = Math.max(0, currentQty + change);
    try { await axios.patch(`http://localhost:5000/api/inventory/${id}`, { quantity: newQty }); } catch (err) {}
    setInventory(inventory.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  // Labour Handlers
  const handleAddWorker = async (e) => {
    e.preventDefault();
    if (!workerName || !dailyWage) return;
    try {
      const res = await axios.post('http://localhost:5000/api/labour', { name: workerName, role: workerRole, dailyWage });
      setWorkers([...workers, res.data]);
    } catch (err) { setWorkers([...workers, { id: Date.now(), name: workerName, role: workerRole, dailyWage: Number(dailyWage), status: 'Present' }]); }
    setWorkerName(''); setDailyWage('');
  };

  const toggleAttendance = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    try { await axios.patch(`http://localhost:5000/api/labour/${id}`, { status: nextStatus }); } catch (err) {}
    setWorkers(workers.map(w => w.id === id ? { ...w, status: nextStatus } : w));
  };

  // Wage Total Calculation
  const presentCount = workers.filter(w => w.status === 'Present').length;
  const totalWagePayout = workers.reduce((sum, w) => w.status === 'Present' ? sum + w.dailyWage : sum, 0);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif', background: '#f4f6f8', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => setActiveTab('tasks')} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: activeTab === 'tasks' ? '#2563eb' : '#e5e7eb', color: activeTab === 'tasks' ? 'white' : '#374151', cursor: 'pointer', fontWeight: 'bold' }}>📋 Phase 1: Tasks</button>
        <button onClick={() => setActiveTab('inventory')} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: activeTab === 'inventory' ? '#2563eb' : '#e5e7eb', color: activeTab === 'inventory' ? 'white' : '#374151', cursor: 'pointer', fontWeight: 'bold' }}>📦 Phase 2: Inventory</button>
        <button onClick={() => setActiveTab('labour')} style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: activeTab === 'labour' ? '#2563eb' : '#e5e7eb', color: activeTab === 'labour' ? 'white' : '#374151', cursor: 'pointer', fontWeight: 'bold' }}>👷 Phase 3: Labour & Attendance</button>
      </div>

      {/* TAB 1: TASKS */}
      {activeTab === 'tasks' && (
        <>
          <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2>Assign New Task</h2>
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Task Description" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} style={{ flex: 1, minWidth: '250px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
                <option>Site Engineer</option><option>Contractor</option><option>Worker</option>
              </select>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
                <option>Low</option><option>Medium</option><option>High</option>
              </select>
              <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Create Task</button>
            </form>
          </section>
          <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Task List ({tasks.length})</h2>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
              {tasks.map(t => (
                <li key={t.id} style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div><strong>{t.title}</strong><span style={{ marginLeft: '15px', fontSize: '0.85rem', color: '#4b5563', background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>Assigned: {t.assignedTo}</span></div>
                  <button onClick={() => toggleTaskStatus(t.id, t.status)} style={{ background: t.status === 'Completed' ? '#22c55e' : t.status === 'In Progress' ? '#3b82f6' : '#eab308', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Status: {t.status}</button>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      {/* TAB 2: INVENTORY */}
      {activeTab === 'inventory' && (
        <>
          <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2>Add Material Stock</h2>
            <form onSubmit={handleAddInventory} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Material Name" value={itemName} onChange={(e) => setItemName(e.target.value)} style={{ flex: 2, minWidth: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <input type="number" placeholder="Quantity" value={itemQty} onChange={(e) => setItemQty(e.target.value)} style={{ flex: 1, minWidth: '100px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <select value={itemUnit} onChange={(e) => setItemUnit(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
                <option>Bags</option><option>Tons</option><option>Units</option><option>Trucks</option>
              </select>
              <button type="submit" style={{ padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Add Stock</button>
            </form>
          </section>
          <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Material Stock Tracker</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead><tr style={{ background: '#f3f4f6', textAlign: 'left' }}><th style={{ padding: '12px' }}>Material</th><th style={{ padding: '12px' }}>Quantity</th><th style={{ padding: '12px' }}>Status</th><th style={{ padding: '12px' }}>Actions</th></tr></thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.itemName}</td>
                    <td style={{ padding: '12px' }}>{item.quantity} {item.unit}</td>
                    <td style={{ padding: '12px' }}>{item.quantity < item.minThreshold ? <span style={{ color: '#dc2626', background: '#fee2e2', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>⚠️ LOW</span> : <span style={{ color: '#16a34a', background: '#dcfce7', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>✅ Optimal</span>}</td>
                    <td style={{ padding: '12px' }}><button onClick={() => updateQuantity(item.id, item.quantity, 10)} style={{ marginRight: '8px', padding: '4px 10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px' }}>+ Add 10</button><button onClick={() => updateQuantity(item.id, item.quantity, -10)} style={{ padding: '4px 10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px' }}>- Use 10</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      {/* TAB 3: LABOUR & ATTENDANCE */}
      {activeTab === 'labour' && (
        <>
          {/* Daily Wage & Attendance Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4>Total Crew Registered</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>{workers.length} Workers</p>
            </div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4>Present Today</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#16a34a' }}>{presentCount} Active</p>
            </div>
            <div style={{ background: 'white', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <h4>Est. Today's Wage Bill</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>₹{totalWagePayout}</p>
            </div>
          </div>

          <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2>Register New Worker</h2>
            <form onSubmit={handleAddWorker} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Worker Full Name" value={workerName} onChange={(e) => setWorkerName(e.target.value)} style={{ flex: 2, minWidth: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <select value={workerRole} onChange={(e) => setWorkerRole(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
                <option>Mason</option><option>Steel Fixer</option><option>Carpenter</option><option>General Helper</option><option>Electrician</option>
              </select>
              <input type="number" placeholder="Daily Wage (₹)" value={dailyWage} onChange={(e) => setDailyWage(e.target.value)} style={{ flex: 1, minWidth: '120px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <button type="submit" style={{ padding: '10px 20px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>+ Register Worker</button>
            </form>
          </section>

          <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2>Daily Attendance & Wage Roster</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Worker Name</th>
                  <th style={{ padding: '12px' }}>Skill Category</th>
                  <th style={{ padding: '12px' }}>Daily Rate</th>
                  <th style={{ padding: '12px' }}>Attendance Status</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {workers.map(w => (
                  <tr key={w.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{w.name}</td>
                    <td style={{ padding: '12px' }}>{w.role}</td>
                    <td style={{ padding: '12px' }}>₹{w.dailyWage}/day</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ color: w.status === 'Present' ? '#16a34a' : '#dc2626', background: w.status === 'Present' ? '#dcfce7' : '#fee2e2', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                        {w.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button 
                        onClick={() => toggleAttendance(w.id, w.status)}
                        style={{ padding: '6px 12px', background: w.status === 'Present' ? '#e11d48' : '#16a34a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Mark {w.status === 'Present' ? 'Absent' : 'Present'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}
    </div>
  );
}

export default App;