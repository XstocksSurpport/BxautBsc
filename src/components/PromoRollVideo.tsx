import { useCallback, useState } from "react";
import { publicAsset } from "../config/publicPath";

/**
 * Self-hosted promo clip (muted, no YouTube embed).
 * Export your Short to MP4/WebM without audio, place at public/videos/bxaut-promo.mp4
 * Optional: VITE_PROMO_VIDEO_SRC=/videos/other.mp4
 *
 * Source reference (export yourself; do not hotlink): youtube.com/shorts/vzIG3JaF_K8
 */
const defaultSrc =
  (import.meta.env.VITE_PROMO_VIDEO_SRC as string | undefined) ||
  publicAsset("videos/bxaut-promo.mp4");

export function PromoRollVideo() {
  const [ok, setOk] = useState(true);

  const onError = useCallback(() => {
    setOk(false);
  }, []);

  if (!ok) {
    return null;
  }

  return (
    <div className="promo-roll-wrap" aria-hidden="true">
      <div className="promo-roll-spin">
        <video
          className="promo-roll-video"
          src={defaultSrc}
          muted
          playsInline
          loop
          autoPlay
          preload="metadata"
          onError={onError}
        />
      </div>
    </div>
  );
}
