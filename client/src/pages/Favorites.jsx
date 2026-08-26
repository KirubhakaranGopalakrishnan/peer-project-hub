import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import Loader from '../components/Loader';

export default function Favorites() {
  const [projects, setProjects] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/users/me/bookmarks')
      .then((res) => setProjects(res.data))
      .catch(() => setError('Failed to load favorites.'));
  }, []);

  if (error) return <p className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-danger">{error}</p>;
  if (!projects) return <Loader label="Loading favorites..." />;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold">Your favorites</h1>
      <p className="mb-8 text-sm text-muted">Projects you've bookmarked to revisit later.</p>

      {projects.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">You haven't bookmarked any projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
      )}
    </div>
  );
}
