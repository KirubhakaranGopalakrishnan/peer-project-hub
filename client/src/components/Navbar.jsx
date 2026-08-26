import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="text-lg font-bold tracking-tight">
          <span className="bg-gradient-to-r from-accent to-fuchsia-400 bg-clip-text text-transparent">
            Peer Project Hub
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link to="/" className="text-muted transition hover:text-fg">Feed</Link>
          <Link to="/analytics" className="text-muted transition hover:text-fg">Analytics</Link>
          <ThemeToggle />

          {user ? (
            <>
              <Link to="/favorites" className="text-muted transition hover:text-fg">Favorites</Link>
              <Link to="/projects/new" className="btn-primary">+ New Project</Link>
              <Link to={`/profile/${user.uid}`} className="flex items-center gap-2 text-muted transition hover:text-fg">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full border border-border" />
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface2 text-xs">
                    {(user.displayName || user.email || '?')[0].toUpperCase()}
                  </span>
                )}
              </Link>
              <button onClick={handleLogout} className="btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-muted transition hover:text-fg">Login</Link>
              <Link to="/signup" className="btn-primary">Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
