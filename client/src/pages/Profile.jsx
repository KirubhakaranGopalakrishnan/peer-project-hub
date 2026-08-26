import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import Loader from '../components/Loader';

export default function Profile() {
  const { uid } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(`/users/${uid}`)
      .then((res) => {
        setData(res.data);
        setBio(res.data.user.bio || '');
      })
      .catch(() => setError('User not found.'));
  }, [uid]);

  const isMe = user && user.uid === uid;

  const handleSaveBio = async () => {
    setSaving(true);
    try {
      const { data: updated } = await api.put('/users/me', { bio });
      setData((d) => ({ ...d, user: updated }));
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (error) return <p className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-danger">{error}</p>;
  if (!data) return <Loader label="Loading profile..." />;

  const { user: profileUser, projects } = data;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-start gap-4">
        {profileUser.photoURL ? (
          <img src={profileUser.photoURL} alt="" className="h-16 w-16 rounded-full border border-border" />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface2 text-xl font-semibold">
            {profileUser.displayName[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profileUser.displayName}</h1>
          <p className="text-sm text-muted">{profileUser.email}</p>

          {!editing && (
            <p className="mt-2 text-sm text-fg2">{profileUser.bio || (isMe ? 'Add a short bio about yourself.' : '')}</p>
          )}

          {editing && (
            <div className="mt-2 flex flex-col gap-2">
              <textarea className="input" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              <div className="flex gap-2">
                <button onClick={handleSaveBio} disabled={saving} className="btn-primary">
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          )}

          {isMe && !editing && (
            <button onClick={() => setEditing(true)} className="mt-2 text-xs text-accent hover:underline">
              Edit bio
            </button>
          )}
        </div>
      </div>

      <h2 className="mb-4 text-lg font-semibold">Projects ({projects.length})</h2>
      {projects.length === 0 ? (
        <p className="text-sm text-muted">No projects posted yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
        </div>
      )}
    </div>
  );
}
