import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  vi.restoreAllMocks();
});

it('bounds debug measures and lets the aggregation timer finish', async () => {
  vi.resetModules();
  vi.useFakeTimers();
  vi.stubGlobal('window', { location: { search: '?s42_debug=true' } });
  const output = vi.spyOn(console, 'log').mockImplementation(() => undefined);
  const table = vi.spyOn(console, 'table').mockImplementation(() => undefined);
  const debug = await import('./debug');
  for (let i = 0; i < 150; i++) {
    debug.timeStart('test');
    debug.timeEnd('test');
  }
  expect(performance.getEntriesByName('s42-test')).toEqual([]);
  expect(performance.getEntriesByName('s42-start-test')).toEqual([]);
  (window as unknown as { __s42_dump(): void }).__s42_dump();
  expect(table.mock.calls[0][0]).toHaveLength(100);
  debug.trackOperation('create-test');
  expect(vi.getTimerCount()).toBe(1);
  vi.advanceTimersByTime(5000);
  expect(vi.getTimerCount()).toBe(0);
  expect(output).toHaveBeenCalled();
});
