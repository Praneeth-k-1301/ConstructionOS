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
  { id: 1, name: 'Downtown Commercial Tower', status: 'In Progress', progress: 65, budget: 5000000 },
  { id: 2, name: 'Suburban Residential Complex', status: 'Planning', progress: 15, budget: 2500000 }
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

// Phase 3: Labour
let workers = [
  { id: 1, name: 'Ramesh Kumar', role: 'Mason', dailyWage: 800, status: 'Present' },
  { id: 2, name: 'Suresh Verma', role: 'Steel Fixer', dailyWage: 850, status: 'Present' }
];

// Phase 4: Expenses
let expenses = [
  { id: 1, category: 'Materials', description: 'Bulk Cement Purchase', amount: 180000, date: '2026-10-01' },
  { id: 2, category: 'Equipment', description: 'JCB Excavator Rental (1 Week)', amount: 45000, date: '2026-10-05' },
  { id: 3, category: 'Labour', description: 'Weekly Wage Advance', amount: 120000, date: '2026-10-07' }
];

// Phase 5: Documents Repository
let documents = [
  { id: 1, title: 'Architectural Blueprint v2', category: 'Blueprint', uploadedBy: 'Project Manager', date: '2026-09-15' },
  { id: 2, title: 'Municipal Environmental Clearance', category: 'Permit', uploadedBy: 'Site Engineer', date: '2026-09-20' },
  { id: 3, title: 'Contractor Safety Guidelines', category: 'Contract', uploadedBy: 'Contractor', date: '2026-09-25' }
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

// Labour Endpoints
app.get('/api/labour', (req, res) => res.json(workers));
app.post('/api/labour', (req, res) => {
  const newWorker = { id: Date.now(), name: req.body.name, role: req.body.role || 'Worker', dailyWage: Number(req.body.dailyWage) || 600, status: 'Present' };
  workers.push(newWorker);
  res.status(201).json(newWorker);
});
app.patch('/api/labour/:id', (req, res) => {
  const worker = workers.find(w => w.id === Number(req.params.id));
  if (worker) { worker.status = req.body.status; res.json(worker); }
  else res.status(404).json({ message: 'Worker not found' });
});

// Expenses Endpoints
app.get('/api/expenses', (req, res) => res.json(expenses));
app.post('/api/expenses', (req, res) => {
  const newExpense = { id: Date.now(), category: req.body.category || 'General', description: req.body.description, amount: Number(req.body.amount) || 0, date: new Date().toISOString().split('T')[0] };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Phase 5: Documents Endpoints
app.get('/api/documents', (req, res) => res.json(documents));
app.post('/api/documents', (req, res) => {
  const newDoc = { id: Date.now(), title: req.body.title, category: req.body.category || 'Blueprint', uploadedBy: req.body.uploadedBy || 'Project Manager', date: new Date().toISOString().split('T')[0] };
  documents.push(newDoc);
  res.status(201).json(newDoc);
});

// Phase 5: AI Analytics Engine Endpoint
app.get('/api/ai/analytics', (req, res) => {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = projects[0].budget;
  const lowStockItems = inventory.filter(i => i.quantity < i.minThreshold);
  const pendingTasks = tasks.filter(t => t.status !== 'Completed');

  let insights = [];
  let riskLevel = 'Low';

  if (totalSpent > budget * 0.8) {
    riskLevel = 'High';
    insights.push('⚠️ Budget Alert: Expenses have crossed 80% of total allocated budget.');
  } else {
    insights.push('✅ Budget tracking is currently within safe operational limits.');
  }

  if (lowStockItems.length > 0) {
    riskLevel = 'Medium';
    insights.push(`⚠️ Inventory Warning: ${lowStockItems.map(i => i.itemName).join(', ')} is below minimum threshold level.`);
  } else {
    insights.push('✅ All inventory stock levels are optimal.');
  }

  if (pendingTasks.length > 2) {
    insights.push(`ℹ️ Schedule Notice: There are ${pendingTasks.length} pending high-priority execution tasks.`);
  } else {
    insights.push('✅ Task execution velocity is on schedule.');
  }

  res.json({
    riskLevel,
    totalSpent,
    budgetRemaining: budget - totalSpent,
    lowStockCount: lowStockItems.length,
    pendingTasksCount: pendingTasks.length,
    insights
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));