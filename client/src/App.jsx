import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Feed from './pages/Feed';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import EditProject from './pages/EditProject';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import Analytics from './pages/Analytics';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/profile/:uid" element={<Profile />} />
            <Route
              path="/projects/new"
              element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id/edit"
              element={
                <ProtectedRoute>
                  <EditProject />
                </ProtectedRoute>
              }
            />
            <Route
              path="/favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
