const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ConstructionOS API is running' });
});

// Mock Projects Data
let projects = [
  { id: 1, name: 'Downtown Commercial Tower', status: 'In Progress', progress: 65 },
  { id: 2, name: 'Suburban Residential Complex', status: 'Planning', progress: 15 }
];

// Mock Tasks Data (Phase 1 Core)
let tasks = [
  { id: 101, projectId: 1, title: 'Foundation Concrete Pouring', assignedTo: 'Site Engineer', status: 'Completed', priority: 'High' },
  { id: 102, projectId: 1, title: 'Structural Steel Framing', assignedTo: 'Contractor', status: 'In Progress', priority: 'High' },
  { id: 103, projectId: 2, title: 'Soil Testing & Excavation', assignedTo: 'Site Engineer', status: 'Pending', priority: 'Medium' }
];

// Get Projects
app.get('/api/projects', (req, res) => {
  res.json(projects);
});

// Get Tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Add New Task (Phase 1 Feature)
app.post('/api/tasks', (req, res) => {
  const { projectId, title, assignedTo, priority } = req.body;
  const newTask = {
    id: Date.now(),
    projectId: Number(projectId) || 1,
    title,
    assignedTo,
    status: 'Pending',
    priority: priority || 'Medium'
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update Task Status
app.patch('/api/tasks/:id', (req, res) => {
  const taskId = Number(req.params.id);
  const { status } = req.body;
  
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    task.status = status;
    res.json(task);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));