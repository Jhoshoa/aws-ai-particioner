import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Button, Input, Icon } from '../atoms';
import { FormField, Alert } from '../molecules';
import { useAuth } from '../../hooks/useAuth';

const signupSchema = z
  .object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [error, setError] = useState<string | null>(null);
  const { signUpWithEmail, signInWithGoogle, isLoading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setError(null);
    const result = await signUpWithEmail(data.email, data.password, data.displayName);
    if (!result.success) {
      setError(result.error || 'Sign up failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error || 'Google sign in failed');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl tracking-wider text-white mb-2">
          GET STARTED
        </h1>
        <p className="text-cyber-muted text-sm">
          Create an account to track your progress
        </p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField label="Display Name" error={errors.displayName?.message} required>
          <Input
            type="text"
            placeholder="John Doe"
            error={!!errors.displayName}
            {...register('displayName')}
          />
        </FormField>

        <FormField label="Email" error={errors.email?.message} required>
          <Input
            type="email"
            placeholder="you@example.com"
            error={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <FormField label="Password" error={errors.password?.message} required>
          <Input
            type="password"
            placeholder="••••••••"
            error={!!errors.password}
            {...register('password')}
          />
        </FormField>

        <FormField
          label="Confirm Password"
          error={errors.confirmPassword?.message}
          required
        >
          <Input
            type="password"
            placeholder="••••••••"
            error={!!errors.confirmPassword}
            {...register('confirmPassword')}
          />
        </FormField>

        <Button type="submit" className="w-full" isLoading={isLoading}>
          Create Account
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-cyber-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-cyber-bg px-4 text-cyber-muted">
            or continue with
          </span>
        </div>
      </div>

      <Button
        type="button"
        variant="secondary"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        <Icon name="google" size="sm" />
        Google
      </Button>

      <p className="mt-6 text-center text-sm text-cyber-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-accent-cyan hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
