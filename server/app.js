// The Express app itself, with no app.listen() call. This is required
// by both server.js (local dev / traditional hosts like Render) and
// api/index.js (Vercel serverless), so route/middleware setup only
// lives in one place.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/firebaseAdmin');

const projectRoutes = require('./routes/projectRoutes');
const userRoutes = require('./routes/userRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req, res) => res.send('Peer Project Hub API running'));
app.get('/api', (req, res) => res.send('Peer Project Hub API running'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Unexpected server error' });
});

module.exports = app;