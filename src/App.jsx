// tisa heal — a 60-second anxiety relief tool
// inspired by pixelthoughts.co | built by sachin

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MUSIC_SRC, MUSIC_VOLUME, MUSIC_FADE_DURATION } from "./music.config.js";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DURATION = 60; // seconds

// ─── 10 distinct message sets ────────────────────────────────────────────────
// Each set has its own emotional tone so returning users always feel something new.
// Timestamps: 4 · 10 · 16 · 22 · 28 · 34 · 40 · 46 · 52 · 57
const MESSAGE_SETS = [

  // 0 — The Cosmos  (scale of the universe)
  [
    { at: 4,  text: "Take a slow breath in.",                    sub: "let your shoulders drop" },
    { at: 10, text: "The universe is 13.8 billion years old.",   sub: "your worry is a single heartbeat in all of time" },
    { at: 16, text: "Right now, 200 billion stars are shining.", sub: "you are made of the same stuff" },
    { at: 22, text: "Look how small it's becoming.",             sub: "thoughts are not facts" },
    { at: 28, text: "Somewhere a new star is being born.",       sub: "everything is always changing" },
    { at: 34, text: "Let it drift into the cosmos.",             sub: "space is patient and infinite" },
    { at: 40, text: "You are exactly the right size.",           sub: "small enough to rest, large enough to matter" },
    { at: 46, text: "Almost gone now.",                          sub: "watch it dissolve" },
    { at: 52, text: "The stars don't worry.",                    sub: "they just shine" },
    { at: 57, text: "It's gone.",                                sub: "how do you feel?" },
  ],

  // 1 — The Breath  (box breathing, grounded)
  [
    { at: 4,  text: "Breathe in… one… two… three… four…",       sub: "fill your lungs completely" },
    { at: 10, text: "Hold… one… two…",                           sub: "be still for just a moment" },
    { at: 16, text: "Breathe out… slowly… all the way…",        sub: "let your body soften" },
    { at: 22, text: "Your nervous system is calming.",           sub: "this is science, not magic" },
    { at: 28, text: "One more deep breath.",                     sub: "in through the nose" },
    { at: 34, text: "And out through the mouth.",                sub: "long and slow" },
    { at: 40, text: "Notice the silence between breaths.",       sub: "you live there" },
    { at: 46, text: "It's shrinking with every exhale.",         sub: "you're doing it" },
    { at: 52, text: "One last breath together.",                  sub: "in… and out…" },
    { at: 57, text: "There it goes.",                            sub: "breathe normally now" },
  ],

  // 2 — Self-compassion  (warm, like a friend)
  [
    { at: 4,  text: "Hey. I see you.",                           sub: "you're doing a hard thing right now" },
    { at: 10, text: "You don't have to have it all figured out.", sub: "nobody does" },
    { at: 16, text: "You have survived every difficult day so far.", sub: "that's a perfect record" },
    { at: 22, text: "What would you say to a friend feeling this?", sub: "say that to yourself" },
    { at: 28, text: "You are allowed to be a work in progress.", sub: "we all are" },
    { at: 34, text: "Your feelings are valid.",                  sub: "and they are not permanent" },
    { at: 40, text: "Be as kind to yourself as you are to others.", sub: "you deserve that too" },
    { at: 46, text: "Watch it go.",                              sub: "you don't have to carry this anymore" },
    { at: 52, text: "Almost free.",                              sub: "just a little longer" },
    { at: 57, text: "It's done.",                                sub: "you are enough" },
  ],

  // 3 — The Nature  (grounding in the natural world)
  [
    { at: 4,  text: "Feel your feet on the ground.",             sub: "the earth is holding you" },
    { at: 10, text: "Somewhere right now, it's raining.",        sub: "rivers are filling, flowers drinking" },
    { at: 16, text: "Trees grow slowly, without worry.",         sub: "they trust the seasons" },
    { at: 22, text: "The ocean breathes in and out.",            sub: "tides don't panic" },
    { at: 28, text: "A seed doesn't rush to become a tree.",     sub: "neither do you" },
    { at: 34, text: "Mountains took millions of years to form.", sub: "your problems have a timeline too" },
    { at: 40, text: "Somewhere the sun is setting right now.",   sub: "and somewhere it's rising" },
    { at: 46, text: "Nature doesn't force anything.",            sub: "it allows" },
    { at: 52, text: "Let it go like leaves on a river.",         sub: "watch it float away" },
    { at: 57, text: "Gone.",                                     sub: "you're still here. still breathing." },
  ],

  // 4 — The Philosopher  (gentle wisdom)
  [
    { at: 4,  text: "This moment will pass.",                    sub: "they all do" },
    { at: 10, text: "You are not your thoughts.",                sub: "you are the one noticing them" },
    { at: 16, text: "Pain is asking for attention.",             sub: "you've given it some. that's enough." },
    { at: 22, text: "Everything is impermanent.",                sub: "even this" },
    { at: 28, text: "What you resist, persists.",                sub: "what you release, dissolves" },
    { at: 34, text: "The present moment is the only real one.",  sub: "and right now, you are okay" },
    { at: 40, text: "Worry is interest paid on a debt not yet owed.", sub: "put down the bill" },
    { at: 46, text: "You've already done the hard part.",        sub: "you're still showing up" },
    { at: 52, text: "Watch it shrink into nothing.",             sub: "almost there" },
    { at: 57, text: "It's gone.",                                sub: "how does that feel?" },
  ],

  // 5 — The Night Sky  (poetic, dreamy)
  [
    { at: 4,  text: "Look up.",                                  sub: "even in your mind" },
    { at: 10, text: "The stars you see tonight are ancient.",    sub: "some are already gone, still shining" },
    { at: 16, text: "Light travels for millions of years.",      sub: "just to reach your eyes" },
    { at: 22, text: "You are a brief, beautiful moment.",        sub: "in an infinite story" },
    { at: 28, text: "The moon doesn't apologise for its phases.", sub: "neither should you" },
    { at: 34, text: "Even black holes eventually release light.", sub: "nothing holds on forever" },
    { at: 40, text: "Your worry is so, so small.",               sub: "from space, it is invisible" },
    { at: 46, text: "Let the night hold it for you.",            sub: "the dark is not dangerous" },
    { at: 52, text: "It's becoming stardust.",                   sub: "watch it scatter" },
    { at: 57, text: "Gone into the stars.",                      sub: "rest now" },
  ],

  // 6 — The Gentle Reframe  (cognitive, soft)
  [
    { at: 4,  text: "Notice the thought without becoming it.",   sub: "you are the observer" },
    { at: 10, text: "Is this definitely true?",                  sub: "or does it just feel true right now?" },
    { at: 16, text: "What's one thing that is okay right now?",  sub: "just one" },
    { at: 22, text: "You've felt this before and survived.",     sub: "every single time" },
    { at: 28, text: "Your brain is trying to protect you.",      sub: "thank it, then let it rest" },
    { at: 34, text: "What would future-you say about this?",     sub: "they made it through" },
    { at: 40, text: "This feeling is not a life sentence.",      sub: "feelings are weather, not climate" },
    { at: 46, text: "Let the thought shrink.",                   sub: "give it less oxygen" },
    { at: 52, text: "Nearly gone.",                              sub: "you did that" },
    { at: 57, text: "It's done.",                                sub: "well done" },
  ],

  // 7 — The Body Scan  (somatic, physical grounding)
  [
    { at: 4,  text: "Place one hand on your chest.",             sub: "feel your heartbeat" },
    { at: 10, text: "Unclench your jaw.",                        sub: "soften your forehead" },
    { at: 16, text: "Drop your shoulders away from your ears.",  sub: "there you go" },
    { at: 22, text: "Feel the weight of your body.",             sub: "you are held" },
    { at: 28, text: "Your body knows how to breathe.",           sub: "you don't have to control it" },
    { at: 34, text: "Wiggle your fingers and toes.",             sub: "feel yourself arriving back" },
    { at: 40, text: "Your body is working hard for you.",        sub: "quietly. constantly. lovingly." },
    { at: 46, text: "Relax your hands.",                         sub: "open your palms" },
    { at: 52, text: "It's almost gone.",                         sub: "your body is releasing it" },
    { at: 57, text: "Gone.",                                     sub: "notice how you feel in your body" },
  ],

  // 8 — The Ocean  (wave metaphor, rhythmic)
  [
    { at: 4,  text: "Imagine you're sitting by the ocean.",      sub: "hear the waves" },
    { at: 10, text: "Each wave comes in…",                       sub: "and goes back out" },
    { at: 16, text: "Your thoughts are like waves.",             sub: "they arise and pass" },
    { at: 22, text: "You don't have to stop the ocean.",         sub: "just watch from the shore" },
    { at: 28, text: "The water doesn't hold onto anything.",     sub: "it just keeps moving" },
    { at: 34, text: "This wave is getting smaller.",             sub: "feel the pull back" },
    { at: 40, text: "Salt air, cool breeze, open sky.",          sub: "you are here" },
    { at: 46, text: "The tide always goes out.",                 sub: "always" },
    { at: 52, text: "Watch it wash away.",                       sub: "into the deep" },
    { at: 57, text: "The shore is quiet now.",                   sub: "so are you" },
  ],

  // 9 — The Hopeful  (forward-looking, warm ending)
  [
    { at: 4,  text: "You reached out for help today.",           sub: "that takes courage" },
    { at: 10, text: "Healing isn't linear.",                     sub: "but it is happening" },
    { at: 16, text: "Every hard thing you've faced has passed.", sub: "this will too" },
    { at: 22, text: "You are not behind.",                       sub: "you are exactly where you need to be" },
    { at: 28, text: "Something good is still possible today.",   sub: "even today" },
    { at: 34, text: "The people who love you are still there.",  sub: "you are not alone" },
    { at: 40, text: "You have more strength than you know.",     sub: "you've already proven it" },
    { at: 46, text: "Tomorrow is a blank page.",                 sub: "you get to write it" },
    { at: 52, text: "Let this one go.",                          sub: "you don't need to carry it into tomorrow" },
    { at: 57, text: "It's gone.",                                sub: "you did that. be proud." },
  ],
];

// Pick a different set every session — truly random, never the same twice in a row
const getMessageSet = () => {
  try {
    const lastIdx = parseInt(sessionStorage.getItem("th_last_set") ?? "-1", 10);
    let idx;
    do { idx = Math.floor(Math.random() * MESSAGE_SETS.length); }
    while (idx === lastIdx && MESSAGE_SETS.length > 1);
    sessionStorage.setItem("th_last_set", String(idx));
    return MESSAGE_SETS[idx];
  } catch {
    return MESSAGE_SETS[0];
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PIXEL STAR FIELD
// ─────────────────────────────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef(null);
  const starsRef  = useRef([]);
  const rafRef    = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    // Seed static stars (pixel-square style)
    starsRef.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() < 0.3 ? 2 : 1,      // pixel squares
      phase: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.015,
      baseOp: 0.1 + Math.random() * 0.5,
    }));

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      starsRef.current.forEach(s => {
        s.phase += s.speed;
        const op = s.baseOp * (0.5 + 0.5 * Math.sin(s.phase));
        ctx.fillStyle = `rgba(220,230,255,${op})`;
        ctx.fillRect(s.x, s.y, s.size, s.size); // pixel squares, not circles
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"fixed", inset:0, width:"100%", height:"100%", zIndex:0, pointerEvents:"none" }} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// PIXEL DOODLES (inline SVG, no external images)
// ─────────────────────────────────────────────────────────────────────────────

// Pixel cloud doodle
function PixelCloud({ style }) {
  return (
    <svg width="48" height="28" viewBox="0 0 48 28" style={{ imageRendering:"pixelated", ...style }}>
      <rect x="12" y="16" width="24" height="8"  fill="rgba(180,200,220,0.18)"/>
      <rect x="8"  y="12" width="32" height="8"  fill="rgba(180,200,220,0.22)"/>
      <rect x="16" y="8"  width="16" height="8"  fill="rgba(180,200,220,0.22)"/>
      <rect x="20" y="4"  width="8"  height="8"  fill="rgba(180,200,220,0.18)"/>
    </svg>
  );
}

// Pixel sparkle / star doodle
function PixelSparkle({ style, color = "rgba(255,220,140,0.55)" }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering:"pixelated", ...style }}>
      <rect x="7" y="0" width="2" height="6"  fill={color}/>
      <rect x="7" y="10" width="2" height="6" fill={color}/>
      <rect x="0" y="7" width="6" height="2"  fill={color}/>
      <rect x="10" y="7" width="6" height="2" fill={color}/>
      <rect x="6" y="6" width="4" height="4"  fill={color}/>
    </svg>
  );
}

// Pixel heart
function PixelHeart({ style }) {
  return (
    <svg width="14" height="12" viewBox="0 0 14 12" style={{ imageRendering:"pixelated", ...style }}>
      <rect x="2"  y="0" width="4" height="2" fill="rgba(220,120,120,0.6)"/>
      <rect x="8"  y="0" width="4" height="2" fill="rgba(220,120,120,0.6)"/>
      <rect x="0"  y="2" width="6" height="4" fill="rgba(220,120,120,0.6)"/>
      <rect x="8"  y="2" width="6" height="4" fill="rgba(220,120,120,0.6)"/>
      <rect x="2"  y="6" width="10" height="2" fill="rgba(220,120,120,0.6)"/>
      <rect x="4"  y="8" width="6"  height="2" fill="rgba(220,120,120,0.6)"/>
      <rect x="6"  y="10" width="2" height="2" fill="rgba(220,120,120,0.6)"/>
    </svg>
  );
}

// Pixel moon
function PixelMoon({ style }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" style={{ imageRendering:"pixelated", ...style }}>
      <rect x="6"  y="2"  width="8"  height="2"  fill="rgba(255,240,180,0.5)"/>
      <rect x="4"  y="4"  width="4"  height="2"  fill="rgba(255,240,180,0.5)"/>
      <rect x="2"  y="6"  width="4"  height="8"  fill="rgba(255,240,180,0.5)"/>
      <rect x="4"  y="14" width="4"  height="2"  fill="rgba(255,240,180,0.5)"/>
      <rect x="6"  y="16" width="8"  height="2"  fill="rgba(255,240,180,0.5)"/>
      <rect x="14" y="4"  width="2"  height="12" fill="rgba(255,240,180,0.35)"/>
      <rect x="12" y="2"  width="2"  height="16" fill="rgba(255,240,180,0.35)"/>
    </svg>
  );
}

// TISA logo — pixel recreation, embedded as SVG mask (from actual logo)
function TisaPixelLogo({ size = 52, opacity = 0.9 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ imageRendering:"pixelated", opacity }}>
      {/* outer ring – green, pixelated */}
      {[
        [30,4,40,8],[14,12,16,8],[70,12,16,8],[6,20,8,16],[86,20,8,16],
        [4,36,8,28],[88,36,8,28],[6,64,8,16],[86,64,8,16],
        [14,80,16,8],[70,80,16,8],[30,88,40,8],
      ].map(([x,y,w,h],i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="rgba(100,180,90,0.92)" />
      ))}
      {/* top leaf – lighter */}
      <rect x="34" y="26" width="32" height="8" fill="rgba(160,220,145,0.82)"/>
      <rect x="26" y="34" width="12" height="8" fill="rgba(160,220,145,0.75)"/>
      <rect x="62" y="34" width="12" height="8" fill="rgba(160,220,145,0.75)"/>
      <rect x="22" y="26" width="12" height="8" fill="rgba(140,205,125,0.62)"/>
      <rect x="66" y="26" width="12" height="8" fill="rgba(140,205,125,0.62)"/>
      {/* bottom leaf – darker */}
      <rect x="26" y="50" width="48" height="8" fill="rgba(95,155,85,0.90)"/>
      <rect x="18" y="42" width="16" height="8" fill="rgba(95,155,85,0.90)"/>
      <rect x="66" y="42" width="16" height="8" fill="rgba(95,155,85,0.90)"/>
      <rect x="34" y="58" width="32" height="8" fill="rgba(78,132,70,0.80)"/>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING BACKGROUND DOODLES
// ─────────────────────────────────────────────────────────────────────────────
const BG_DOODLES = [
  { C: PixelCloud,    x:"8%",   y:"14%", delay:0,   dur:7,   scale:1    },
  { C: PixelCloud,    x:"78%",  y:"18%", delay:2,   dur:9,   scale:0.7  },
  { C: PixelSparkle,  x:"15%",  y:"72%", delay:1,   dur:5,   scale:1    },
  { C: PixelSparkle,  x:"85%",  y:"65%", delay:3,   dur:6,   scale:1.3  },
  { C: PixelSparkle,  x:"50%",  y:"8%",  delay:0.5, dur:4.5, scale:0.9  },
  { C: PixelMoon,     x:"90%",  y:"80%", delay:1.5, dur:8,   scale:1    },
  { C: PixelHeart,    x:"5%",   y:"85%", delay:2.5, dur:6,   scale:1    },
  { C: PixelSparkle,  x:"72%",  y:"88%", delay:0.8, dur:5.5, scale:0.8  },
];

function FloatingDoodles({ visible }) {
  return (
    <AnimatePresence>
      {visible && BG_DOODLES.map((d, i) => (
        <motion.div
          key={i}
          initial={{ opacity:0, y:10 }}
          animate={{ opacity:1, y:[0,-8,0] }}
          exit={{ opacity:0, transition:{ duration:0.5 } }}
          transition={{ opacity:{ duration:1 }, y:{ duration:d.dur, repeat:Infinity, ease:"easeInOut", delay:d.delay } }}
          style={{ position:"fixed", left:d.x, top:d.y, zIndex:2, pointerEvents:"none", transform:`scale(${d.scale})` }}
        >
          <d.C />
        </motion.div>
      ))}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// THE WARM ORB  (matches pixel-thoughts reference: warm orange glow)
// ─────────────────────────────────────────────────────────────────────────────
function WarmOrb({ thought, phase, progress }) {
  // progress drives scale: 1 → 0 smoothly over 60s via rAF
  const scl = phase === "healing" ? Math.max(0, progress) : 1;

  return (
    <motion.div
      animate={phase === "idle" ? { y:[0,-10,0] } : { y:0 }}
      transition={{ duration:4, repeat: phase === "idle" ? Infinity : 0, ease:"easeInOut" }}
      style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}
    >
      {/* outer glow — driven by same scl */}
      <div
        style={{
          position:"absolute",
          width: 320, height: 320,
          borderRadius:"50%",
          background:"radial-gradient(circle, rgba(230,100,30,0.38) 0%, transparent 68%)",
          transform: `scale(${scl})`,
          filter:"blur(14px)",
          transformOrigin:"center",
          opacity: scl,
        }}
      />

      {/* main orb sphere — scale driven by rAF progress */}
      <div
        style={{
          width:240, height:240,
          borderRadius:"50%",
          background:`radial-gradient(circle at 38% 32%,
            #ffffff 0%, #f5ede0 15%,
            #e8cba8 32%, #d4956a 52%,
            #b05a28 70%, #6b2e0e 86%,
            #2a0d04 100%)`,
          transform: `scale(${scl})`,
          transformOrigin:"center",
          animation: phase === "idle" ? "orbPulse 3s ease-in-out infinite" : "none",
          position:"relative",
          overflow:"hidden",
        }}
      >
        {/* specular highlight */}
        <div style={{
          position:"absolute", top:"12%", left:"14%",
          width:"30%", height:"22%", borderRadius:"50%",
          background:"radial-gradient(ellipse, rgba(255,255,255,0.55) 0%, transparent 70%)",
          transform:"rotate(-20deg)",
        }}/>

        {/* thought text */}
        <AnimatePresence>
          {thought && (
            <motion.div
              initial={{ opacity:0, scale:0.8 }}
              animate={{ opacity:1, scale:1 }}
              exit={{ opacity:0 }}
              transition={{ duration:0.8 }}
              style={{
                position:"absolute", inset:0,
                display:"flex", alignItems:"center", justifyContent:"center",
                padding:"28px", textAlign:"center",
              }}
            >
              <span style={{
                fontFamily:"'Caveat', cursive",
                fontSize:"clamp(15px,3.5vw,22px)",
                fontWeight:700,
                color:"#1a0800",
                lineHeight:1.3,
                wordBreak:"break-word",
                maxWidth:"180px",
                textShadow:"0 1px 2px rgba(255,255,255,0.4)",
              }}>
                {thought}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TISA logo in idle orb */}
        <AnimatePresence>
          {phase === "idle" && !thought && (
            <motion.div
              initial={{ opacity:0 }} animate={{ opacity:[0.3,0.6,0.3] }} exit={{ opacity:0 }}
              transition={{ duration:3, repeat:Infinity }}
              style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}
            >
              <TisaPixelLogo size={70} opacity={0.7} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Pre-seeded particle data (outside component, stable)
const PARTICLE_DATA = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * Math.PI * 2;
  const dists = [82,140,95,168,112,60,155,75,130,100,180,88,120,160,70,145,65,175,110,92,150,80,135,105,170,118,85,162,72,128,98,155];
  const sizes = [6,4,4,6,4,6,4,6,4,4,6,4,6,4,4,6,4,6,4,6,4,4,6,4,6,4,6,4,4,6,4,6];
  const delays= [0.00,0.12,0.05,0.22,0.08,0.18,0.03,0.25,0.14,0.06,0.20,0.10,0.28,0.01,0.16,0.23,0.07,0.15,0.24,0.04,0.19,0.11,0.26,0.09,0.17,0.02,0.21,0.13,0.27,0.06,0.18,0.29];
  const durs  = [1.8,2.1,1.6,2.3,1.9,1.5,2.2,1.7,2.0,1.6,2.3,1.8,1.5,2.1,1.9,1.6,2.2,1.7,2.0,1.8,1.5,2.3,1.6,2.1,1.9,1.7,2.0,1.6,2.2,1.8,1.5,2.3];
  const colors= ["#f0a060","#e07030","#ffcc80","#ff8040","#fff0c0","#c85020","#ffd080"];
  const dist  = dists[i] ?? 100;
  return {
    px: Math.cos(angle) * dist,
    py: Math.sin(angle) * dist,
    color: colors[i % colors.length],
    size: sizes[i] ?? 4,
    delay: delays[i] ?? 0.1,
    dur: durs[i] ?? 1.8,
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// PARTICLE EXPLOSION  (orb dissolves into pixels at end)
// ─────────────────────────────────────────────────────────────────────────────
function ParticleBurst({ active }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:20 }}>
          {PARTICLE_DATA.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity:1, x:0, y:0, scale:1 }}
              animate={{ opacity:0, x:p.px, y:p.py, scale:0 }}
              transition={{ duration:p.dur, delay:p.delay, ease:"easeOut" }}
              style={{
                position:"absolute",
                top:"50%", left:"50%",
                width:p.size, height:p.size,
                background:p.color,
                imageRendering:"pixelated",
                marginTop:-p.size/2,
                marginLeft:-p.size/2,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PIXEL BUTTON
// ─────────────────────────────────────────────────────────────────────────────
function PixelButton({ onClick, children, disabled, color = "warm" }) {
  const warm = color === "warm";
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale:1.05, y:-2 } : {}}
      whileTap={!disabled  ? { scale:0.95, y:0  } : {}}
      transition={{ type:"spring", stiffness:400, damping:18 }}
      style={{
        fontFamily:"'Press Start 2P', monospace",
        fontSize:"clamp(8px,1.5vw,11px)",
        letterSpacing:"1.5px",
        padding:"12px 28px",
        background: warm ? "rgba(200,90,30,0.85)" : "rgba(40,60,80,0.8)",
        border: warm ? "3px solid rgba(240,140,60,0.9)" : "3px solid rgba(100,160,200,0.6)",
        borderRadius:"0",
        color: warm ? "#fff8e8" : "rgba(180,220,255,0.8)",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.35 : 1,
        outline:"none",
        position:"relative",
        // pixel shadow offset
        boxShadow: warm
          ? "4px 4px 0 rgba(100,30,0,0.8), 0 0 20px rgba(220,100,30,0.3)"
          : "4px 4px 0 rgba(0,20,40,0.8)",
        transition:"opacity 0.3s",
        textTransform:"uppercase",
      }}
    >
      {children}
    </motion.button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// END SCREEN — pixel art credits with Instagram + hope messages
// ─────────────────────────────────────────────────────────────────────────────
const HOPE_LINES = [
  "You are still here.",
  "That is enough.",
  "One breath at a time.",
  "The sun will rise again.",
  "You are not alone.",
  "Be proud of yourself.",
  "Things change. Always.",
];

function EndScreen({ onRestart }) {
  const [lineIdx, setLineIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setLineIdx(i => (i + 1) % HOPE_LINES.length), 2800);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      transition={{ duration:1.8 }}
      style={{
        position:"absolute", inset:0, zIndex:30,
        display:"flex", flexDirection:"column",
        alignItems:"center", justifyContent:"center",
        padding:"24px", textAlign:"center",
      }}
    >
      {/* pixel border frame */}
      <div style={{
        border:"3px solid rgba(100,180,90,0.5)",
        boxShadow:"0 0 0 6px rgba(100,180,90,0.12), 0 0 40px rgba(100,180,90,0.15)",
        padding:"clamp(24px,4vw,48px) clamp(20px,5vw,60px)",
        maxWidth:580, width:"100%",
        position:"relative",
        background:"rgba(8,16,24,0.88)",
      }}>
        {/* corner pixel decorations */}
        {["top-0 left-0","top-0 right-0","bottom-0 left-0","bottom-0 right-0"].map((pos,i)=>(
          <div key={i} style={{
            position:"absolute",
            width:10, height:10,
            background:"rgba(100,180,90,0.7)",
            top: i < 2 ? -3 : "auto",
            bottom: i >= 2 ? -3 : "auto",
            left: i % 2 === 0 ? -3 : "auto",
            right: i % 2 === 1 ? -3 : "auto",
          }}/>
        ))}

        {/* TISA logo */}
        <motion.div
          initial={{ scale:0.6, opacity:0 }}
          animate={{ scale:1, opacity:1 }}
          transition={{ delay:0.3, type:"spring", stiffness:200, damping:16 }}
          style={{ marginBottom:20, display:"flex", justifyContent:"center" }}
        >
          <TisaPixelLogo size={52} />
        </motion.div>

        {/* title */}
        <motion.p
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
          style={{ fontFamily:"'Press Start 2P', monospace", fontSize:"clamp(12px,2.5vw,18px)", color:"rgba(255,255,255,0.88)", letterSpacing:"3px", marginBottom:8 }}
        >
          tisa heal
        </motion.p>
        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.7 }}
          style={{ fontFamily:"'Caveat', cursive", fontSize:"clamp(16px,3vw,22px)", color:"rgba(200,220,255,0.55)", marginBottom:32, letterSpacing:"1px" }}
        >
          your thought has dissolved
        </motion.p>

        {/* cycling hope message */}
        <div style={{ minHeight:44, marginBottom:32, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <AnimatePresence mode="wait">
            <motion.p
              key={lineIdx}
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
              transition={{ duration:0.6 }}
              style={{ fontFamily:"'Caveat', cursive", fontSize:"clamp(20px,4vw,30px)", fontWeight:700, color:"rgba(240,200,120,0.88)", letterSpacing:"0.5px" }}
            >
              {HOPE_LINES[lineIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* pixel divider */}
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:24 }}>
          {Array.from({length:20}).map((_,i)=>(
            <div key={i} style={{ flex:1, height:2, background:`rgba(100,180,90,${i%2===0?0.5:0.2})` }}/>
          ))}
        </div>

        {/* resource links  */}
        <motion.div
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1 }}
          style={{ marginBottom:28, textAlign:"left" }}
        >
          {[
            { label:"BREATHE",   url:"https://www.calm.com/breathe",  color:"#80c0ff" },
            { label:"MINDFUL",   url:"https://www.mindful.org",        color:"#a0e0a0" },
            { label:"CALM APP",  url:"https://www.calm.com",           color:"#c0a0ff" },
            { label:"HEADSPACE", url:"https://www.headspace.com",      color:"#ffb080" },
          ].map((r,i)=>(
            <motion.a
              key={r.label}
              href={r.url} target="_blank" rel="noopener noreferrer"
              initial={{ opacity:0, x:-12 }}
              animate={{ opacity:1, x:0 }}
              transition={{ delay:1.1 + i*0.12 }}
              whileHover={{ x:4 }}
              style={{
                display:"block", marginBottom:8, textDecoration:"none",
                fontFamily:"'Press Start 2P', monospace",
                fontSize:"clamp(7px,1.2vw,9px)",
                color:r.color,
                letterSpacing:"1px",
              }}
            >
              {">"} {r.label}
            </motion.a>
          ))}
        </motion.div>

        {/* Instagram */}
        <motion.a
          href="https://www.instagram.com/_sachinnnnn._"
          target="_blank" rel="noopener noreferrer"
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.6 }}
          whileHover={{ scale:1.03 }}
          style={{
            display:"inline-flex", alignItems:"center", gap:10,
            textDecoration:"none",
            background:"linear-gradient(135deg, rgba(80,20,80,0.6), rgba(180,60,20,0.6))",
            border:"2px solid rgba(200,80,150,0.4)",
            borderRadius:0,
            padding:"10px 20px",
            marginBottom:28,
          }}
        >
          {/* pixel instagram icon */}
          <svg width="16" height="16" viewBox="0 0 16 16" style={{ imageRendering:"pixelated" }}>
            <rect x="2" y="2" width="12" height="12" fill="none" stroke="rgba(255,150,200,0.8)" strokeWidth="2"/>
            <rect x="5" y="5" width="6" height="6"  fill="none" stroke="rgba(255,150,200,0.8)" strokeWidth="1.5"/>
            <rect x="11" y="3" width="2" height="2" fill="rgba(255,150,200,0.8)"/>
          </svg>
          <span style={{
            fontFamily:"'Press Start 2P', monospace",
            fontSize:"clamp(6px,1.1vw,8px)",
            color:"rgba(255,160,200,0.9)",
            letterSpacing:"0.5px",
          }}>
            _sachinnnnn._
          </span>
        </motion.a>

        {/* restart */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}>
          <PixelButton onClick={onRestart} color="cool">
            [ RESTART ]
          </PixelButton>
        </motion.div>

        {/* footer */}
        <motion.p
          initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}
          style={{ marginTop:24, fontFamily:"'Press Start 2P', monospace", fontSize:"6px", color:"rgba(255,255,255,0.12)", letterSpacing:"1px" }}
        >
          made with ♥ by sachin · tisa 2026
        </motion.p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MUSIC HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useMusic() {
  const audioElRef    = useRef(null);
  const fadeRafRef    = useRef(null);
  const audioCtxRef   = useRef(null);
  const oscRef        = useRef([]);
  const bellTimerRef  = useRef(null);

  const cancelFadeRef = useRef(() => {
    if (fadeRafRef.current) { cancelAnimationFrame(fadeRafRef.current); fadeRafRef.current = null; }
  });
  const fadeVolumeRef = useRef((el, from, to, dur, onDone) => {
    cancelFadeRef.current();
    const steps = Math.max(1, dur * 60);
    const delta = (to - from) / steps;
    let cur = from;
    const step = () => {
      cur = Math.min(1, Math.max(0, cur + delta));
      if (el) el.volume = cur;
      if ((delta > 0 && cur < to) || (delta < 0 && cur > to)) {
        fadeRafRef.current = requestAnimationFrame(step);
      } else {
        if (el) el.volume = to;
        if (onDone) onDone();
      }
    };
    fadeRafRef.current = requestAnimationFrame(step);
  });

  const startDrone = useCallback(() => {
    try {
      const ctx    = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const master = ctx.createGain();
      master.gain.setValueAtTime(0, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 6);
      master.connect(ctx.destination);

      const conv = ctx.createConvolver();
      const rLen = ctx.sampleRate * 4;
      const rBuf = ctx.createBuffer(2, rLen, ctx.sampleRate);
      for (let c = 0; c < 2; c++) {
        const d = rBuf.getChannelData(c);
        for (let i = 0; i < rLen; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / rLen, 2.2);
      }
      conv.buffer = rBuf;
      const rg = ctx.createGain(); rg.gain.value = 0.25;
      conv.connect(rg); rg.connect(master);

      [[55,0,0.04],[110,0,0.028],[110,5,0.022],[165,0,0.016]].forEach(([f,d,g]) => {
        const o = ctx.createOscillator(); const gn = ctx.createGain();
        o.type = "sine"; o.frequency.value = f; o.detune.value = d; gn.gain.value = g;
        o.connect(gn); gn.connect(master); gn.connect(conv);
        o.start(); oscRef.current.push(o);
      });

      const bell = (delay) => {
        bellTimerRef.current = setTimeout(() => {
          if (!audioCtxRef.current) return;
          const freqs = [396,432,440,528,369];
          const o = ctx.createOscillator(); const env = ctx.createGain();
          o.frequency.value = freqs[Math.floor(Math.random() * freqs.length)];
          o.type = "sine";
          env.gain.setValueAtTime(0, ctx.currentTime);
          env.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.07);
          env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 5);
          o.connect(env); env.connect(master); env.connect(conv);
          o.start(); o.stop(ctx.currentTime + 6);
          bell(7000 + Math.random() * 10000);
        }, delay);
      };
      bell(4000);
    } catch { /* audio unavailable */ }
  }, []);

  const stopDrone = useCallback(() => {
    if (bellTimerRef.current) { clearTimeout(bellTimerRef.current); bellTimerRef.current = null; }
    oscRef.current.forEach(o => { try { o.stop(); } catch { /* already stopped */ } });
    oscRef.current = [];
    if (audioCtxRef.current) { audioCtxRef.current.close().catch(() => {}); audioCtxRef.current = null; }
  }, []);

  const start = useCallback(() => {
    startDrone();
    if (!MUSIC_SRC) return;
    if (!audioElRef.current) {
      const el = new Audio(); el.loop = true; el.volume = 0; el.src = MUSIC_SRC;
      audioElRef.current = el;
    }
    const el = audioElRef.current;
    el.currentTime = 0;
    el.play().then(() => { fadeVolumeRef.current(el, 0, MUSIC_VOLUME, MUSIC_FADE_DURATION); })
             .catch(() => {});
  }, [startDrone]);

  const stop = useCallback(() => {
    stopDrone(); cancelFadeRef.current();
    const el = audioElRef.current; if (!el) return;
    fadeVolumeRef.current(el, el.volume, 0, MUSIC_FADE_DURATION, () => { el.pause(); el.currentTime = 0; });
  }, [stopDrone]);

  useEffect(() => () => { cancelFadeRef.current(); stopDrone(); const el = audioElRef.current; if (el) el.pause(); }, [stopDrone]);

  return { start, stop };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [phase,      setPhase]      = useState("idle");   // idle | healing | burst | done
  const [input,      setInput]      = useState("");
  const [thought,    setThought]    = useState("");
  const [progress,   setProgress]   = useState(1);        // 1→0 over 60s
  const [curMsg,     setCurMsg]     = useState(null);
  const [burst,      setBurst]      = useState(false);

  const timersRef   = useRef([]);
  const startTimeRef= useRef(null);
  const rafRef      = useRef(null);
  const music       = useMusic();
  const musicOn     = useRef(false);

  const clearAll = useCallback(() => {
    timersRef.current.forEach(clearTimeout); timersRef.current = [];
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
  }, []);

  // Progress ticker
  const startTicker = useCallback(() => {
    startTimeRef.current = Date.now();
    const tick = () => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const p = Math.max(0, 1 - elapsed / DURATION);
      setProgress(p);
      if (p > 0) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const begin = useCallback(() => {
    const val = input.trim();
    if (!val) return;

    if (!musicOn.current) { music.start(); musicOn.current = true; }
    setThought(val);
    setProgress(1);
    setCurMsg(null);
    setPhase("healing");
    startTicker();

    // Schedule each message: show it, then hide it before the next one arrives
    const msgs = getMessageSet();
    msgs.forEach((m, i) => {
      // Show this message at its timestamp
      timersRef.current.push(
        setTimeout(() => setCurMsg(m), m.at * 1000)
      );
      // Hide it 1.2s before the next message arrives (or 2s before burst)
      const nextAt = msgs[i + 1] ? msgs[i + 1].at : DURATION;
      const hideAt = Math.max(m.at + 2, nextAt - 1.2); // show for at least 2s
      timersRef.current.push(
        setTimeout(() => setCurMsg(null), hideAt * 1000)
      );
    });

    // Burst at 60s (orb explodes into particles)
    timersRef.current.push(setTimeout(() => {
      setPhase("burst");
      setBurst(true);
      setCurMsg(null);
      // Fade to done after burst settles
      timersRef.current.push(setTimeout(() => {
        setBurst(false);
        music.stop(); musicOn.current = false;
        setPhase("done");
      }, 2000));
    }, DURATION * 1000));
  }, [input, startTicker, music]);

  const restart = useCallback(() => {
    clearAll();
    music.stop(); musicOn.current = false;
    setPhase("idle"); setInput(""); setThought("");
    setProgress(1); setCurMsg(null); setBurst(false);
  }, [clearAll, music]);

  useEffect(() => () => { clearAll(); music.stop(); }, [clearAll, music]);

  // ── RENDER ────────────────────────────────────────────────────────────────
  return (
    <div
      // no-op outer click
      style={{
        position:"fixed", inset:0,
        background:"radial-gradient(ellipse 160% 100% at 50% 85%, #0f1f30 0%, #090e18 45%, #060810 100%)",
        overflow:"hidden",
        fontFamily:"'Inter', system-ui, sans-serif",
        userSelect:"none",
      }}
    >
      <div className="scanlines" />
      <StarField />

      {/* ── PHASE 1: IDLE ──────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0, y:-20 }}
            transition={{ duration:1.2, ease:[0.22,1,0.36,1] }}
            style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:0, padding:"0 24px" }}
          >
            <FloatingDoodles visible={true} />

            {/* wordmark row */}
            <motion.div
              initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2, duration:0.9 }}
              style={{ display:"flex", alignItems:"center", gap:14, marginBottom:12 }}
            >
              <motion.div animate={{ scale:[1,1.08,1] }} transition={{ duration:3, repeat:Infinity, ease:"easeInOut" }}>
                <TisaPixelLogo size={40} />
              </motion.div>
              <motion.span
                style={{
                  fontFamily:"'Press Start 2P', monospace",
                  fontSize:"clamp(20px,4.5vw,34px)",
                  color:"#fff",
                  letterSpacing:"3px",
                }}
                animate={{
                  textShadow:[
                    "0 0 10px rgba(100,200,90,0.5), 0 0 24px rgba(100,200,90,0.25), 3px 3px 0 rgba(0,80,0,0.5)",
                    "0 0 18px rgba(130,230,110,0.72), 0 0 40px rgba(100,200,90,0.42), 3px 3px 0 rgba(0,80,0,0.5)",
                    "0 0 10px rgba(100,200,90,0.5), 0 0 24px rgba(100,200,90,0.25), 3px 3px 0 rgba(0,80,0,0.5)",
                  ],
                }}
                transition={{ duration:2.8, repeat:Infinity }}
              >
                tisa heal
              </motion.span>
            </motion.div>

            <motion.p
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.45, duration:0.9 }}
              style={{ fontFamily:"'Caveat', cursive", fontSize:"clamp(16px,2.8vw,22px)", color:"rgba(255,255,255,0.35)", marginBottom:44, letterSpacing:"2px" }}
            >
              Put a stressful thought in the star
            </motion.p>

            {/* Orb */}
            <motion.div
              initial={{ opacity:0, scale:0.75 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay:0.35, duration:1, ease:[0.34,1.56,0.64,1] }}
              style={{ marginBottom:40 }}
            >
              <WarmOrb thought={input} phase="idle" progress={1} />
            </motion.div>

            {/* Input */}
            <motion.div
              initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.7, duration:0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:14, width:"100%", maxWidth:440 }}
            >
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && input.trim() && begin()}
                placeholder="What's bothering you?..."
                maxLength={60}
                autoComplete="off"
                autoFocus
                style={{
                  width:"100%",
                  background:"rgba(255,255,255,0.06)",
                  border:"2px solid rgba(200,160,80,0.35)",
                  borderRadius:0,
                  padding:"14px 22px",
                  fontFamily:"'Caveat', cursive",
                  fontSize:"clamp(18px,3vw,24px)",
                  color:"#fff",
                  outline:"none",
                  textAlign:"center",
                  transition:"border-color 0.3s, background 0.3s, box-shadow 0.3s",
                }}
                onFocus={e => {
                  e.target.style.borderColor="rgba(240,160,60,0.8)";
                  e.target.style.background="rgba(200,120,40,0.08)";
                  e.target.style.boxShadow="0 0 16px rgba(220,120,40,0.22)";
                }}
                onBlur={e => {
                  e.target.style.borderColor="rgba(200,160,80,0.35)";
                  e.target.style.background="rgba(255,255,255,0.06)";
                  e.target.style.boxShadow="none";
                }}
              />
              <PixelButton onClick={begin} disabled={!input.trim()}>
                [ LET IT GO ]
              </PixelButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE 2: HEALING ──────────────────────────────────────── */}
      <AnimatePresence>
        {(phase === "healing" || phase === "burst") && (
          <motion.div
            key="healing"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            transition={{ duration:1.4 }}
            style={{ position:"absolute", inset:0, zIndex:10, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}
          >
            {/* guided message — above orb */}
            <div style={{ position:"absolute", top:"12%", left:"50%", transform:"translateX(-50%)", width:"90%", maxWidth:600, textAlign:"center", pointerEvents:"none", zIndex:20 }}>
              <AnimatePresence mode="wait">
                {curMsg && (
                  <motion.div
                    key={curMsg.at}
                    initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
                    transition={{ duration:0.8, ease:[0.22,1,0.36,1] }}
                  >
                    {/* main text — Caveat font, large, matches reference screenshot */}
                    <motion.p
                      style={{
                        fontFamily:"'Caveat', cursive",
                        fontSize:"clamp(24px,5vw,42px)",
                        fontWeight:600,
                        color:"rgba(210,225,245,0.88)",
                        letterSpacing:"0.5px",
                        lineHeight:1.3,
                        marginBottom:8,
                        textShadow:"0 2px 20px rgba(0,0,0,0.6)",
                      }}
                      animate={{ y:[0,-4,0] }}
                      transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
                    >
                      {curMsg.text}
                    </motion.p>
                    <p style={{
                      fontFamily:"'Inter', system-ui, sans-serif",
                      fontSize:"clamp(12px,2vw,15px)",
                      fontWeight:300,
                      color:"rgba(160,185,215,0.48)",
                      letterSpacing:"1px",
                      fontStyle:"italic",
                    }}>
                      {curMsg.sub}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* orb (shrinks to 0 over 60s) + burst */}
            <div style={{ position:"relative" }}>
              <AnimatePresence>
                {phase === "healing" && (
                  <motion.div
                    key="orb"
                    initial={{ opacity:1 }} exit={{ opacity:0 }}
                    transition={{ duration:0.4 }}
                  >
                    <WarmOrb thought={thought} phase="healing" progress={progress} />
                  </motion.div>
                )}
              </AnimatePresence>
              <ParticleBurst active={burst} />
            </div>

            {/* progress bar */}
            <motion.div
              style={{
                position:"fixed", bottom:0, left:0,
                height:"3px", width:`${progress * 100}%`,
                background:"linear-gradient(90deg, rgba(220,100,30,0.8), rgba(255,180,80,0.9))",
                zIndex:30,
                boxShadow:"0 -1px 10px rgba(220,100,30,0.5)",
                transition:"width 0.15s linear",
              }}
            />

            {/* subtle timer label */}
            <motion.p
              initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:3 }}
              style={{ position:"fixed", bottom:14, fontFamily:"'Press Start 2P', monospace", fontSize:"6px", color:"rgba(255,255,255,0.1)", letterSpacing:"1.5px", pointerEvents:"none", zIndex:20 }}
            >
              {Math.ceil(progress * DURATION)}s remaining
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE 3: DONE ─────────────────────────────────────────── */}
      <AnimatePresence>
        {phase === "done" && (
          <EndScreen key="done" onRestart={restart} />
        )}
      </AnimatePresence>
    </div>
  );
}
