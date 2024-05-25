// pages/app/games/[slug]/page.js
import { usePathname } from 'next/navigation';
import LogicTemplate from './logic';

export function generateStaticParams() {
  // Define the static parameters for the dynamic route
  return [
    { params: { slug: 'logic' } },
    // { params: { slug: 'multiplayer' } },
    // Add other static parameters as needed
  ];
}

export default function GameDetailPage({ params }) {
  debugger;
  const pathname = usePathname();
  const slug = params?.slug || pathname.split('/').pop();

  if (!slug) return null; // Ensure slug is available before rendering

  if (slug === 'logic') {
    return <LogicTemplate />;
  }

  // Default case for other slugs
  return (
    <div>
      <h1>Game Detail Page for game with Slug: {slug}</h1>
      {/* Add the content and structure for the default template */}
    </div>
  );
}
