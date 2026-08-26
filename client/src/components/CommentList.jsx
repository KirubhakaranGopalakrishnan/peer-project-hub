import { useAuth } from '../context/AuthContext';

export default function CommentList({ comments, onDelete }) {
  if (!comments || comments.length === 0) {
    return <p className="py-6 text-sm text-muted">No comments yet — be the first to leave feedback.</p>;
  }

  return (
    <ul className="flex flex-col gap-4">
      {comments.map((c) => (
        <CommentItem key={c._id} comment={c} onDelete={onDelete} />
      ))}
    </ul>
  );
}

function CommentItem({ comment, onDelete }) {
  const { user } = useAuth();
  const isMine = user && user.uid === comment.authorUid;

  return (
    <li className="rounded-lg border border-border bg-surface2 p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium text-fg">{comment.authorName}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">{new Date(comment.createdAt).toLocaleDateString()}</span>
          {isMine && (
            <button
              onClick={() => onDelete(comment._id)}
              className="text-xs text-danger hover:text-danger/80"
            >
              Delete
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-fg2">{comment.text}</p>
    </li>
  );
}
