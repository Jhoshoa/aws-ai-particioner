import { Helmet } from 'react-helmet-async';
import { AuthLayout } from '../templates';
import { SignupForm } from '../organisms';

export function SignupPage() {
  return (
    <AuthLayout>
      <Helmet>
        <title>Sign Up | AWS AI Practitioner Study Plan</title>
      </Helmet>
      <SignupForm />
    </AuthLayout>
  );
}
