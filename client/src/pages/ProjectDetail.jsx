import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import Tag from '../components/Tag';
import RatingStars from '../components/RatingStars';
import CommentList from '../components/CommentList';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [posting, setPosting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get(`/projects/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setError('Project not found.'))
      .finally(() => setLoading(false));
  };

  useEffect(load, [id]);

  const handleLike = async () => {
    const { data: res } = await api.post(`/projects/${id}/like`);
    setData((d) => ({
      ...d,
      isLiked: res.liked,
      project: { ...d.project, likesCount: res.likesCount },
    }));
  };

  const handleBookmark = async () => {
    const { data: res } = await api.post(`/projects/${id}/bookmark`);
    setData((d) => ({ ...d, isBookmarked: res.bookmarked }));
  };

  const handleRate = async (value) => {
    const { data: res } = await api.post(`/projects/${id}/rating`, { value });
    setData((d) => ({
      ...d,
      myRating: res.myRating,
      project: { ...d.project, avgRating: res.avgRating, ratingsCount: res.ratingsCount },
    }));
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setPosting(true);
    try {
      await api.post(`/projects/${id}/comments`, { text: commentText });
      setCommentText('');
      load();
    } finally {
      setPosting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    await api.delete(`/projects/${id}/comments/${commentId}`);
    load();
  };

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    await api.delete(`/projects/${id}`);
    navigate('/');
  };

  if (loading) return <Loader label="Loading project..." />;
  if (error) return <p className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-danger">{error}</p>;

  const { project, comments, isBookmarked, isLiked, myRating } = data;
  const isOwner = user && user.uid === project.ownerUid;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="mb-1 text-2xl font-bold">{project.title}</h1>
          <p className="text-sm text-muted">
            by{' '}
            <Link to={`/profile/${project.ownerUid}`} className="text-accent hover:underline">
              {project.ownerName}
            </Link>{' '}
            · {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
        {isOwner && (
          <div className="flex shrink-0 gap-2">
            <Link to={`/projects/${id}/edit`} className="btn-secondary">Edit</Link>
            <button onClick={handleDeleteProject} className="btn-secondary text-danger hover:border-danger/50">
              Delete
            </button>
          </div>
        )}
      </div>

      {project.tags?.length > 0 && (
        <div className="mb-5 flex flex-wrap gap-1.5">
          {project.tags.map((t) => <Tag key={t} label={t} />)}
        </div>
      )}

      <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-fg2">{project.description}</p>

      <div className="mb-8 flex flex-wrap items-center gap-3">
        <a href={project.githubUrl} target="_blank" rel="noreferrer" className="btn-secondary">GitHub Repo ↗</a>
        {project.liveUrl && (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="btn-secondary">Live Demo ↗</a>
        )}

        {user && (
          <>
            <button onClick={handleLike} className={`btn-secondary ${isLiked ? 'border-accent text-accent' : ''}`}>
              {isLiked ? '♥ Liked' : '♡ Like'} ({project.likesCount})
            </button>
            <button onClick={handleBookmark} className={`btn-secondary ${isBookmarked ? 'border-accent text-accent' : ''}`}>
              {isBookmarked ? '★ Bookmarked' : '☆ Bookmark'}
            </button>
          </>
        )}
      </div>

      <div className="mb-8 card p-4">
        <p className="label mb-2">Rating</p>
        <div className="flex items-center gap-3">
          <RatingStars value={Math.round(project.avgRating || 0)} readOnly />
          <span className="text-sm text-muted">{project.avgRating || 0} ({project.ratingsCount} rating{project.ratingsCount !== 1 ? 's' : ''})</span>
        </div>
        {user && (
          <div className="mt-3 border-t border-border pt-3">
            <p className="mb-1 text-xs text-muted">Your rating:</p>
            <RatingStars value={myRating} onRate={handleRate} />
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Comments ({comments.length})</h2>

        {user ? (
          <form onSubmit={handleComment} className="mb-6 flex gap-2">
            <input
              className="input flex-1"
              placeholder="Leave feedback for this project..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" disabled={posting} className="btn-primary">Post</button>
          </form>
        ) : (
          <p className="mb-6 text-sm text-muted">
            <Link to="/login" className="text-accent hover:underline">Log in</Link> to leave a comment.
          </p>
        )}

        <CommentList comments={comments} onDelete={handleDeleteComment} />
      </div>
    </div>
  );
}
