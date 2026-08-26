import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-2 text-4xl font-bold text-accent">404</h1>
      <p className="mb-6 text-sm text-muted">This page doesn't exist.</p>
      <Link to="/" className="btn-primary">Back to Feed</Link>
    </div>
  );
}
