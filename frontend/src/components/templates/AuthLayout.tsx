import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

export interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-cyber-bg flex flex-col">
      {/* Simple Header */}
      <header className="py-6 px-4">
        <Link to="/" className="flex items-center justify-center gap-2">
          <span className="font-display text-2xl tracking-wider text-accent-cyan">
            AI STUDY
          </span>
        </Link>
      </header>

      {/* Auth Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-cyber-card border border-cyber-border rounded-2xl p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 text-center text-xs text-cyber-muted">
        <p>AWS AI Practitioner Study Plan</p>
      </footer>
    </div>
  );
}
