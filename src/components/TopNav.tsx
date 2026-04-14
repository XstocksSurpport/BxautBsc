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

const moreTabs = ["market", "tokenomics", "staking", "governance", "faq"] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Mobile: 4 primary tabs + “More” sheet (≤720px only). */
export function BottomTabNav() {
  const { t } = useI18n();
  const [moreOpen, setMoreOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [moreOpen]);

  const go = useCallback((id: string) => {
    scrollToSection(id);
    setMoreOpen(false);
  }, []);

  return (
    <nav className="bottom-tab-nav" ref={rootRef} aria-label="Primary">
      {moreOpen && (
        <div className="bottom-tab-nav__sheet pixel-frame" role="menu">
          {moreTabs.map((id) => (
            <button
              key={id}
              type="button"
              role="menuitem"
              className="bottom-tab-nav__sheet-btn"
              onClick={() => go(id)}
            >
              {t(keys[id])}
            </button>
          ))}
        </div>
      )}
      <div className="bottom-tab-nav__track bottom-tab-nav__track--main">
        <button
          type="button"
          className="bottom-tab-nav__btn"
          onClick={() => {
            setMoreOpen(false);
            scrollToTop();
          }}
        >
          {t("navHome")}
        </button>
        <button type="button" className="bottom-tab-nav__btn" onClick={() => go("mint")}>
          {t("navMint")}
        </button>
        <button type="button" className="bottom-tab-nav__btn" onClick={() => go("dividend")}>
          {t("navDividend")}
        </button>
        <button type="button" className="bottom-tab-nav__btn" onClick={() => go("community")}>
          {t("navMy")}
        </button>
        <button
          type="button"
          className="bottom-tab-nav__btn bottom-tab-nav__btn--more"
          aria-expanded={moreOpen}
          aria-haspopup="menu"
          onClick={() => setMoreOpen((v) => !v)}
        >
          {t("navMore")}
        </button>
      </div>
    </nav>
  );
}

export function TopNav() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const scrollTo = useCallback((id: string) => {
    scrollToSection(id);
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
    <nav className="top-nav top-nav--desktop pixel-frame" aria-label="Primary">
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
