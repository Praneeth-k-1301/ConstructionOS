const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ConstructionOS API is running' });
});

// Projects Data
let projects = [
  { id: 1, name: 'Downtown Commercial Tower', status: 'In Progress', progress: 65 },
  { id: 2, name: 'Suburban Residential Complex', status: 'Planning', progress: 15 }
];

// Phase 1: Tasks
let tasks = [
  { id: 101, projectId: 1, title: 'Foundation Concrete Pouring', assignedTo: 'Site Engineer', status: 'Completed', priority: 'High' },
  { id: 102, projectId: 1, title: 'Structural Steel Framing', assignedTo: 'Contractor', status: 'In Progress', priority: 'High' }
];

// Phase 2: Inventory
let inventory = [
  { id: 1, itemName: 'Portland Cement (Bags)', quantity: 450, minThreshold: 100, unit: 'Bags' },
  { id: 2, itemName: 'TMT Steel Rods (12mm)', quantity: 12, minThreshold: 20, unit: 'Tons' }
];

// Phase 3: Labour & Attendance Data
let workers = [
  { id: 1, name: 'Ramesh Kumar', role: 'Mason', dailyWage: 800, status: 'Present' },
  { id: 2, name: 'Suresh Verma', role: 'Steel Fixer', dailyWage: 850, status: 'Present' },
  { id: 3, name: 'Ali Khan', role: 'Helper', dailyWage: 600, status: 'Absent' }
];

app.get('/api/projects', (req, res) => res.json(projects));

// Tasks Endpoints
app.get('/api/tasks', (req, res) => res.json(tasks));
app.post('/api/tasks', (req, res) => {
  const newTask = { id: Date.now(), projectId: 1, ...req.body, status: 'Pending' };
  tasks.push(newTask);
  res.status(201).json(newTask);
});
app.patch('/api/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === Number(req.params.id));
  if (task) { task.status = req.body.status; res.json(task); }
  else res.status(404).json({ message: 'Task not found' });
});

// Inventory Endpoints
app.get('/api/inventory', (req, res) => res.json(inventory));
app.post('/api/inventory', (req, res) => {
  const newItem = { id: Date.now(), itemName: req.body.itemName, quantity: Number(req.body.quantity), minThreshold: 50, unit: req.body.unit || 'Units' };
  inventory.push(newItem);
  res.status(201).json(newItem);
});
app.patch('/api/inventory/:id', (req, res) => {
  const item = inventory.find(i => i.id === Number(req.params.id));
  if (item) { item.quantity = Number(req.body.quantity); res.json(item); }
  else res.status(404).json({ message: 'Item not found' });
});

// Phase 3: Labour Endpoints
app.get('/api/labour', (req, res) => res.json(workers));

app.post('/api/labour', (req, res) => {
  const { name, role, dailyWage } = req.body;
  const newWorker = {
    id: Date.now(),
    name,
    role: role || 'General Worker',
    dailyWage: Number(dailyWage) || 600,
    status: 'Present'
  };
  workers.push(newWorker);
  res.status(201).json(newWorker);
});

app.patch('/api/labour/:id', (req, res) => {
  const worker = workers.find(w => w.id === Number(req.params.id));
  if (worker) {
    if (req.body.status !== undefined) worker.status = req.body.status;
    res.json(worker);
  } else res.status(404).json({ message: 'Worker not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));