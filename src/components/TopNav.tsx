import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "../i18n/I18nContext";
import type { MobileTabId } from "../mobile/MobileTabContext";
import { useMobileTab } from "../mobile/MobileTabContext";
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

/** Primary row includes market; “More” omits it. */
const moreTabs = ["tokenomics", "staking", "governance", "faq", "community"] as const;

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/** Mobile: 4 primary tabs + “More” sheet (≤720px only). */
export function BottomTabNav() {
  const { t } = useI18n();
  const { isPager, setActiveTab } = useMobileTab();
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

  const go = useCallback(
    (id: MobileTabId) => {
      setMoreOpen(false);
      if (isPager) setActiveTab(id);
      else scrollToSection(id);
    },
    [isPager, setActiveTab],
  );

  const goHome = useCallback(() => {
    setMoreOpen(false);
    if (isPager) setActiveTab("home");
    else scrollToTop();
  }, [isPager, setActiveTab]);

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
        <button type="button" className="bottom-tab-nav__btn" onClick={goHome}>
          {t("navHome")}
        </button>
        <button type="button" className="bottom-tab-nav__btn" onClick={() => go("mint")}>
          {t("navMint")}
        </button>
        <button type="button" className="bottom-tab-nav__btn" onClick={() => go("dividend")}>
          {t("navDividend")}
        </button>
        <button type="button" className="bottom-tab-nav__btn" onClick={() => go("market")}>
          {t("navMarket")}
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

/** Site section menu (desktop scroll + mobile pager). Lives in the header. */
export function SectionNavMenu() {
  const { t } = useI18n();
  const { isPager, setActiveTab } = useMobileTab();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const go = useCallback(
    (id: (typeof sections)[number]) => {
      setOpen(false);
      if (isPager) setActiveTab(id);
      else scrollToSection(id);
    },
    [isPager, setActiveTab],
  );

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
    <div className="section-nav-dropdown" ref={rootRef}>
      <button
        type="button"
        className="top-nav-trigger section-nav-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("navMenu")}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="top-nav-trigger-label">{t("navMenu")}</span>
        <span className={`top-nav-caret${open ? " open" : ""}`} aria-hidden />
      </button>
      {open && (
        <ul className="top-nav-menu section-nav-menu-list pixel-frame" role="listbox">
          {sections.map((id) => (
            <li key={id} role="none">
              <button type="button" role="option" className="top-nav-item" onClick={() => go(id)}>
                {t(keys[id])}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
