import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── HEALING MESSAGES ───────────────────────────────────────────────
const MESSAGES = [
  { text: "Take a slow breath in…",           sub: "let your shoulders drop" },
  { text: "…and breathe all the way out",     sub: "you're safe right now" },
  { text: "This thought is just a visitor.",  sub: "it doesn't live here" },
  { text: "You are not this feeling.",        sub: "you are the sky it passes through" },
  { text: "Everything you carry feels heavy.", sub: "it's okay to set it down, just for now" },
  { text: "You have survived every hard moment before this.", sub: "your track record is perfect" },
  { text: "Somewhere, the sun is rising.",    sub: "the world is still turning gently" },
  { text: "You are allowed to be imperfect.", sub: "and still be enough" },
  { text: "This too shall pass.",             sub: "like every storm before it" },
  { text: "Watch it drift…",                  sub: "smaller now… smaller still" },
  { text: "You are more than what worries you.", sub: "so much more" },
  { text: "Rivers flow past every stone.",    sub: "water always finds its way" },
  { text: "Be gentle with yourself.",         sub: "you are someone worth caring for" },
  { text: "Let it go… slowly…",              sub: "there's nothing left to hold on to" },
  { text: "Notice how quiet it's becoming.", sub: "that's you, healing" },
];

const RESOURCES = [
  { name: "Breathe",    desc: "Guided breathing exercises", url: "https://www.calm.com/breathe",    color: "rgba(100,180,255,0.10)", border: "rgba(100,180,255,0.28)" },
  { name: "Mindful",    desc: "Mindfulness articles",       url: "https://www.mindful.org",          color: "rgba(120,200,150,0.10)", border: "rgba(120,200,150,0.28)" },
  { name: "Calm",       desc: "Sleep & meditation app",     url: "https://www.calm.com",             color: "rgba(160,140,220,0.10)", border: "rgba(160,140,220,0.28)" },
  { name: "Headspace",  desc: "Everyday mindfulness",       url: "https://www.headspace.com",        color: "rgba(240,170,100,0.10)", border: "rgba(240,170,100,0.28)" },
];

// ─── STAR FIELD CANVAS ──────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef(null);
  const starsRef  = useRef([]);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 190; i++) {
      starsRef.current.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 0.3 + Math.random() * 1.4,
        speed: 0.08 + Math.random() * 0.35,
        baseOp: 0.08 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
        dp: 0.004 + Math.random() * 0.016,
        rising: false,
      });
    }

    let lastSpawn = 0;
    const tick = (ts) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (ts - lastSpawn > 130) {
        lastSpawn = ts;
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 8,
          r: 0.4 + Math.random() * 1.1,
          speed: 0.2 + Math.random() * 0.75,
          baseOp: 0.2 + Math.random() * 0.42,
          phase: Math.random() * Math.PI * 2,
          dp: 0.007 + Math.random() * 0.018,
          rising: true,
        });
      }
      for (let i = starsRef.current.length - 1; i >= 0; i--) {
        const s = starsRef.current[i];
        s.phase += s.dp;
        if (s.rising) s.y -= s.speed;
        const tw = 0.5 + 0.5 * Math.sin(s.phase);
        const op = Math.min(1, s.baseOp * tw);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,220,255,${op})`;
        ctx.shadowColor = `rgba(180,210,255,${op * 0.5})`;
        ctx.shadowBlur = 4;
        ctx.fill();
        if (s.y < -8) starsRef.current.splice(i, 1);
      }
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", inset: 0,
        width: "100%", height: "100%",
        zIndex: 0, pointerEvents: "none",
      }}
    />
  );
}

// ─── PIXEL DOODLES ──────────────────────────────────────────────────
const DOODLE_SHAPES = [
  // cross
  <svg key="cross" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{imageRendering:"pixelated"}}>
    <rect x="6" y="0" width="4" height="4" fill="rgba(120,180,255,0.38)"/>
    <rect x="0" y="6" width="4" height="4" fill="rgba(120,180,255,0.38)"/>
    <rect x="6" y="6" width="4" height="4" fill="rgba(120,180,255,0.58)"/>
    <rect x="12" y="6" width="4" height="4" fill="rgba(120,180,255,0.38)"/>
    <rect x="6" y="12" width="4" height="4" fill="rgba(120,180,255,0.38)"/>
  </svg>,
  // diamond
  <svg key="diamond" width="18" height="18" viewBox="0 0 18 18" fill="none" style={{imageRendering:"pixelated"}}>
    <rect x="7" y="1" width="4" height="4" fill="rgba(160,200,255,0.32)"/>
    <rect x="3" y="5" width="4" height="4" fill="rgba(160,200,255,0.32)"/>
    <rect x="11" y="5" width="4" height="4" fill="rgba(160,200,255,0.32)"/>
    <rect x="7" y="5" width="4" height="4" fill="rgba(160,200,255,0.48)"/>
    <rect x="3" y="9" width="4" height="4" fill="rgba(160,200,255,0.32)"/>
    <rect x="11" y="9" width="4" height="4" fill="rgba(160,200,255,0.32)"/>
    <rect x="7" y="9" width="4" height="4" fill="rgba(160,200,255,0.48)"/>
    <rect x="7" y="13" width="4" height="4" fill="rgba(160,200,255,0.32)"/>
  </svg>,
  // sparkle
  <svg key="sparkle" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{imageRendering:"pixelated"}}>
    <rect x="8" y="0" width="4" height="7" fill="rgba(255,220,160,0.42)"/>
    <rect x="8" y="13" width="4" height="7" fill="rgba(255,220,160,0.42)"/>
    <rect x="0" y="8" width="7" height="4" fill="rgba(255,220,160,0.42)"/>
    <rect x="13" y="8" width="7" height="4" fill="rgba(255,220,160,0.42)"/>
    <rect x="8" y="8" width="4" height="4" fill="rgba(255,235,180,0.75)"/>
  </svg>,
  // leaf (tisa-inspired)
  <svg key="leaf" width="14" height="18" viewBox="0 0 14 18" fill="none" style={{imageRendering:"pixelated"}}>
    <rect x="4" y="0" width="6" height="4" fill="rgba(110,175,110,0.38)"/>
    <rect x="2" y="4" width="10" height="4" fill="rgba(110,175,110,0.44)"/>
    <rect x="0" y="8" width="14" height="4" fill="rgba(110,175,110,0.50)"/>
    <rect x="2" y="12" width="10" height="4" fill="rgba(110,175,110,0.38)"/>
    <rect x="6" y="15" width="2" height="3" fill="rgba(110,175,110,0.28)"/>
  </svg>,
  // pixel heart
  <svg key="heart" width="18" height="16" viewBox="0 0 18 16" fill="none" style={{imageRendering:"pixelated"}}>
    <rect x="2" y="0" width="4" height="4" fill="rgba(200,150,255,0.35)"/>
    <rect x="12" y="0" width="4" height="4" fill="rgba(200,150,255,0.35)"/>
    <rect x="0" y="4" width="4" height="4" fill="rgba(200,150,255,0.35)"/>
    <rect x="6" y="4" width="6" height="4" fill="rgba(200,150,255,0.35)"/>
    <rect x="14" y="4" width="4" height="4" fill="rgba(200,150,255,0.35)"/>
    <rect x="2" y="8" width="14" height="4" fill="rgba(200,150,255,0.42)"/>
    <rect x="6" y="12" width="6" height="3" fill="rgba(200,150,255,0.32)"/>
  </svg>,
  // dot ring
  <svg key="ring" width="12" height="12" viewBox="0 0 12 12" fill="none" style={{imageRendering:"pixelated"}}>
    <rect x="4" y="0" width="4" height="2" fill="rgba(120,210,190,0.42)"/>
    <rect x="0" y="4" width="2" height="4" fill="rgba(120,210,190,0.42)"/>
    <rect x="10" y="4" width="2" height="4" fill="rgba(120,210,190,0.42)"/>
    <rect x="4" y="10" width="4" height="2" fill="rgba(120,210,190,0.42)"/>
    <rect x="4" y="4" width="4" height="4" fill="rgba(120,210,190,0.28)"/>
  </svg>,
  // pixel star 2
  <svg key="star2" width="16" height="16" viewBox="0 0 16 16" fill="none" style={{imageRendering:"pixelated"}}>
    <rect x="6" y="0" width="4" height="4" fill="rgba(140,195,255,0.45)"/>
    <rect x="0" y="6" width="4" height="4" fill="rgba(140,195,255,0.45)"/>
    <rect x="12" y="6" width="4" height="4" fill="rgba(140,195,255,0.45)"/>
    <rect x="6" y="12" width="4" height="4" fill="rgba(140,195,255,0.45)"/>
    <rect x="2" y="2" width="4" height="4" fill="rgba(140,195,255,0.22)"/>
    <rect x="10" y="2" width="4" height="4" fill="rgba(140,195,255,0.22)"/>
    <rect x="2" y="10" width="4" height="4" fill="rgba(140,195,255,0.22)"/>
    <rect x="10" y="10" width="4" height="4" fill="rgba(140,195,255,0.22)"/>
    <rect x="6" y="6" width="4" height="4" fill="rgba(190,225,255,0.65)"/>
  </svg>,
];

const DOODLE_POSITIONS = [
  { x: "7%",  y: "13%", delay: 0,    dur: 9  },
  { x: "87%", y: "20%", delay: 1.3,  dur: 11 },
  { x: "4%",  y: "68%", delay: 2.6,  dur: 8.5},
  { x: "91%", y: "63%", delay: 0.7,  dur: 10 },
  { x: "48%", y: "7%",  delay: 1.9,  dur: 7.5},
  { x: "19%", y: "87%", delay: 3.1,  dur: 12 },
  { x: "77%", y: "84%", delay: 0.3,  dur: 9  },
];

function FloatingDoodles({ visible }) {
  return (
    <AnimatePresence>
      {visible && DOODLE_POSITIONS.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0, y: 0 }}
          animate={{ opacity: [0, 0.8, 0.8, 0], scale: [0.4, 1, 1, 0.4], y: [0, -10, -22, -38] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, repeatDelay: 3 + Math.random() * 3, ease: "easeInOut" }}
          style={{ position: "fixed", left: d.x, top: d.y, zIndex: 2, pointerEvents: "none" }}
        >
          {DOODLE_SHAPES[i % DOODLE_SHAPES.length]}
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// ─── TISA LOGO (pixel recreation of the green dual-leaf mark) ───────
function TisaLogo({ size = 52 }) {
  const s = size / 100;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ imageRendering: "pixelated" }}>
      {/* outer ring segments */}
      {[
        [30,4,40,8],[14,12,16,8],[70,12,16,8],[6,20,8,16],[86,20,8,16],
        [4,36,8,28],[88,36,8,28],[6,64,8,16],[86,64,8,16],
        [14,80,16,8],[70,80,16,8],[30,88,40,8],
      ].map(([x,y,w,h],i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(95,155,85,0.88)" />
      ))}
      {/* top leaf – lighter */}
      <rect x="34" y="26" width="32" height="8" fill="rgba(158,210,145,0.72)"/>
      <rect x="26" y="34" width="12" height="8" fill="rgba(158,210,145,0.65)"/>
      <rect x="62" y="34" width="12" height="8" fill="rgba(158,210,145,0.65)"/>
      <rect x="22" y="26" width="12" height="8" fill="rgba(135,195,122,0.52)"/>
      <rect x="66" y="26" width="12" height="8" fill="rgba(135,195,122,0.52)"/>
      {/* bottom leaf – darker */}
      <rect x="26" y="50" width="48" height="8" fill="rgba(95,148,85,0.82)"/>
      <rect x="18" y="42" width="16" height="8" fill="rgba(95,148,85,0.82)"/>
      <rect x="66" y="42" width="16" height="8" fill="rgba(95,148,85,0.82)"/>
      <rect x="34" y="58" width="32" height="8" fill="rgba(95,148,85,0.72)"/>
    </svg>
  );
}

// ─── HEALING ORB ────────────────────────────────────────────────────
function HealingOrb({ thought, phase, shrinking }) {
  return (
    <motion.div
      style={{ position: "relative", width: 280, height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}
      animate={shrinking
        ? { scale: [1, 0.88, 0.03], y: [0, -18, -150], opacity: [1, 1, 0] }
        : { y: [0, -8, 0] }
      }
      transition={shrinking
        ? { duration: 57, ease: "linear", times: [0, 0.12, 1] }
        : { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
      }
    >
      {/* halo rings */}
      <motion.div
        style={{ position: "absolute", inset: -22, borderRadius: "50%", background: "radial-gradient(circle, rgba(100,170,255,0.07) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.09, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ position: "absolute", inset: -8, borderRadius: "50%", border: "1px solid rgba(100,170,255,0.10)" }}
        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(100,170,255,0.18)" }}
        animate={{ scale: [1, 1.03, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />

      {/* main sphere */}
      <motion.div
        style={{
          position: "absolute", inset: 0, borderRadius: "50%",
          background: "radial-gradient(circle at 36% 31%, #ffffff 0%, #f0f7ff 12%, #ddefff 24%, #a8d5ff 42%, #6babff 58%, #3d78d4 73%, #1a4ca0 86%, #000e3c 100%)",
        }}
        animate={{
          boxShadow: [
            "0 0 0 2px rgba(100,160,255,0.22), 0 0 28px rgba(140,195,255,0.52), 0 0 60px rgba(100,160,255,0.32), 0 0 105px rgba(80,140,255,0.15)",
            "0 0 0 2px rgba(120,180,255,0.36), 0 0 42px rgba(165,218,255,0.70), 0 0 85px rgba(120,180,255,0.46), 0 0 140px rgba(100,165,255,0.23)",
            "0 0 0 2px rgba(100,160,255,0.22), 0 0 28px rgba(140,195,255,0.52), 0 0 60px rgba(100,160,255,0.32), 0 0 105px rgba(80,140,255,0.15)",
          ],
        }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* specular */}
        <div style={{ position: "absolute", top: "11%", left: "15%", width: "28%", height: "20%", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,255,255,0.52) 0%, transparent 70%)", transform: "rotate(-18deg)" }} />

        {/* logo inside orb (idle) */}
        <AnimatePresence>
          {phase === "idle" && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: [0.4, 0.68, 0.4] }} exit={{ opacity: 0 }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}
            >
              <TisaLogo size={60} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* thought text inside orb */}
        <AnimatePresence>
          {thought && phase !== "idle" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3, padding: "28px", textAlign: "center" }}
            >
              <span style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "12px", fontWeight: 600, color: "#001040", lineHeight: 1.35, wordBreak: "break-word", maxWidth: "175px" }}>
                {thought}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

// ─── AMBIENT AUDIO ──────────────────────────────────────────────────
function useAmbientAudio() {
  const audioCtxRef  = useRef(null);
  const oscRef       = useRef([]);

  const start = useCallback(() => {
    try {
      const ctx    = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.32, ctx.currentTime + 5);
      master.connect(ctx.destination);

      // simple reverb impulse
      const conv  = ctx.createConvolver();
      const rLen  = ctx.sampleRate * 4;
      const rBuf  = ctx.createBuffer(2, rLen, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = rBuf.getChannelData(c);
        for (let i = 0; i < rLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rLen, 2.4);
      }
      conv.buffer = rBuf;
      const rGain = ctx.createGain();
      rGain.gain.value = 0.3;
      conv.connect(rGain);
      rGain.connect(master);

      [[55,0,0.052],[110,0,0.036],[110,5,0.028],[165,0,0.020],[220,-3,0.014]].forEach(([freq,det,gain]) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine"; o.frequency.value = freq; o.detune.value = det; g.gain.value = gain;
        o.connect(g); g.connect(master); g.connect(conv);
        o.start(); oscRef.current.push(o);
      });

      // bell tones
      const bell = (delay) => setTimeout(() => {
        if (!audioCtxRef.current) return;
        const freqs = [396, 432, 440, 528, 369];
        const o = ctx.createOscillator();
        const e = ctx.createGain();
        o.frequency.value = freqs[Math.floor(Math.random() * freqs.length)];
        o.type = "sine";
        e.gain.setValueAtTime(0, ctx.currentTime);
        e.gain.linearRampToValueAtTime(0.052, ctx.currentTime + 0.06);
        e.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 4.5);
        o.connect(e); e.connect(master); e.connect(conv);
        o.start(); o.stop(ctx.currentTime + 5);
        bell(6000 + Math.random() * 9000);
      }, delay);
      bell(3000);
    } catch (e) { /* audio unavailable */ }
  }, []);

  const stop = useCallback(() => {
    oscRef.current.forEach(o => { try { o.stop(); } catch(_) {} });
    oscRef.current = [];
    if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null; }
  }, []);

  return { start, stop };
}

// ─── MAIN APP ───────────────────────────────────────────────────────
export default function App() {
  const [phase,      setPhase]      = useState("idle");   // idle | healing | done
  const [thought,    setThought]    = useState("");
  const [input,      setInput]      = useState("");
  const [msgIndex,   setMsgIndex]   = useState(-1);
  const [msgVisible, setMsgVisible] = useState(false);
  const [paused,     setPaused]     = useState(false);
  const [progress,   setProgress]   = useState(1);

  const timersRef   = useRef([]);
  const msgTimerRef = useRef(null);
  const audio       = useAmbientAudio();
  const audioStarted = useRef(false);

  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
  }, []);

  const showMsg = useCallback((idx) => {
    if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
    setMsgVisible(false);
    msgTimerRef.current = setTimeout(() => { setMsgIndex(idx); setMsgVisible(true); }, 420);
  }, []);

  const startHeal = useCallback(() => {
    const val = input.trim();
    if (!val) return;

    if (!audioStarted.current) { audio.start(); audioStarted.current = true; }

    setThought(val);
    setPhase("healing");
    setProgress(1);

    const TOTAL        = 60000;
    const MSG_START    = 5200;
    const MSG_INTERVAL = Math.floor((TOTAL - MSG_START - 2500) / MESSAGES.length);

    MESSAGES.forEach((_, i) => {
      timersRef.current.push(setTimeout(() => showMsg(i), MSG_START + i * MSG_INTERVAL));
    });

    // progress tick
    const startTime = Date.now();
    const tick = () => {
      const p = Math.max(0, 1 - (Date.now() - startTime) / TOTAL);
      setProgress(p);
      if (p > 0) timersRef.current.push(setTimeout(tick, 120));
    };
    timersRef.current.push(setTimeout(tick, 120));

    // completion
    timersRef.current.push(setTimeout(() => {
      setMsgVisible(false);
      setTimeout(() => { audio.stop(); audioStarted.current = false; setPhase("done"); }, 1300);
    }, TOTAL));
  }, [input, showMsg, audio]);

  const reset = useCallback(() => {
    clearAll();
    audio.stop(); audioStarted.current = false;
    setPhase("idle"); setThought(""); setInput("");
    setMsgIndex(-1); setMsgVisible(false); setPaused(false); setProgress(1);
  }, [clearAll, audio]);

  useEffect(() => () => { clearAll(); audio.stop(); }, [clearAll, audio]);

  // try to kick off audio on first user interaction
  const handleFirstInteraction = useCallback(() => {
    if (!audioStarted.current && phase === "idle") {
      // only truly start on begin, not random click
    }
  }, [phase]);

  return (
    <div
      onClick={() => { handleFirstInteraction(); if (phase === "healing") setPaused(p => !p); }}
      style={{
        position: "fixed", inset: 0,
        background: "radial-gradient(ellipse 180% 110% at 50% 82%, #111830 0%, #080d1c 38%, #000000 100%)",
        overflow: "hidden",
        fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif",
        userSelect: "none",
      }}
    >
      {/* noise grain */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.022,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }} />

      <StarField />
      <FloatingDoodles visible={phase === "idle"} />

      {/* ══ PHASE 1: IDLE / ONBOARDING ══════════════════════════════ */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.97 }}
            transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px" }}
          >
            {/* wordmark + logo */}
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}
            >
              <motion.div animate={{ scale: [1, 1.07, 1] }} transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}>
                <TisaLogo size={42} />
              </motion.div>
              <motion.span
                style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(20px, 5vw, 36px)", color: "#fff", letterSpacing: "3px" }}
                animate={{
                  textShadow: [
                    "0 0 12px rgba(100,180,255,0.55), 0 0 25px rgba(100,180,255,0.28), 2px 2px 0 rgba(100,180,255,0.22)",
                    "0 0 20px rgba(125,205,255,0.78), 0 0 40px rgba(100,180,255,0.48), 2px 2px 0 rgba(125,205,255,0.38)",
                    "0 0 12px rgba(100,180,255,0.55), 0 0 25px rgba(100,180,255,0.28), 2px 2px 0 rgba(100,180,255,0.22)",
                  ],
                }}
                transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut" }}
              >
                tisa heal
              </motion.span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.9 }}
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "clamp(11px, 1.8vw, 14px)", color: "rgba(255,255,255,0.28)", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "52px" }}
            >
              60 seconds of calm
            </motion.p>

            {/* orb preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 1.1, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ marginBottom: "50px" }}
            >
              <HealingOrb thought="" phase="idle" shrinking={false} />
            </motion.div>

            {/* input area */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", width: "100%", maxWidth: "430px" }}
            >
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "rgba(255,255,255,0.2)", letterSpacing: "1.8px", textTransform: "uppercase" }}>
                put a stressful thought in the star
              </p>

              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && input.trim() && startHeal()}
                placeholder="what's weighing on you?…"
                maxLength={55}
                autoComplete="off"
                autoFocus
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.042)",
                  border: "1.5px solid rgba(100,180,255,0.15)",
                  borderRadius: "2px",
                  padding: "13px 22px",
                  fontFamily: "'DM Sans', system-ui, sans-serif",
                  fontSize: "14px",
                  letterSpacing: "0.4px",
                  color: "#fff",
                  outline: "none",
                  textAlign: "center",
                  transition: "border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease",
                }}
                onFocus={e => {
                  e.target.style.borderColor = "rgba(100,180,255,0.6)";
                  e.target.style.background  = "rgba(100,180,255,0.07)";
                  e.target.style.boxShadow   = "0 0 18px rgba(100,180,255,0.20)";
                }}
                onBlur={e => {
                  e.target.style.borderColor = "rgba(100,180,255,0.15)";
                  e.target.style.background  = "rgba(255,255,255,0.042)";
                  e.target.style.boxShadow   = "none";
                }}
              />

              <motion.button
                onClick={startHeal}
                disabled={!input.trim()}
                whileHover={input.trim() ? { scale: 1.035, y: -2, boxShadow: "3px 3px 0 rgba(100,180,255,0.42), 0 0 22px rgba(100,180,255,0.22)" } : {}}
                whileTap={input.trim()   ? { scale: 0.965, y: 0, boxShadow: "1px 1px 0 rgba(100,180,255,0.18)" } : {}}
                transition={{ type: "spring", stiffness: 380, damping: 20 }}
                style={{
                  background: "rgba(100,180,255,0.08)",
                  border: "1.5px solid rgba(100,180,255,0.24)",
                  borderRadius: "0",
                  padding: "11px 46px",
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "9px",
                  letterSpacing: "2.4px",
                  textTransform: "uppercase",
                  color: input.trim() ? "rgba(255,255,255,0.78)" : "rgba(255,255,255,0.22)",
                  cursor: input.trim() ? "pointer" : "default",
                  boxShadow: "2px 2px 0 rgba(100,180,255,0.16)",
                  transition: "color 0.3s ease",
                }}
              >
                Begin
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ PHASE 2: HEALING ═════════════════════════════════════════ */}
      <AnimatePresence>
        {phase === "healing" && (
          <motion.div
            key="healing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6 }}
            style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
          >
            {/* guided text */}
            <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", width: "90%", maxWidth: "580px", textAlign: "center", pointerEvents: "none", zIndex: 20 }}>
              <AnimatePresence mode="wait">
                {msgVisible && msgIndex >= 0 && (
                  <motion.div
                    key={msgIndex}
                    initial={{ opacity: 0, y: 14, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.p
                      style={{ fontFamily: "'DM Sans', 'Nunito', system-ui, sans-serif", fontSize: "clamp(18px, 3.8vw, 30px)", fontWeight: 300, color: "rgba(195,218,238,0.92)", letterSpacing: "0.4px", lineHeight: 1.45, marginBottom: "9px", textShadow: "0 2px 22px rgba(0,0,0,0.55)" }}
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {MESSAGES[msgIndex].text}
                    </motion.p>
                    <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "clamp(12px, 2vw, 15px)", fontWeight: 300, color: "rgba(148,182,215,0.50)", letterSpacing: "0.8px", fontStyle: "italic" }}>
                      {MESSAGES[msgIndex].sub}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <HealingOrb thought={thought} phase="healing" shrinking={true} />

            {/* progress bar */}
            <motion.div
              style={{ position: "fixed", bottom: 0, left: 0, height: "3px", width: "100%", transformOrigin: "left", scaleX: progress, background: "linear-gradient(90deg, rgba(100,180,255,0.72), rgba(168,225,255,0.88))", zIndex: 30, boxShadow: "0 -1px 12px rgba(100,180,255,0.42)" }}
            />

            {/* pause hint */}
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 4 }}
              style={{ position: "fixed", bottom: "16px", fontFamily: "'Press Start 2P', monospace", fontSize: "6px", color: "rgba(255,255,255,0.1)", letterSpacing: "1.5px", pointerEvents: "none", zIndex: 20 }}
            >
              tap anywhere to pause
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ PAUSE OVERLAY ════════════════════════════════════════════ */}
      <AnimatePresence>
        {paused && (
          <motion.div
            key="paused"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.44)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(3px)" }}
          >
            <motion.div
              initial={{ scale: 0.82, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.82, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{ textAlign: "center" }}
            >
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(16px, 4vw, 26px)", color: "rgba(255,255,255,0.48)", letterSpacing: "6px", textShadow: "0 0 22px rgba(100,180,255,0.38)" }}>
                paused
              </p>
              <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.2)", marginTop: "12px", letterSpacing: "2px" }}>
                tap to continue
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ PHASE 3: COMPLETION ══════════════════════════════════════ */}
      <AnimatePresence>
        {phase === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 1.6 }}
            onClick={e => e.stopPropagation()}
            style={{ position: "absolute", inset: 0, zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center", overflowY: "auto" }}
          >
            {/* pixel confetti burst */}
            {[...Array(10)].map((_, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 0, x: 0, scale: 0 }}
                animate={{ opacity: [0, 0.75, 0], y: -90 - Math.random()*70, x: (Math.random()-0.5)*220, scale: [0,1.2,0.4], rotate: Math.random()*400 }}
                transition={{ delay: i * 0.1, duration: 2.8, ease: "easeOut" }}
                style={{ position: "fixed", top: "50%", left: "50%", width: "7px", height: "7px", background: ["rgba(100,180,255,0.9)","rgba(145,210,255,0.9)","rgba(190,155,255,0.9)","rgba(120,210,165,0.9)","rgba(255,225,140,0.9)"][i%5], pointerEvents: "none", zIndex: 5, borderRadius: "1px" }}
              />
            ))}

            <motion.div initial={{ opacity: 0, scale: 0.55 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25, duration: 1, type: "spring", stiffness: 190, damping: 17 }} style={{ marginBottom: "28px" }}>
              <TisaLogo size={48} />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }}
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "clamp(13px, 2.8vw, 21px)", color: "rgba(255,255,255,0.88)", letterSpacing: "1.5px", marginBottom: "14px", textShadow: "0 0 14px rgba(100,180,255,0.44), 2px 2px 0 rgba(100,180,255,0.22)" }}
            >
              Your thought is gone.
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.68, duration: 0.9 }}
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "clamp(14px, 2.4vw, 17px)", color: "rgba(255,255,255,0.32)", maxWidth: "370px", lineHeight: 1.88, marginBottom: "14px", fontWeight: 300 }}>
              It has dissolved into the cosmos.
            </motion.p>

            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 1 }}
              style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "clamp(16px, 2.8vw, 21px)", color: "rgba(185,215,245,0.68)", fontStyle: "italic", fontWeight: 300, marginBottom: "48px", letterSpacing: "0.4px" }}>
              How do you feel?
            </motion.p>

            {/* resource cards */}
            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.9 }}
              style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", maxWidth: "472px", width: "100%", marginBottom: "44px" }}
            >
              {RESOURCES.map((r, i) => (
                <motion.a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 + i * 0.09, duration: 0.7 }}
                  whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.96 }}
                  style={{ background: r.color, border: `1px solid ${r.border}`, borderRadius: "2px", padding: "14px 16px", textDecoration: "none", textAlign: "left", display: "block" }}
                >
                  <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "7px", color: "rgba(255,255,255,0.72)", letterSpacing: "0.8px", marginBottom: "6px" }}>{r.name}</p>
                  <p style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.28)", lineHeight: 1.45 }}>{r.desc}</p>
                </motion.a>
              ))}
            </motion.div>

            <motion.button onClick={reset}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.55 }}
              whileHover={{ scale: 1.04, y: -2, boxShadow: "2px 2px 0 rgba(100,180,255,0.38), 0 0 18px rgba(100,180,255,0.18)" }}
              whileTap={{ scale: 0.96, y: 0 }}
              style={{ background: "rgba(100,180,255,0.07)", border: "1.5px solid rgba(100,180,255,0.22)", borderRadius: "0", padding: "11px 40px", fontFamily: "'Press Start 2P', monospace", fontSize: "8px", letterSpacing: "2.2px", textTransform: "uppercase", color: "rgba(255,255,255,0.48)", cursor: "pointer", boxShadow: "2px 2px 0 rgba(100,180,255,0.12)" }}
            >
              heal again
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* footer */}
      <AnimatePresence>
        {phase !== "healing" && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", bottom: "14px", left: 0, right: 0, textAlign: "center", zIndex: 40, fontFamily: "'Press Start 2P', monospace", fontSize: "6px", color: "rgba(255,255,255,0.09)", letterSpacing: "1px", pointerEvents: "none" }}
          >
            made with ♥ by sachin · tisa heal
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
