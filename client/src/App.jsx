import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'inventory'
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [role, setRole] = useState('Project Manager');
  
  // Phase 1 Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('Site Engineer');
  const [priority, setPriority] = useState('Medium');

  // Phase 2 Inventory Form State
  const [itemName, setItemName] = useState('');
  const [itemQty, setItemQty] = useState('');
  const [itemUnit, setItemUnit] = useState('Bags');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pRes = await axios.get('http://localhost:5000/api/projects');
      const tRes = await axios.get('http://localhost:5000/api/tasks');
      const iRes = await axios.get('http://localhost:5000/api/inventory');
      setProjects(pRes.data);
      setTasks(tRes.data);
      setInventory(iRes.data);
    } catch (err) {
      setTasks([
        { id: 101, projectId: 1, title: 'Foundation Concrete Pouring', assignedTo: 'Site Engineer', status: 'Completed', priority: 'High' }
      ]);
      setInventory([
        { id: 1, itemName: 'Portland Cement (Bags)', quantity: 450, minThreshold: 100, unit: 'Bags' },
        { id: 2, itemName: 'TMT Steel Rods (12mm)', quantity: 12, minThreshold: 20, unit: 'Tons' }
      ]);
    }
  };

  // Task Actions
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!taskTitle) return;
    try {
      const res = await axios.post('http://localhost:5000/api/tasks', { projectId: 1, title: taskTitle, assignedTo, priority });
      setTasks([...tasks, res.data]);
    } catch (err) {
      setTasks([...tasks, { id: Date.now(), projectId: 1, title: taskTitle, assignedTo, status: 'Pending', priority }]);
    }
    setTaskTitle('');
  };

  const toggleTaskStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'Pending' ? 'In Progress' : currentStatus === 'In Progress' ? 'Completed' : 'Pending';
    try { await axios.patch(`http://localhost:5000/api/tasks/${id}`, { status: nextStatus }); } catch (err) {}
    setTasks(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t));
  };

  // Inventory Actions
  const handleAddInventory = async (e) => {
    e.preventDefault();
    if (!itemName || !itemQty) return;
    try {
      const res = await axios.post('http://localhost:5000/api/inventory', { itemName, quantity: itemQty, unit: itemUnit, minThreshold: 50 });
      setInventory([...inventory, res.data]);
    } catch (err) {
      setInventory([...inventory, { id: Date.now(), itemName, quantity: Number(itemQty), unit: itemUnit, minThreshold: 50 }]);
    }
    setItemName('');
    setItemQty('');
  };

  const updateQuantity = async (id, currentQty, change) => {
    const newQty = Math.max(0, currentQty + change);
    try { await axios.patch(`http://localhost:5000/api/inventory/${id}`, { quantity: newQty }); } catch (err) {}
    setInventory(inventory.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

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

      {/* Module Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <button 
          onClick={() => setActiveTab('tasks')} 
          style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: activeTab === 'tasks' ? '#2563eb' : '#e5e7eb', color: activeTab === 'tasks' ? 'white' : '#374151', cursor: 'pointer', fontWeight: 'bold' }}>
          📋 Phase 1: Tasks
        </button>
        <button 
          onClick={() => setActiveTab('inventory')} 
          style={{ padding: '10px 20px', borderRadius: '6px', border: 'none', background: activeTab === 'inventory' ? '#2563eb' : '#e5e7eb', color: activeTab === 'inventory' ? 'white' : '#374151', cursor: 'pointer', fontWeight: 'bold' }}>
          📦 Phase 2: Inventory & Materials
        </button>
      </div>

      {/* TAB 1: TASKS */}
      {activeTab === 'tasks' && (
        <>
          <section style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <h2>Assign New Task</h2>
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Task Description" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} style={{ flex: 1, minWidth: '250px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
              <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} style={{ padding: '10px', borderRadius: '4px' }}>
                <option>Site Engineer</option>
                <option>Contractor</option>
                <option>Worker</option>
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
                  <div>
                    <strong>{t.title}</strong>
                    <span style={{ marginLeft: '15px', fontSize: '0.85rem', color: '#4b5563', background: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>Assigned: {t.assignedTo}</span>
                  </div>
                  <button onClick={() => toggleTaskStatus(t.id, t.status)} style={{ background: t.status === 'Completed' ? '#22c55e' : t.status === 'In Progress' ? '#3b82f6' : '#eab308', color: 'white', border: 'none', padding: '6px 14px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Status: {t.status}
                  </button>
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
              <input type="text" placeholder="Material Name (e.g. Bricks)" value={itemName} onChange={(e) => setItemName(e.target.value)} style={{ flex: 2, minWidth: '200px', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} />
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
              <thead>
                <tr style={{ background: '#f3f4f6', textAlign: 'left' }}>
                  <th style={{ padding: '12px' }}>Material</th>
                  <th style={{ padding: '12px' }}>Stock Quantity</th>
                  <th style={{ padding: '12px' }}>Alert Status</th>
                  <th style={{ padding: '12px' }}>Stock Log Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.itemName}</td>
                    <td style={{ padding: '12px' }}>{item.quantity} {item.unit}</td>
                    <td style={{ padding: '12px' }}>
                      {item.quantity < item.minThreshold ? (
                        <span style={{ color: '#dc2626', background: '#fee2e2', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>⚠️ LOW STOCK</span>
                      ) : (
                        <span style={{ color: '#16a34a', background: '#dcfce7', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem' }}>✅ Optimal</span>
                      )}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => updateQuantity(item.id, item.quantity, 10)} style={{ marginRight: '8px', padding: '4px 10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add 10</button>
                      <button onClick={() => updateQuantity(item.id, item.quantity, -10)} style={{ padding: '4px 10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>- Use 10</button>
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