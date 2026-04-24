# tisa heal

> A 60-second guided anxiety-relief tool. Type what's bothering you, watch it dissolve.

## 🚀 Deploy in 60 seconds

### Option 1 — Vercel (recommended)
1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new) → Import repo → **Deploy**
   - Zero config needed. Vercel auto-detects Vite.

### Option 2 — One command
```bash
npm install
npx vercel --prod
```

---

## 🎵 Adding background music

Open **`src/music.config.js`** — it's the only file you need to touch:

```js
// Paste a URL or a local path like "/music/ambient.mp3"
export const MUSIC_SRC = null;        // ← your URL or path here

export const MUSIC_VOLUME = 0.16;     // 0.0–1.0  (0.16 = very quiet)
export const MUSIC_FADE_DURATION = 3.5; // seconds to fade in/out
```

**For a local file:**
1. Drop your `.mp3` / `.ogg` into `public/music/`
2. Set `MUSIC_SRC = "/music/your-file.mp3"`
3. Redeploy — done.

**For a remote URL:**
```js
export const MUSIC_SRC = "https://cdn.example.com/ambient.mp3";
```

**No music (Web Audio drone only):**
```js
export const MUSIC_SRC = null;
```

> See `public/music/README.md` for free music sources.

---

## 🛠 Local development

```bash
npm install
npm run dev
```

## 📦 Build

```bash
npm run build
```

## Stack
- **React 18** + **Framer Motion** — fluid animations
- **Tailwind CSS** — utility styling
- **Vite** — fast build
- **Web Audio API** — generative ambient drone + bell tones (no files needed)
