import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-primary">
              Twinkle
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/browse" className="hover:text-primary">
                Browse
              </Link>
              {user ? (
                <>
                  {user.role === 'CREATOR' && (
                    <Link to="/creator/dashboard" className="hover:text-primary">
                      Dashboard
                    </Link>
                  )}
                  {user.role === 'ADMIN' && (
                    <Link to="/admin" className="hover:text-primary">
                      Admin
                    </Link>
                  )}
                  <span className="text-sm text-muted-foreground">{user.email}</span>
                  <Button variant="outline" size="sm" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
      <footer className="border-t bg-gray-50 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 Twinkle. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

