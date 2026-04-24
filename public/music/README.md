# 🎵 Music Folder

Drop your ambient audio file here, then open `src/music.config.js` and set the path.

## Steps

1. Place your `.mp3` or `.ogg` file in this folder, e.g. `ambient.mp3`
2. Open `src/music.config.js`
3. Change the line:

   ```js
   export const MUSIC_SRC = null;
   ```

   to:

   ```js
   export const MUSIC_SRC = "/music/ambient.mp3";
   ```

4. Save, commit, redeploy — done.

## Using a remote URL instead

If your audio is hosted on a CDN or YouTube-dl rip link:

```js
export const MUSIC_SRC = "https://your-cdn.com/path/to/ambient.mp3";
```

## Volume

Adjust `MUSIC_VOLUME` in `src/music.config.js` (default: 0.16).
Range: 0.0 (silent) → 1.0 (full). Recommended: 0.12–0.22 for therapy feel.

## Formats

- `.mp3` — works everywhere ✓
- `.ogg` — smaller, Firefox-preferred ✓  
- `.wav` — uncompressed, large files ✗ (avoid)

## Good free ambient sources

- https://freemusicarchive.org (filter: ambient)
- https://pixabay.com/music/ (search: meditation)
- https://soundcloud.com/search?q=ambient+meditation&filter.license=to_use_commercially
