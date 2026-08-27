// Local dev / traditional host entry point (e.g. Render). Vercel uses
// api/index.js instead, since serverless functions can't call app.listen().
const app = require('./app');
const connectDB = require('./config/db');

const start = async () => {
  try {
    await connectDB();
  } catch (err) {
    console.error('Failed to start: could not connect to MongoDB');
    process.exit(1);
  }
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
};

start();