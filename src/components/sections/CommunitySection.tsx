import { useI18n } from "../../i18n/I18nContext";

export function CommunitySection() {
  const { t } = useI18n();

  const telegram =
    import.meta.env.VITE_TELEGRAM_URL?.trim()?.startsWith("http") === true
      ? import.meta.env.VITE_TELEGRAM_URL.trim()
      : "https://t.me/";
  const twitter =
    import.meta.env.VITE_TWITTER_URL?.trim()?.startsWith("http") === true
      ? import.meta.env.VITE_TWITTER_URL.trim()
      : "https://x.com/";
  const discord =
    import.meta.env.VITE_DISCORD_URL?.trim()?.startsWith("http") === true
      ? import.meta.env.VITE_DISCORD_URL.trim()
      : "https://discord.com/";

  return (
    <section id="community" className="section community-section section--meme pixel-frame">
      <h2 className="section-title">{t("communityTitle")}</h2>
      <p className="section-lead">{t("communityBody")}</p>
      <div className="community-links">
        <a className="btn btn-outline" href={telegram} target="_blank" rel="noreferrer">
          {t("telegram")}
        </a>
        <a className="btn btn-outline" href={twitter} target="_blank" rel="noreferrer">
          {t("twitter")}
        </a>
        <a className="btn btn-outline" href={discord} target="_blank" rel="noreferrer">
          {t("discord")}
        </a>
      </div>
    </section>
  );
}
