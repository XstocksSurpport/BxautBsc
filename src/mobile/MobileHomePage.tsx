import type { WalletApi } from "../hooks/useWallet";
import { useI18n } from "../i18n/I18nContext";
import { useMobileTab } from "./MobileTabContext";

export function MobileHomePage({ wallet }: { wallet: WalletApi }) {
  const { t } = useI18n();
  const { setActiveTab } = useMobileTab();

  return (
    <div className="mobile-page mobile-page--home section pixel-frame">
      <h2 className="section-title">{t("brand")}</h2>
      <p className="section-lead mobile-home-lead">{t("mobileHomeLead")}</p>
      <div className="mobile-home-actions">
        <button
          type="button"
          className="btn btn-gold btn-block mobile-home-primary"
          onClick={() => setActiveTab("mint")}
        >
          {t("navMint")}
        </button>
        {!wallet.account ? (
          <p className="mobile-home-hint muted">{t("connectFirst")}</p>
        ) : null}
      </div>
    </div>
  );
}
