import { BrowserProvider, Contract, formatUnits } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { DIVIDEND_ABI } from "../../config/abis";
import { displayDividendDistributorAddress } from "../../config/publicAddresses";
import type { WalletApi } from "../../hooks/useWallet";
import { useI18n } from "../../i18n/I18nContext";
import { ContractAddressList } from "../ContractAddressList";
import { FaqModule } from "./FaqModule";
import { GovernanceModule } from "./GovernanceModule";
import { StakingModule } from "./StakingModule";
import { TokenomicsBlock } from "./TokenomicsBlock";

function distributorAddress() {
  return displayDividendDistributorAddress();
}

export function DividendSection({ wallet }: { wallet: WalletApi }) {
  const { t } = useI18n();
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const dist = distributorAddress();

  const refreshPending = useCallback(async () => {
    if (!dist || !wallet.account || !wallet.isBsc || !window.ethereum) {
      setPending(null);
      return;
    }
    try {
      const browserProvider = new BrowserProvider(window.ethereum);
      const c = new Contract(dist, DIVIDEND_ABI, browserProvider);
      const raw = await c.pendingReward(wallet.account);
      setPending(formatUnits(raw, 18));
    } catch {
      setPending(null);
    }
  }, [dist, wallet.account, wallet.isBsc]);

  useEffect(() => {
    void refreshPending();
  }, [refreshPending]);

  const claim = async () => {
    setMsg(null);
    if (!wallet.account || !wallet.isBsc) {
      setMsg(t("connectFirst"));
      return;
    }
    if (!window.ethereum) {
      return;
    }
    try {
      setMsg(t("txPending"));
      const browserProvider = new BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const c = new Contract(dist, DIVIDEND_ABI, signer);
      const tx = await c.claim();
      await tx.wait();
      setMsg(t("mintSuccess"));
      await refreshPending();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
    }
  };

  const networkLabel =
    wallet.account && wallet.isBsc ? "BSC" : t("panelOffline");
  const pendingDisplay =
    pending !== null
      ? Number(pending).toLocaleString(undefined, { maximumFractionDigits: 6 })
      : "—";

  return (
    <section id="dividend" className="section dividend-section section--meme pixel-frame">
      <div className="hud-panel">
        <div className="hud-panel__chrome">
          <span className="hud-panel__tag">Bxaut</span>
          <span className="hud-panel__dots" aria-hidden />
        </div>
        <p className="hud-panel__ribbon">{t("revenuePanel")}</p>
        <h2 className="section-title hud-panel__title">{t("dividendTitle")}</h2>

        <div className="hud-grid">
          <div className="hud-tile">
            <span className="hud-tile__label">{t("pendingRewards")}</span>
            <span className="hud-tile__value mono">{pendingDisplay}</span>
          </div>
          <div className="hud-tile">
            <span className="hud-tile__label">{t("panelNetwork")}</span>
            <span className="hud-tile__value hud-tile__value--dim">{networkLabel}</span>
          </div>
        </div>

        <ContractAddressList />

        {msg && <p className="tx-status hud-panel__msg">{msg}</p>}

        <button
          type="button"
          className="btn btn-gold hud-claim"
          disabled={!wallet.account || !wallet.isBsc}
          onClick={() => void claim()}
        >
          {t("claim")}
        </button>
      </div>

      <TokenomicsBlock />
      <div className="submodule-pair">
        <StakingModule />
        <GovernanceModule />
      </div>
      <FaqModule />
    </section>
  );
}
