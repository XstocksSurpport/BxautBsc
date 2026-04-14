import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ImgHTMLAttributes,
  type SyntheticEvent,
} from "react";

const PLACEHOLDER_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"><rect fill="#140a24" width="96" height="96"/><text x="48" y="56" text-anchor="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="12">—</text></svg>`,
  );

function dedupeSources(urls: readonly (string | null | undefined)[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const u of urls) {
    const s = (u ?? "").trim();
    if (!s || seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

export type SafeImgProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  /** URLs tried in order until one loads */
  sources: readonly string[];
};

/**
 * Image with chained `onError` fallbacks (broken CDN / moved assets / flaky IPFS).
 * Ends with an inline SVG placeholder so the UI never loops on errors.
 */
export function SafeImg({ sources, onError, alt = "", loading, decoding, ...rest }: SafeImgProps) {
  const sourceKey = sources.join("|");

  const list = useMemo(() => {
    const base = dedupeSources(sources);
    return base.length ? [...base, PLACEHOLDER_SVG] : [PLACEHOLDER_SVG];
  }, [sourceKey]);

  const [i, setI] = useState(0);

  useEffect(() => {
    setI(0);
  }, [sourceKey]);

  const idx = Math.min(i, list.length - 1);
  const src = list[idx];

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      onError?.(e);
      setI((x) => (x < list.length - 1 ? x + 1 : x));
    },
    [list.length, onError],
  );

  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      loading={loading ?? "lazy"}
      decoding={decoding ?? "async"}
      onError={handleError}
    />
  );
}
