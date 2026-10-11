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

// Phase 1: Tasks Data
let tasks = [
  { id: 101, projectId: 1, title: 'Foundation Concrete Pouring', assignedTo: 'Site Engineer', status: 'Completed', priority: 'High' },
  { id: 102, projectId: 1, title: 'Structural Steel Framing', assignedTo: 'Contractor', status: 'In Progress', priority: 'High' }
];

// Phase 2: Inventory Data
let inventory = [
  { id: 1, itemName: 'Portland Cement (Bags)', quantity: 450, minThreshold: 100, unit: 'Bags' },
  { id: 2, itemName: 'TMT Steel Rods (12mm)', quantity: 12, minThreshold: 20, unit: 'Tons' },
  { id: 3, itemName: 'River Sand', quantity: 80, minThreshold: 50, unit: 'Tons' }
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

// Phase 2: Inventory Endpoints
app.get('/api/inventory', (req, res) => res.json(inventory));

app.post('/api/inventory', (req, res) => {
  const { itemName, quantity, minThreshold, unit } = req.body;
  const newItem = {
    id: Date.now(),
    itemName,
    quantity: Number(quantity),
    minThreshold: Number(minThreshold) || 50,
    unit: unit || 'Units'
  };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

app.patch('/api/inventory/:id', (req, res) => {
  const item = inventory.find(i => i.id === Number(req.params.id));
  if (item) {
    if (req.body.quantity !== undefined) item.quantity = Number(req.body.quantity);
    res.json(item);
  } else res.status(404).json({ message: 'Item not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));