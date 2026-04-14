import type { WalletApi } from "../hooks/useWallet";
import { useAssetsPage } from "../context/AssetsPageContext";
import { useI18n } from "../i18n/I18nContext";
import { publicAsset } from "../config/publicPath";
import { SectionNavMenu } from "./TopNav";

export function Header({ wallet }: { wallet: WalletApi }) {
  const { locale, setLocale, t } = useI18n();
  const { openAssets } = useAssetsPage();

  return (
    <header className="app-header app-header--compact">
      <button
        type="button"
        className="btn btn-ghost lang-toggle"
        onClick={() => setLocale(locale === "en" ? "zh" : "en")}
        aria-label="Toggle language"
      >
        {t("langShort")}
      </button>

      <div className="brand-center brand-center--compact">
        <img
          className="brand-logo"
          src={publicAsset("logo.png")}
          alt="Bxaut"
          width={44}
          height={44}
          decoding="async"
        />
        <div className="brand-text-stack">
          <h1 className="brand-short">{t("brandShort")}</h1>
          <p className="brand-tagline">{t("headerTagline")}</p>
        </div>
      </div>

      <div className="wallet-cluster wallet-cluster--compact">
        {wallet.account ? (
          <button type="button" className="btn btn-outline header-assets-btn" onClick={openAssets}>
            {t("assetsLabel")}
          </button>
        ) : null}
        {wallet.account && !wallet.isBsc ? (
          <button
            type="button"
            className="btn btn-outline network-hint"
            onClick={() => void wallet.switchToBsc()}
          >
            {t("wrongNetwork")}
          </button>
        ) : null}
        {wallet.account && !wallet.isBsc ? (
          <button type="button" className="btn btn-outline" onClick={() => wallet.disconnect()}>
            {t("disconnect")}
          </button>
        ) : null}
        {!wallet.account ? (
          <button
            type="button"
            className="btn btn-gold"
            disabled={wallet.busy || !wallet.hasInjectedProvider}
            onClick={() => void wallet.connect()}
          >
            {t("connect")}
          </button>
        ) : null}
        <SectionNavMenu />
      </div>
    </header>
  );
}
