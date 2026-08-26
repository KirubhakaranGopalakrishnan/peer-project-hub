import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function CreateProject() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/projects', { title, description, tags, githubUrl, liveUrl });
      navigate(`/projects/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold">Share a project</h1>
      <p className="mb-6 text-sm text-muted">Show off what you built and get feedback from peers.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Title</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
        <div>
          <label className="label">Tags (comma separated)</label>
          <input className="input" placeholder="React, MongoDB, Tailwind" value={tags} onChange={(e) => setTags(e.target.value)} />
        </div>
        <div>
          <label className="label">GitHub repo URL</label>
          <input className="input" type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} required />
        </div>
        <div>
          <label className="label">Live demo URL (optional)</label>
          <input className="input" type="url" value={liveUrl} onChange={(e) => setLiveUrl(e.target.value)} />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Publishing...' : 'Publish Project'}
        </button>
      </form>
    </div>
  );
}
