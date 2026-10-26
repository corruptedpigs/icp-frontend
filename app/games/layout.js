import { GameSessionProvider } from '../context/GameSessionContext';

export default function GamesLayout({ children }) {
  return <GameSessionProvider>{children}</GameSessionProvider>;
}
