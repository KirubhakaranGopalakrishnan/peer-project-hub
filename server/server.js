require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('./config/firebaseAdmin'); // throws early and loudly if misconfigured

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

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Unexpected server error' });
});

const start = async () => {
  await connectDB();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
};

start();
