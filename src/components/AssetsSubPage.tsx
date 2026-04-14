import { useMemo } from "react";
import { mediaUrlFallbackChain } from "../config/publicPath";
import { shovelSourcesForTokenId } from "../config/shovelTierArt";
import { usePendingBxautFromShovels } from "../hooks/usePendingBxautFromShovels";
import { useShovelNftGallery } from "../hooks/useShovelNftGallery";
import type { WalletApi } from "../hooks/useWallet";
import { useI18n } from "../i18n/I18nContext";
import { SafeImg } from "./SafeImg";

function NftThumb({ image, tokenId }: { image: string; tokenId: number }) {
  const sources = useMemo(
    () => [...(image ? mediaUrlFallbackChain(image) : []), ...shovelSourcesForTokenId(tokenId)],
    [image, tokenId],
  );
  return <SafeImg className="my-nfts-thumb" sources={sources} alt="" />;
}

export function AssetsSubPage({
  wallet,
  onBack,
}: {
  wallet: WalletApi;
  onBack: () => void;
}) {
  const { t, locale } = useI18n();
  const pendingBxaut = usePendingBxautFromShovels(wallet);
  const { items, loading, error, reload } = useShovelNftGallery(
    wallet,
    Boolean(wallet.account && wallet.isBsc),
  );

  return (
    <div className="assets-sub-page pixel-frame">
      <div className="assets-sub-page__toolbar">
        <button type="button" className="btn btn-gold assets-sub-page__back" onClick={onBack}>
          {t("backToHome")}
        </button>
      </div>

      {!wallet.account ? (
        <p className="assets-sub-page__hint">{t("assetsConnectHint")}</p>
      ) : !wallet.isBsc ? (
        <div className="assets-sub-page__actions">
          <p className="assets-sub-page__hint">{t("assetsWrongNetworkHint")}</p>
          <button type="button" className="btn btn-outline" onClick={() => void wallet.switchToBsc()}>
            {t("wrongNetwork")}
          </button>
          <button type="button" className="btn btn-outline" onClick={() => wallet.disconnect()}>
            {t("disconnect")}
          </button>
        </div>
      ) : (
        <>
          <div className="assets-sub-page__head pixel-card">
            <span className="assets-sub-page__addr mono">{wallet.shorten}</span>
            <button
              type="button"
              className="btn btn-outline assets-sub-page__disconnect"
              onClick={() => wallet.disconnect()}
            >
              {t("disconnect")}
            </button>
          </div>

          <span className="wallet-assets-label assets-sub-page__label">{t("assetsLabel")}</span>
          {wallet.usdtBalance !== null && (
            <span className="usdt-pill assets-sub-page__pill">
              <span className="usdt-pill__k">{t("usdtBalance")}</span>
              <span className="usdt-pill__v">
                {Number(wallet.usdtBalance).toLocaleString(undefined, {
                  maximumFractionDigits: 4,
                })}
              </span>
            </span>
          )}
          {pendingBxaut.show && (
            <span className="wallet-pending-bxaut assets-sub-page__pending" aria-live="polite">
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

          <div className="assets-sub-page__nfts">
            <div className="assets-sub-page__nfts-head">
              <h2 className="assets-sub-page__nfts-title">{t("myNfts")}</h2>
              <button
                type="button"
                className="btn btn-outline assets-sub-page__refresh"
                onClick={() => void reload()}
              >
                {t("assetsRefreshNfts")}
              </button>
            </div>
            {loading && <p className="my-nfts-status">{t("myNftsLoading")}</p>}
            {error && <p className="my-nfts-error">{error}</p>}
            {!loading && !error && items.length === 0 && (
              <p className="my-nfts-status">{t("myNftsEmpty")}</p>
            )}
            {!loading && items.length > 0 && (
              <ul className="my-nfts-grid">
                {items.map((it) => (
                  <li key={it.tokenId} className="my-nfts-card pixel-frame">
                    <div className="my-nfts-thumb-wrap">
                      <NftThumb image={it.image} tokenId={it.tokenId} />
                    </div>
                    <p className="my-nfts-name">{it.name}</p>
                    <p className="my-nfts-id mono">#{it.tokenId}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
