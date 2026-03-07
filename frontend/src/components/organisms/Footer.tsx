import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-cyber-card border-t border-cyber-border py-8 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-lg tracking-wider text-accent-cyan">
              AI STUDY
            </span>
            <span className="text-cyber-muted text-sm">
              — AWS AI Practitioner AIF-C01
            </span>
          </div>

          <nav className="flex items-center gap-6 text-sm text-cyber-muted">
            <Link to="/" className="hover:text-cyber-text transition-colors">
              Home
            </Link>
            <a
              href="https://aws.amazon.com/certification/certified-ai-practitioner/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyber-text transition-colors"
            >
              Official Exam Guide
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyber-text transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>

        <div className="mt-6 pt-6 border-t border-cyber-border/50 text-center text-xs text-cyber-muted">
          <p>
            Built for certification success. Not affiliated with Amazon Web Services.
          </p>
        </div>
      </div>
    </footer>
  );
}
