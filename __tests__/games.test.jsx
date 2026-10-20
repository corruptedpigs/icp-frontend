import { render, screen } from '@testing-library/react';
import GamesPageClient from '../app/games/GamesPageClient';

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('../app/context/WalletContext', () => ({
  useWallet: () => ({ account: '0xTestAccount', isConnecting: false }),
}));
jest.mock('../app/hooks/useJoinGame', () => ({
  useJoinGame: () => ({ isLoading: true, isWaiting: true, error: null }),
}));
jest.mock('../ui/components/homepage/navbar_with_connect_wallet', () => () => null);
jest.mock('../app/components/GameHUD', () => () => null);
jest.mock('../app/components/choose_game_card', () => () => null);

test('shows waiting for opponent rather than signing while matchmaking is loading', () => {
  render(<GamesPageClient />);

  expect(screen.getByText('Waiting for opponent…')).toBeInTheDocument();
  expect(screen.queryByText('Signing in…')).not.toBeInTheDocument();
  expect(screen.getByTitle('Waiting for opponent…')).toHaveAttribute('aria-busy', 'true');
});
