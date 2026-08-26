import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import Loader from '../components/Loader';

export default function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`).then((res) => {
      const p = res.data.project;
      setForm({
        title: p.title,
        description: p.description,
        tags: p.tags.join(', '),
        githubUrl: p.githubUrl,
        liveUrl: p.liveUrl,
      });
    });
  }, [id]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.put(`/projects/${id}`, form);
      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <Loader label="Loading project..." />;

  return (
    <div className="mx-auto max-w-xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-bold">Edit project</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label">Title</label>
          <input className="input" value={form.title} onChange={update('title')} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={5} value={form.description} onChange={update('description')} required />
        </div>
        <div>
          <label className="label">Tags (comma separated)</label>
          <input className="input" value={form.tags} onChange={update('tags')} />
        </div>
        <div>
          <label className="label">GitHub repo URL</label>
          <input className="input" type="url" value={form.githubUrl} onChange={update('githubUrl')} required />
        </div>
        <div>
          <label className="label">Live demo URL</label>
          <input className="input" type="url" value={form.liveUrl} onChange={update('liveUrl')} />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
