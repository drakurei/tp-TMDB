import { useEffect, useLayoutEffect, useRef, useState } from "react";
import "../styles/intro.css";

const STORAGE_KEY = "jflix-intro-seen";
const LEAVE_AT = 3850;

// The J is made of two ribbons drawn as thick strokes: a vertical stem
// and a hook that curves to the left
const STEM = "M140 16V196";
const HOOK = "M140 196A50 50 0 0 1 40 196V176";

// Vertical light rays around the J: [left in %, width in px, delay in ms]
const RAYS = [
  [9, 1, 160], [16, 3, 40], [23, 1, 260], [29, 2, 0], [35, 5, 120], [41, 1, 300],
  [58, 1, 220], [63, 4, 60], [68, 1, 180], [74, 2, 20], [80, 3, 280], [88, 1, 100],
];

// The intro plays once per browser session and never with reduced motion
function shouldPlay() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(STORAGE_KEY) !== "1";
  } catch {
    return true;
  }
}

function IntroAnimation() {
  const [visible, setVisible] = useState(shouldPlay);
  const [leaving, setLeaving] = useState(false);
  const skipRef = useRef(null);
  const playing = visible && !leaving;

  // While the intro plays, the page behind is frozen (no scroll, entrance
  // animations paused) so the hero is revealed when the curtain lifts
  useLayoutEffect(() => {
    if (!playing) return;
    const root = document.documentElement;
    root.dataset.intro = "playing";
    return () => delete root.dataset.intro;
  }, [playing]);

  useEffect(() => {
    if (!visible) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Without storage the intro simply plays again next time
    }

    skipRef.current?.focus({ preventScroll: true });
    const leaveTimer = setTimeout(() => setLeaving(true), LEAVE_AT);
    const onKey = (event) => event.key === "Escape" && setLeaving(true);
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(leaveTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`intro ${leaving ? "intro--leaving" : ""}`}
      onAnimationEnd={(event) => event.animationName === "intro-out" && setVisible(false)}
      role="presentation"
    >
      <div className="intro__rays" aria-hidden="true">
        {RAYS.map(([left, width, delay]) => (
          <span key={left} style={{ left: `${left}%`, width, animationDelay: `${1100 + delay}ms` }} />
        ))}
      </div>

      <div className="intro__stage" aria-hidden="true">
        <div className="intro__halo" />
        <svg className="intro__j" viewBox="12 11 156 263">
          <defs>
            <linearGradient id="stem-fill" gradientUnits="userSpaceOnUse" x1="0" y1="16" x2="0" y2="200">
              <stop offset="0" stopColor="#ff2b2b" />
              <stop offset="1" stopColor="#b5121c" />
            </linearGradient>
            {/* Dark near the stem, like a folded ribbon, lit at the tip */}
            <linearGradient id="hook-fill" gradientUnits="userSpaceOnUse" x1="163" y1="0" x2="17" y2="0">
              <stop offset="0" stopColor="#5e0b13" />
              <stop offset="0.35" stopColor="#a8121c" />
              <stop offset="1" stopColor="#ff3a3a" />
            </linearGradient>
            <pattern id="beams" width="40" height="300" patternUnits="userSpaceOnUse">
              <rect x="0" width="3" height="300" fill="#ff0101" />
              <rect x="7" width="8" height="300" fill="#ffb0b0" opacity="0.75" />
              <rect x="18" width="2" height="300" fill="#ffffff" />
              <rect x="23" width="10" height="300" fill="#a13b46" />
              <rect x="35" width="3" height="300" fill="#ff5a5a" />
            </pattern>
            <linearGradient id="specular" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.9" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            {/* The mask is drawn with the ribbons, so light never shows ahead of them */}
            <mask id="j-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="300">
              <path className="intro__ribbon intro__ribbon--stem" d={STEM} pathLength="100" stroke="#fff" />
              <path className="intro__ribbon intro__ribbon--hook" d={HOOK} pathLength="100" stroke="#fff" />
            </mask>
          </defs>

          <path className="intro__ribbon intro__ribbon--stem" d={STEM} pathLength="100" stroke="url(#stem-fill)" />
          <path className="intro__ribbon intro__ribbon--hook" d={HOOK} pathLength="100" stroke="url(#hook-fill)" />

          <g mask="url(#j-mask)">
            <rect className="intro__beams" x="-200" y="0" width="600" height="300" fill="url(#beams)" />
            <rect
              className="intro__beams intro__beams--back"
              x="-200"
              y="0"
              width="600"
              height="300"
              fill="url(#beams)"
            />
            <rect className="intro__specular" x="-40" y="0" width="34" height="300" fill="url(#specular)" />
          </g>
        </svg>
      </div>

      <p className="intro__word" aria-hidden="true">
        J<span>F</span>LIX
      </p>

      <button ref={skipRef} type="button" className="intro__skip" onClick={() => setLeaving(true)}>
        Passer l'intro
      </button>
    </div>
  );
}

export default IntroAnimation;
