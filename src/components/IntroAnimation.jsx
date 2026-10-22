import { useEffect, useRef, useState } from "react";
import "../styles/intro.css";

const STORAGE_KEY = "jflix-intro-seen";
const J_PATH =
  "M120 20H160V170C160 220 130 245 90 245C55 245 30 225 22 195L58 182C64 200 75 210 92 210C110 210 120 198 120 172Z";
const HOOK_PATH =
  "M160 170C160 220 130 245 90 245C55 245 30 225 22 195L58 182C64 200 75 210 92 210C110 210 120 198 120 172Z";

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

  useEffect(() => {
    if (!visible) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Without storage the intro simply plays again next time
    }

    skipRef.current?.focus({ preventScroll: true });
    const leaveTimer = setTimeout(() => setLeaving(true), 3000);
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
      aria-label="Introduction JFLIX"
      role="presentation"
    >
      <div className="intro__glow" />

      <div className="intro__stage">
        <svg className="intro__j" viewBox="0 0 180 260" aria-hidden="true">
          <defs>
            <linearGradient id="j-body" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#e3242b" />
              <stop offset="1" stopColor="#8f1d29" />
            </linearGradient>
            <linearGradient id="j-hook" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#000" stopOpacity="0.3" />
              <stop offset="1" stopColor="#000" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="j-shine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#ff0101" stopOpacity="0" />
              <stop offset="0.5" stopColor="#ffd9d9" stopOpacity="0.95" />
              <stop offset="1" stopColor="#ff0101" stopOpacity="0" />
            </linearGradient>
            <clipPath id="j-clip">
              <path d={J_PATH} />
            </clipPath>
          </defs>

          <path d={J_PATH} fill="url(#j-body)" />
          <path d={HOOK_PATH} fill="url(#j-hook)" />
          <g clipPath="url(#j-clip)">
            <rect className="intro__shine" x="-90" y="0" width="70" height="260" fill="url(#j-shine)" />
          </g>
        </svg>

        <div className="intro__flare" />

        <p className="intro__word" aria-hidden="true">
          {"JFLIX".split("").map((letter, index) => (
            <span key={index} style={{ "--i": index }}>
              {letter}
            </span>
          ))}
        </p>
      </div>

      <button ref={skipRef} type="button" className="intro__skip" onClick={() => setLeaving(true)}>
        Passer l'intro
      </button>
    </div>
  );
}

export default IntroAnimation;
