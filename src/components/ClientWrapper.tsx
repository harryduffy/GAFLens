'use client';

import LoadingWrapper from './LoadingWrapper';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <LoadingWrapper>{children}</LoadingWrapper>;
}
