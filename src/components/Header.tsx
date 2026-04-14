import { usePendingBxautFromShovels } from "../hooks/usePendingBxautFromShovels";
import type { WalletApi } from "../hooks/useWallet";
import { useI18n } from "../i18n/I18nContext";
import { publicAsset } from "../config/publicPath";
import { MyNftsPopover } from "./MyNftsPopover";

export function Header({ wallet }: { wallet: WalletApi }) {
  const { locale, setLocale, t } = useI18n();
  const pendingBxaut = usePendingBxautFromShovels(wallet);

  const headerMod =
    wallet.account && wallet.isBsc ? " app-header--wallet-sheet" : "";

  return (
    <header className={`app-header${headerMod}`}>
      <button
        type="button"
        className="btn btn-ghost lang-toggle"
        onClick={() => setLocale(locale === "en" ? "zh" : "en")}
        aria-label="Toggle language"
      >
        {t("langShort")}
      </button>

      <div className="brand-center">
        <img
          className="brand-logo"
          src={publicAsset("logo.png")}
          alt="Bxaut"
          width={44}
          height={44}
          decoding="async"
        />
        <h1 className="brand-title">{t("brand")}</h1>
      </div>

      <div className="wallet-cluster">
        {wallet.account && wallet.isBsc && (
          <div className="wallet-info pixel-card">
            <div className="wallet-info__toprow">
              <span className="wallet-info__addr mono">{wallet.shorten}</span>
              <button
                type="button"
                className="btn btn-outline wallet-info__disconnect"
                onClick={() => wallet.disconnect()}
              >
                {t("disconnect")}
              </button>
            </div>
            <span className="wallet-assets-label">{t("assetsLabel")}</span>
            {wallet.usdtBalance !== null && (
              <span className="usdt-pill">
                <span className="usdt-pill__k">{t("usdtBalance")}</span>
                <span className="usdt-pill__v">
                  {Number(wallet.usdtBalance).toLocaleString(undefined, {
                    maximumFractionDigits: 4,
                  })}
                </span>
              </span>
            )}
            {pendingBxaut.show && (
              <span className="wallet-pending-bxaut" aria-live="polite">
                {(() => {
                  const parts = t("pendingBxautLine").split("{count}");
                  const countStr =
                    pendingBxaut.displayTotal !== null
                      ? pendingBxaut.displayTotal.toLocaleString(
                          locale === "zh" ? "zh-CN" : "en-US",
                        )
                      : "…";
                  return (
                    <>
                      {parts[0]}
                      <span className="wallet-pending-bxaut__num">{countStr}</span>
                      {parts.slice(1).join("{count}")}
                    </>
                  );
                })()}
              </span>
            )}
            <MyNftsPopover wallet={wallet} />
          </div>
        )}
        {wallet.account && !wallet.isBsc && (
          <button
            type="button"
            className="btn btn-outline network-hint"
            onClick={() => void wallet.switchToBsc()}
          >
            {t("wrongNetwork")}
          </button>
        )}
        {wallet.account && !wallet.isBsc ? (
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => wallet.disconnect()}
          >
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
      </div>
    </header>
  );
}
