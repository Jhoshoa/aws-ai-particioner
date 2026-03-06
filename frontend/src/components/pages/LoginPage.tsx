import { Helmet } from 'react-helmet-async';
import { AuthLayout } from '../templates';
import { LoginForm } from '../organisms';

export function LoginPage() {
  return (
    <AuthLayout>
      <Helmet>
        <title>Sign In | AWS AI Practitioner Study Plan</title>
      </Helmet>
      <LoginForm />
    </AuthLayout>
  );
}
