import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Button, Text } from '../atoms';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-cyber-bg flex items-center justify-center px-4">
      <Helmet>
        <title>404 - Page Not Found | AWS AI Practitioner</title>
      </Helmet>

      <div className="text-center">
        <Text variant="h1" className="text-8xl text-accent-cyan mb-4">
          404
        </Text>
        <Text variant="h3" className="mb-2">
          Page Not Found
        </Text>
        <Text variant="small" className="mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
