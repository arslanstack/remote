export const KEYCODE = {
  DPAD_UP: 19,
  DPAD_DOWN: 20,
  DPAD_LEFT: 21,
  DPAD_RIGHT: 22,
  DPAD_CENTER: 23,
  BACK: 4,
  HOME: 3,
  MENU: 82,
  POWER: 26,
  VOLUME_UP: 24,
  VOLUME_DOWN: 25,
  VOLUME_MUTE: 164,
  MEDIA_PLAY_PAUSE: 85,
  MEDIA_REWIND: 89,
  MEDIA_FAST_FORWARD: 90,
  MEDIA_NEXT: 87,
  MEDIA_PREVIOUS: 88,
} as const;

export type KeyCode = (typeof KEYCODE)[keyof typeof KEYCODE];
export type KeyDirection = 'SHORT' | 'LONG' | 'START_LONG' | 'END_LONG';
