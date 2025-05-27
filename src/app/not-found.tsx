// src/app/not-found.tsx
import ErrorPage from '../components/ErrorPage';

export default function NotFound() {
  return (
    <ErrorPage 
      errorCode="404"
      title="Page Not Found"
      message="The page you are looking for could not be found."
    />
  );
}