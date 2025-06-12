import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // your existing config...
};

export default nextConfig;

// Add this if you're using middleware.ts
export const config = {
  matcher: ['/((?!_next|favicon.ico|auth|api).*)'],
};
