// ─────────────────────────────────────────────────────────────────────
//  TISA HEAL — MUSIC CONFIG
//  Edit MUSIC_SRC to change the background music.
// ─────────────────────────────────────────────────────────────────────

// Option A: Local file → place it in /public/music/ and set the path:
//   MUSIC_SRC = "/music/ambient.mp3"
//
// Option B: Remote URL (must be publicly accessible):
//   MUSIC_SRC = "https://your-cdn.com/ambient.mp3"
//
// Option C: No music, use only the built-in Web Audio drone:
//   MUSIC_SRC = null

export const MUSIC_SRC = null;   // ← PASTE YOUR URL OR PATH HERE

// Volume (0.0 – 1.0). Recommended: 0.12–0.22 for ambient background.
export const MUSIC_VOLUME = 0.16;

// How long (in seconds) the music fades in and out.
export const MUSIC_FADE_DURATION = 3.5;
