'use client';

import dynamic from 'next/dynamic';

// Import the worker configuration
import '../../lib/pdf-worker';

// Dynamically import react-pdf components
export const Document = dynamic(
  () => import('react-pdf').then(mod => mod.Document),
  { ssr: false }
);

export const Page = dynamic(
  () => import('react-pdf').then(mod => mod.Page),
  { ssr: false }
);