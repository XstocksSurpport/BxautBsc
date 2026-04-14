import { useI18n } from "../i18n/I18nContext";

/**
 * Decorative meme / abstract strip on mobile home (replaces former dance video).
 */
export function MobileHomeMemeDecor() {
  const { t } = useI18n();

  return (
    <div className="mobile-home-meme" aria-hidden>
      <div className="mobile-home-meme__rail">
        <span className="meme-pill meme-pill--pink">{t("memePillGm")}</span>
        <span className="meme-pill meme-pill--cyan">{t("memePillWagmi")}</span>
        <span className="meme-pill meme-pill--gold">{t("memePillLfg")}</span>
        <span className="meme-pill meme-pill--violet">{t("memePillYolo")}</span>
        <span className="meme-pill meme-pill--lime">{t("memePillDegen")}</span>
      </div>
      <div className="mobile-home-meme__stage">
        <div className="mobile-home-meme__blob" />
        <div className="mobile-home-meme__ring" />
        <div className="mobile-home-meme__diamond" />
        <div className="mobile-home-meme__pixel" />
        <div className="mobile-home-meme__pixel mobile-home-meme__pixel--2" />
        <span className="mobile-home-meme__ascii">⌐■_■</span>
      </div>
    </div>
  );
}
