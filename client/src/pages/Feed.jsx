import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProjectCard from '../components/ProjectCard';
import Tag from '../components/Tag';
import Loader from '../components/Loader';

const POPULAR_TAGS = ['React', 'Node.js', 'MongoDB', 'Python', 'JavaScript', 'CSS', 'API', 'Firebase'];

export default function Feed() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [tag, setTag] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/projects', { params: { q, tag, page, limit: 9 } })
      .then((res) => {
        setProjects(res.data.projects);
        setPages(res.data.pages);
      })
      .catch(() => setError('Failed to load projects.'))
      .finally(() => setLoading(false));
  }, [q, tag, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setQ(searchInput.trim());
  };

  const handleTagClick = (t) => {
    setPage(1);
    setTag((current) => (current === t ? '' : t));
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <h1 className="mb-1 text-2xl font-bold">Discover projects</h1>
        <p className="text-sm text-muted">Browse what other students are building.</p>
      </div>

      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <input
          className="input flex-1"
          placeholder="Search by title, description, or tag..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="btn-primary">Search</button>
      </form>

      <div className="mb-8 flex flex-wrap gap-2">
        {POPULAR_TAGS.map((t) => (
          <Tag key={t} label={t} active={tag === t} onClick={handleTagClick} />
        ))}
      </div>

      {loading && <Loader label="Loading projects..." />}
      {error && <p className="text-sm text-danger">{error}</p>}

      {!loading && !error && projects.length === 0 && (
        <p className="py-16 text-center text-sm text-muted">No projects found. Try a different search.</p>
      )}

      {!loading && projects.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <ProjectCard key={p._id} project={p} />
            ))}
          </div>

          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                className="btn-secondary"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </button>
              <span className="text-sm text-muted">Page {page} of {pages}</span>
              <button
                className="btn-secondary"
                disabled={page >= pages}
                onClick={() => setPage((p) => Math.min(pages, p + 1))}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
