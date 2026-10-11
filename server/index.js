const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ConstructionOS API is running' });
});

// Mock Data endpoints for Project Planning & Tasks
app.get('/api/projects', (req, res) => {
  res.json([
    { id: 1, name: 'Downtown Commercial Tower', status: 'In Progress', progress: 65 },
    { id: 2, name: 'Suburban Residential Complex', status: 'Planning', progress: 15 }
  ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
