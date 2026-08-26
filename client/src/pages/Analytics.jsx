import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

export default function Analytics() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/analytics')
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load analytics.'));
  }, []);

  if (error) return <p className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-danger">{error}</p>;
  if (!stats) return <Loader label="Loading analytics..." />;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold">Community stats</h1>
      <p className="mb-8 text-sm text-muted">A quick snapshot of Peer Project Hub activity.</p>

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <StatCard label="Total Projects" value={stats.totalProjects} />
        <StatCard label="Total Users" value={stats.totalUsers} />
      </div>

      {stats.mostLiked && (
        <div className="card p-5">
          <p className="label mb-2">Most Liked Project</p>
          <Link to={`/projects/${stats.mostLiked._id}`} className="text-lg font-semibold text-accent hover:underline">
            {stats.mostLiked.title}
          </Link>
          <p className="mt-1 text-sm text-muted">♥ {stats.mostLiked.likesCount} likes · by {stats.mostLiked.ownerName}</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="card p-5">
      <p className="label mb-1">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
