import { act, fireEvent, render, screen } from '@testing-library/react';
import { GameSessionProvider, useGameSession } from '../app/context/GameSessionContext';
import Player1 from '../app/components/games/logic/Player1';

let mockAccount = '0xPlayer1';
jest.mock('../app/context/WalletContext', () => ({
  useWallet: () => ({ account: mockAccount }),
}));
jest.mock('next/image', () => function MockImage({ fill, ...props }) {
  return <img {...props} />;
});

function SessionControls() {
  const { beginJoin, completeJoin, opponentReady, setSoundEnabled } = useGameSession();
  return <>
    <button onClick={beginJoin}>Join</button>
    <button onClick={() => completeJoin({ matched: true, session_id: 42 })}>Match</button>
    <button onClick={() => setSoundEnabled(false)}>Mute</button>
    <span>{opponentReady ? 'Ready' : 'Not ready'}</span>
  </>;
}

let start;
beforeEach(() => {
  mockAccount = '0xPlayer1';
  start = jest.fn();
  window.AudioContext = jest.fn(() => ({
    state: 'running',
    resume: jest.fn().mockResolvedValue(),
    close: jest.fn().mockResolvedValue(),
    decodeAudioData: jest.fn().mockResolvedValue({}),
    createBufferSource: () => ({ connect: jest.fn(), start }),
  }));
  global.fetch = jest.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => new ArrayBuffer(8) });
});

afterEach(() => {
  delete window.AudioContext;
  delete global.fetch;
});

test('prepares audio on Join, plays on match, and keeps arrival notice until dismissed', async () => {
  render(<GameSessionProvider><SessionControls /></GameSessionProvider>);
  expect(screen.getByText('Not ready')).toBeInTheDocument();
  await act(async () => fireEvent.click(screen.getByText('Join')));
  expect(window.AudioContext).toHaveBeenCalledTimes(1);
  expect(start).not.toHaveBeenCalled();
  await act(async () => fireEvent.click(screen.getByText('Match')));
  expect(screen.getByText('Ready')).toBeInTheDocument();
  expect(screen.getByText('Opponent joined!')).toBeInTheDocument();
  expect(start).toHaveBeenCalledTimes(1);
  fireEvent.click(screen.getByText('Got it'));
  expect(screen.queryByText('Opponent joined!')).not.toBeInTheDocument();
});

test('muting still shows the arrival notice and changing wallets clears readiness', async () => {
  const view = render(<GameSessionProvider><SessionControls /></GameSessionProvider>);
  fireEvent.click(screen.getByText('Mute'));
  fireEvent.click(screen.getByText('Join'));
  fireEvent.click(screen.getByText('Match'));
  expect(screen.getByText('Opponent joined!')).toBeInTheDocument();
  expect(window.AudioContext).not.toHaveBeenCalled();
  mockAccount = '0xPlayer2';
  view.rerender(<GameSessionProvider><SessionControls /></GameSessionProvider>);
  expect(screen.getByText('Not ready')).toBeInTheDocument();
  expect(screen.queryByText('Opponent joined!')).not.toBeInTheDocument();
});

test('audio failure does not prevent the match notice', async () => {
  window.AudioContext.mockImplementation(() => { throw new Error('Blocked'); });
  render(<GameSessionProvider><SessionControls /></GameSessionProvider>);
  fireEvent.click(screen.getByText('Join'));
  fireEvent.click(screen.getByText('Match'));
  expect(screen.getByText('Ready')).toBeInTheDocument();
  expect(screen.getByText('Opponent joined!')).toBeInTheDocument();
});

test('three selected cards cannot be locked until an opponent is ready', () => {
  const images = ['/one.png', '/two.png', '/three.png'];
  const view = render(<Player1 images={images} />);
  screen.getAllByAltText('NFT').forEach(image => fireEvent.click(image));
  expect(screen.getByRole('button', { name: 'LOCK IN SELECTION' })).toBeDisabled();
  view.rerender(<Player1 images={images} opponentReady />);
  expect(screen.getByRole('button', { name: 'LOCK IN SELECTION' })).toBeEnabled();
  fireEvent.click(screen.getAllByAltText('NFT')[0]);
  expect(screen.getByRole('button', { name: 'LOCK IN SELECTION' })).toBeDisabled();
});
