// src/app/error.tsx
'use client';
import ErrorPage from '../components/ErrorPage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorPage 
      errorCode="500"
      title="Something went wrong"
      message="An unexpected error occurred. Please try again."
      onRetry={reset}
    />
  );
}