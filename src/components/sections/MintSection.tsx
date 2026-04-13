import { BrowserProvider, Contract } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { SHOVEL_NFT_ABI } from "../../config/abis";
import { SHOVEL_TIERS, tierPriceWei, type ShovelTier } from "../../config/constants";
import { displayShovelNftAddress } from "../../config/publicAddresses";
import { publicAsset } from "../../config/publicPath";
import type { WalletApi } from "../../hooks/useWallet";
import { useI18n } from "../../i18n/I18nContext";

const tierImages: Record<ShovelTier, string> = {
  0: publicAsset("nft/iron-shovel.jpg"),
  1: publicAsset("nft/silver-shovel.jpg"),
  2: publicAsset("nft/gold-shovel.jpg"),
};

const tierTitleKeys = {
  0: "tierIron",
  1: "tierSilver",
  2: "tierGold",
} as const;

function nftAddress() {
  return displayShovelNftAddress();
}

function mintPct(minted: number | undefined, max: number) {
  if (!max || minted === undefined) return 0;
  return Math.min(100, Math.round((1000 * minted) / max) / 10);
}

export function MintSection({ wallet }: { wallet: WalletApi }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<string | null>(null);
  const [onchain, setOnchain] = useState<
    Partial<Record<ShovelTier, { minted?: bigint; max?: bigint }>>
  >({});

  const addr = nftAddress();

  const refreshOnchain = useCallback(async () => {
    if (!addr || !wallet.hasInjectedProvider || !window.ethereum) return;
    const browserProvider = new BrowserProvider(window.ethereum);
    const c = new Contract(addr, SHOVEL_NFT_ABI, browserProvider);
    const next: Partial<Record<ShovelTier, { minted?: bigint; max?: bigint }>> =
      {};
    for (const tier of [0, 1, 2] as ShovelTier[]) {
      try {
        const max = await c.maxSupply(tier);
        const minted = await c.totalMinted(tier);
        next[tier] = { max, minted };
      } catch {
        next[tier] = {};
      }
    }
    setOnchain(next);
  }, [addr, wallet.hasInjectedProvider]);

  useEffect(() => {
    void refreshOnchain();
  }, [refreshOnchain, wallet.chainId, wallet.account]);

  const mint = async (tier: ShovelTier) => {
    setStatus(null);
    if (!wallet.account || !wallet.isBsc) {
      setStatus(t("connectFirst"));
      return;
    }
    if (!window.ethereum) return;

    const browserProvider = new BrowserProvider(window.ethereum);
    const signer = await browserProvider.getSigner();
    const nft = new Contract(addr, SHOVEL_NFT_ABI, signer);
    const price = tierPriceWei(tier);

    try {
      setStatus(t("txPending"));
      const approveTx = await wallet.approveUsdt(addr, price);
      if (approveTx) await approveTx.wait();
      const tx = await nft.mint(tier);
      await tx.wait();
      setStatus(t("mintSuccess"));
      await wallet.refreshUsdt();
      await refreshOnchain();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    }
  };

  return (
    <section id="mint" className="section mint-section section--meme pixel-frame">
      <div className="section-head">
        <h2 className="section-title">{t("mintTitle")}</h2>
        <p className="mint-theme">{t("mintTheme")}</p>
        <p className="section-note mint-rarity-note">{t("rarityNote")}</p>
        <p className="section-note mint-safety-note" role="note">
          {t("mintWalletSafetyNote")}
        </p>
      </div>

      <div className="meme-rail" aria-hidden>
        <span className="meme-pill meme-pill--pink">{t("memePillGm")}</span>
        <span className="meme-pill meme-pill--cyan">{t("memePillWagmi")}</span>
        <span className="meme-pill meme-pill--gold">{t("memePillLfg")}</span>
        <span className="meme-pill meme-pill--violet">{t("memePillYolo")}</span>
        <span className="meme-pill meme-pill--lime">{t("memePillDegen")}</span>
      </div>

      {status && <p className="tx-status">{status}</p>}

      <div className="tier-grid">
        {([0, 1, 2] as ShovelTier[]).map((tier) => {
          const meta = SHOVEL_TIERS[tier];
          const o = onchain[tier];
          const minted =
            o?.minted !== undefined ? Number(o.minted) : undefined;
          const max = o?.max !== undefined ? Number(o.max) : meta.supply;
          const soldOut =
            minted !== undefined && max !== undefined && minted >= max;
          const pct = mintPct(minted, max);

          return (
            <article
              key={tier}
              className={`tier-card equip-card equip-card--${meta.key}`}
              data-tier={tier}
            >
              <div className="equip-card__shine" aria-hidden />
              <div className="equip-card__corners" aria-hidden />
              <div className="tier-art-wrap">
                <img
                  src={tierImages[tier]}
                  alt=""
                  className="tier-art"
                  loading="lazy"
                />
              </div>
              <div className="equip-card__titlerow">
                <span className={`equip-rarity equip-rarity--${meta.key}`} />
                <h3 className="tier-name">{t(tierTitleKeys[tier])}</h3>
              </div>

              <div
                className="mint-meter"
                role="group"
                aria-label={t("mintProgress")}
              >
                <div className="mint-meter__head">
                  <span className="mint-meter__label">{t("mintProgress")}</span>
                  <span className="mint-meter__frac mono">
                    {minted !== undefined ? minted : "—"} / {max}
                  </span>
                </div>
                <div className="mint-meter__track">
                  <div
                    className={`mint-meter__fill mint-meter__fill--${meta.key}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <dl className="tier-stats">
                <div>
                  <dt>{t("price")}</dt>
                  <dd>{meta.priceUsdt} USDT</dd>
                </div>
                <div>
                  <dt>{t("supply")}</dt>
                  <dd>
                    {minted !== undefined ? `${minted} / ` : ""}
                    {max}
                  </dd>
                </div>
              </dl>
              <p className="tier-fee" role="note">
                <span className="tier-fee-label">{t("feeShareLabel")}</span>
                <span className="tier-fee-value">
                  <span className="tier-fee-num">{meta.feeSharePercent}</span>
                  <span className="tier-fee-pct">%</span>
                </span>
              </p>
              <button
                type="button"
                className="btn btn-gold btn-block equip-action"
                disabled={!wallet.account || !wallet.isBsc || soldOut}
                onClick={() => void mint(tier)}
              >
                {soldOut ? t("soldOut") : t("mintCta")}
              </button>
            </article>
          );
        })}
      </div>

    </section>
  );
}
