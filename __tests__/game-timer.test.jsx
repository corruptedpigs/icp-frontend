import { render, screen, act } from '@testing-library/react';

const push = jest.fn();
jest.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));
jest.mock('../app/components/games/modalTimeIsUp', () => ({ isOpen }) => (isOpen ? <div>Time is up</div> : null));
const GameTimer = require('../app/components/game_timer').default;

beforeEach(() => { jest.useFakeTimers(); push.mockClear(); });
afterEach(() => jest.useRealTimers());

test('asks the server at the deadline and shows the modal when it confirms', async () => {
  const onExpire = jest.fn().mockResolvedValue(null);
  render(<GameTimer deadline={Date.now() + 5000} onExpire={onExpire} />);
  expect(screen.queryByText('Time is up')).toBeNull();
  await act(async () => { jest.advanceTimersByTime(5000); });
  expect(onExpire).toHaveBeenCalledTimes(1);
  expect(screen.getByText('Time is up')).toBeInTheDocument();
});

test('follows a later server deadline instead of showing the modal', async () => {
  const onExpire = jest.fn().mockResolvedValueOnce({ deadline: Date.now() + 8000 }).mockResolvedValue(null);
  render(<GameTimer deadline={Date.now() + 1000} onExpire={onExpire} />);
  await act(async () => { jest.advanceTimersByTime(1000); });
  expect(screen.queryByText('Time is up')).toBeNull();
  await act(async () => { jest.advanceTimersByTime(8000); });
  expect(onExpire).toHaveBeenCalledTimes(2);
  expect(screen.getByText('Time is up')).toBeInTheDocument();
});
