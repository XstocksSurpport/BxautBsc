import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import type { TranslationKey } from "../i18n/translations";

const sections = [
  "mint",
  "market",
  "dividend",
  "tokenomics",
  "staking",
  "governance",
  "faq",
  "community",
] as const;

const keys = {
  mint: "navMint",
  market: "navMarket",
  dividend: "navDividend",
  tokenomics: "navTokenomics",
  staking: "navStaking",
  governance: "navGovernance",
  faq: "navFaq",
  community: "navCommunity",
} as const satisfies Record<(typeof sections)[number], TranslationKey>;

export function TopNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <nav className="top-nav pixel-frame" aria-label="Primary">
      <div className="top-nav-dropdown" ref={rootRef}>
        <button
          type="button"
          className="top-nav-trigger"
          aria-expanded={open}
          aria-haspopup="listbox"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="top-nav-trigger-label">{t("navMenu")}</span>
          <span className={`top-nav-caret${open ? " open" : ""}`} aria-hidden />
        </button>
        {open && (
          <ul className="top-nav-menu pixel-frame" role="listbox">
            {sections.map((id) => (
              <li key={id} role="none">
                <button
                  type="button"
                  role="option"
                  className="top-nav-item"
                  onClick={() => scrollTo(id)}
                >
                  {t(keys[id])}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </nav>
  );
}
