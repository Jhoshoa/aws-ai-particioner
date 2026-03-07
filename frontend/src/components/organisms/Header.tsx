import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Icon } from '../atoms';
import { useAuth } from '../../hooks/useAuth';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-cyber-bg/95 backdrop-blur-sm border-b border-cyber-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="text-xl font-display tracking-wider text-accent-cyan">
              AI STUDY
            </div>
            <span className="hidden sm:inline text-xs text-cyber-muted font-mono">
              AIF-C01
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm text-cyber-muted hover:text-cyber-text transition-colors"
            >
              Study Plan
            </Link>
            {isAuthenticated && (
              <Link
                to="/progress"
                className="text-sm text-cyber-muted hover:text-cyber-text transition-colors"
              >
                My Progress
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-sm text-cyber-muted hover:text-cyber-text transition-colors"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-cyber-muted">
                  <Icon name="user" size="sm" />
                  <span className="max-w-[120px] truncate">
                    {user?.displayName || user?.email}
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <Icon name="logout" size="sm" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-cyber-muted hover:text-cyber-text"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} size="md" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-cyber-border animate-fade-in">
            <nav className="flex flex-col gap-2">
              <Link
                to="/"
                className="px-3 py-2 text-sm text-cyber-muted hover:text-cyber-text hover:bg-cyber-card rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Study Plan
              </Link>
              {isAuthenticated && (
                <Link
                  to="/progress"
                  className="px-3 py-2 text-sm text-cyber-muted hover:text-cyber-text hover:bg-cyber-card rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Progress
                </Link>
              )}
              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-3 py-2 text-sm text-cyber-muted hover:text-cyber-text hover:bg-cyber-card rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              <div className="pt-2 mt-2 border-t border-cyber-border">
                {isAuthenticated ? (
                  <button
                    className="w-full px-3 py-2 text-left text-sm text-cyber-muted hover:text-cyber-text hover:bg-cyber-card rounded-lg transition-colors"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOut();
                    }}
                  >
                    Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/login"
                      className="px-3 py-2 text-sm text-cyber-muted hover:text-cyber-text hover:bg-cyber-card rounded-lg transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button size="sm" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
