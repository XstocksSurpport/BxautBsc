import { useI18n } from "../../i18n/I18nContext";

export function MarketplaceSection() {
  const { t } = useI18n();

  return (
    <section id="market" className="section market-section section--meme pixel-frame">
      <div className="loot-vault">
        <div className="loot-vault__label">{t("lootVault")}</div>
        <h2 className="section-title">{t("marketTitle")}</h2>
        <p className="coming-soon">{t("marketBody")}</p>
        <p className="coming-soon-sub muted">{t("comingSoonAlt")}</p>
        <div className="loot-vault__lock" aria-hidden />
      </div>
    </section>
  );
}
