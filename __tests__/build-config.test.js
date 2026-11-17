jest.mock('webpack', () => ({ EnvironmentPlugin: jest.fn() }), { virtual: true });
jest.mock('../dfx.webpack.config', () => ({ initCanisterIds: jest.fn() }));
jest.mock('node:child_process', () => ({ execFileSync: jest.fn() }));

const { execFileSync } = require('node:child_process');
const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_BUILD } = require('next/constants');
const createConfig = require('../next.config');
const originalCommit = process.env.BUILD_COMMIT_SHA;

beforeEach(() => {
  delete process.env.BUILD_COMMIT_SHA;
  execFileSync.mockReset();
});

afterEach(() => {
  if (originalCommit === undefined) delete process.env.BUILD_COMMIT_SHA;
  else process.env.BUILD_COMMIT_SHA = originalCommit;
});

test('embeds the build machine Git revision', () => {
  execFileSync.mockReturnValue('abc123\n');
  expect(createConfig(PHASE_PRODUCTION_BUILD).env.BUILD_COMMIT_SHA).toBe('abc123');
  expect(execFileSync).toHaveBeenCalledWith('git', ['rev-parse', 'HEAD'], expect.objectContaining({ encoding: 'utf8' }));
});

test('supports explicit revisions without Git', () => {
  process.env.BUILD_COMMIT_SHA = 'ci-revision';
  expect(createConfig(PHASE_PRODUCTION_BUILD).env.BUILD_COMMIT_SHA).toBe('ci-revision');
  expect(execFileSync).not.toHaveBeenCalled();
});

test('builds without Git using an unknown revision', () => {
  execFileSync.mockImplementation(() => { throw new Error('Git unavailable'); });
  expect(createConfig(PHASE_PRODUCTION_BUILD).env.BUILD_COMMIT_SHA).toBe('unknown');
});

test('exports to the ICP source directory while isolating development cache', () => {
  execFileSync.mockReturnValue('abc123');
  const config = createConfig(PHASE_PRODUCTION_BUILD);
  const dfx = require('../dfx.json');
  expect(config.output).toBe('export');
  expect(dfx.canisters.corrupted_pigs_assets.source).toContain(config.distDir);
  expect(createConfig(PHASE_DEVELOPMENT_SERVER).distDir).toBe('.next-dev');
});
