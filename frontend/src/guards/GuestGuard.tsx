import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * Guest guard component - redirects authenticated users
 */
export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading, isInitialized } = useAuth();
  const location = useLocation();

  // Show loading while auth is initializing
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-cyber-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-accent-cyan border-t-transparent rounded-full animate-spin" />
          <span className="text-cyber-muted text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to intended destination or home if authenticated
  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
