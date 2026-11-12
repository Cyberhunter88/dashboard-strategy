import { beforeAll, describe, expect, it } from 'vitest';

let buildWebrtcCameraCard: typeof import('./RoomViewStrategy').buildWebrtcCameraCard;

beforeAll(async () => {
  Object.assign(globalThis, {
    HTMLElement: class {},
    customElements: { define: () => undefined },
  });
  ({ buildWebrtcCameraCard } = await import('./RoomViewStrategy'));
});

describe('buildWebrtcCameraCard', () => {
  it('applies smooth-playback defaults for an entity-backed camera', () => {
    expect(buildWebrtcCameraCard('camera.door', 'Door', undefined)).toEqual({
      type: 'custom:webrtc-camera',
      title: 'Door',
      mode: 'webrtc,mse',
      media: 'video',
      muted: true,
      intersection: 0.5,
      background: false,
      entity: 'camera.door',
    });
  });

  it('keeps defaults when a stream URL string is mapped', () => {
    const card = buildWebrtcCameraCard('camera.door', 'Door', {
      'camera.door': ' rtsp://viewer.example.org:8554/live/door/wide/fast ',
    });
    expect(card.url).toBe('rtsp://viewer.example.org:8554/live/door/wide/fast');
    expect(card.mode).toBe('webrtc,mse');
    expect(card.intersection).toBe(0.5);
    expect(card.entity).toBeUndefined();
  });

  it('lets per-camera options override the defaults', () => {
    const card = buildWebrtcCameraCard('camera.door', 'Door', {
      'camera.door': { url: 'rtsp://example/stream', mode: 'mse', muted: false, intersection: 0.8, background: true },
    });
    expect(card).toMatchObject({
      url: 'rtsp://example/stream',
      mode: 'mse',
      muted: false,
      intersection: 0.8,
      background: true,
    });
  });
});
