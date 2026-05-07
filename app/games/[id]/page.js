import GamePageClient from "./GamePageClient";

export function generateStaticParams() {
  return [{ id: 'logic' }, { id: '2' }, { id: '3' }]
}

export default function Page() {
  return <GamePageClient />;
}
