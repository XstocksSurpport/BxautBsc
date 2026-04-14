import { useCallback, useMemo, useState } from "react";
import { publicAsset } from "../config/publicPath";

/** Default files you add under `public/videos/` (export from Short; WebM with alpha preferred). */
const DEFAULT_WEBM = publicAsset("videos/bxaut-home-dance.webm");
const DEFAULT_MP4 = publicAsset("videos/bxaut-home-dance.mp4");

function resolveVideoSrc(raw: string | undefined): string {
  const t = (raw ?? "").trim();
  if (!t) return "";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  const path = t.startsWith("/") ? t.slice(1) : t;
  return publicAsset(path);
}

/**
 * Self-hosted loop under the home “Mint” button (no YouTube embed).
 * White-ish backgrounds blend into the page via `mix-blend-mode: multiply` on dark base;
 * for clean edges, prefer exporting WebM VP9 with alpha from your editor.
 */
export function MobileHomeDanceVideo() {
  const [failed, setFailed] = useState(false);
  const envSrc = import.meta.env.VITE_HOME_DANCE_VIDEO_SRC;

  const sources = useMemo(() => {
    const one = resolveVideoSrc(envSrc);
    if (one) {
      const type = one.includes(".webm") ? "video/webm" : "video/mp4";
      return [{ src: one, type }];
    }
    return [
      { src: DEFAULT_WEBM, type: "video/webm" as const },
      { src: DEFAULT_MP4, type: "video/mp4" as const },
    ];
  }, [envSrc]);

  const onError = useCallback(() => {
    setFailed(true);
  }, []);

  if (failed) return null;

  return (
    <div className="mobile-home-dance" aria-hidden>
      <div className="mobile-home-dance__inner">
        <video
          className="mobile-home-dance__video"
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          onError={onError}
        >
          {sources.map((s) => (
            <source key={s.src} src={s.src} type={s.type} />
          ))}
        </video>
      </div>
    </div>
  );
}
