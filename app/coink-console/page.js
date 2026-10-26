import { Suspense } from 'react';
import CoinkConsolePageClient from './CoinkConsolePageClient';

export const metadata = {
  title: 'COINK Console | CPigs',
  robots: { index: false, follow: false },
};

export default function CoinkConsolePage() {
  return <Suspense fallback={null}><CoinkConsolePageClient /></Suspense>;
}
