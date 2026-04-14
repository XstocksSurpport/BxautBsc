import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { publicAsset } from "../config/publicPath";

/** MP4 first: most deploys only ship mp4; iOS often errors before trying next <source> if webm 404s. */
const DEFAULT_MP4 = publicAsset("videos/bxaut-home-dance.mp4");
const DEFAULT_WEBM = publicAsset("videos/bxaut-home-dance.webm");

function resolveVideoSrc(raw: string | undefined): string {
  const t = (raw ?? "").trim();
  if (!t) return "";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  const path = t.startsWith("/") ? t.slice(1) : t;
  return publicAsset(path);
}

/**
 * Self-hosted loop under the home “Mint” button (no YouTube embed).
 * Uses a single `src` + fallback chain so mobile Safari does not hide the block
 * when the first optional WebM is missing.
 */
export function MobileHomeDanceVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const envSrc = import.meta.env.VITE_HOME_DANCE_VIDEO_SRC;

  const fallbackChain = useMemo(() => {
    const one = resolveVideoSrc(envSrc);
    if (one) return [one];
    return [DEFAULT_MP4, DEFAULT_WEBM];
  }, [envSrc]);

  const [chainIndex, setChainIndex] = useState(0);
  const activeSrc = fallbackChain[Math.min(chainIndex, fallbackChain.length - 1)] ?? "";

  const tryPlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const p = el.play();
    if (p !== undefined) void p.catch(() => {});
  }, []);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !activeSrc) return;
    el.load();
    tryPlay();
  }, [activeSrc, tryPlay]);

  const onLoadedData = useCallback(() => {
    tryPlay();
  }, [tryPlay]);

  const onError = useCallback(() => {
    setChainIndex((i) => {
      const next = i + 1;
      if (next >= fallbackChain.length) {
        queueMicrotask(() => setFailed(true));
        return i;
      }
      return next;
    });
  }, [fallbackChain.length]);

  if (failed || !activeSrc) return null;

  return (
    <div className="mobile-home-dance" aria-hidden>
      <div className="mobile-home-dance__inner">
        <video
          ref={videoRef}
          key={activeSrc}
          className="mobile-home-dance__video"
          src={activeSrc}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          controls={false}
          onLoadedData={onLoadedData}
          onError={onError}
        />
      </div>
    </div>
  );
}
