import { BrowserProvider, Contract } from "ethers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SHOVEL_NFT_ABI } from "../../config/abis";
import {
  BSC_CHAIN_ID,
  SHOVEL_MINT_DISPLAY_PROGRESS_ANCHOR_MS,
  SHOVEL_TIERS,
  estimatedXautPerMintFromFeeShare,
  tierPriceWei,
  type ShovelTier,
} from "../../config/constants";
import { displayShovelNftAddress } from "../../config/publicAddresses";
import { shovelTierImageSources } from "../../config/shovelTierArt";
import { requestShovelHoldingsRefresh } from "../../lib/shovelHoldingsRefresh";
import type { WalletApi } from "../../hooks/useWallet";
import { useI18n } from "../../i18n/I18nContext";
import { SafeImg } from "../SafeImg";

const SHOVEL_TIER_ART_SOURCES: Record<ShovelTier, readonly string[]> = {
  0: shovelTierImageSources(0),
  1: shovelTierImageSources(1),
  2: shovelTierImageSources(2),
};

const tierTitleKeys = {
  0: "tierIron",
  1: "tierSilver",
  2: "tierGold",
} as const;

function nftAddress() {
  return displayShovelNftAddress();
}

const MS_PER_HOUR = 3_600_000;

function chainMintPct(minted: number | undefined, max: number) {
  if (!max || minted === undefined) return 0;
  return Math.min(100, Math.round((1000 * minted) / max) / 10);
}

/** Simulated curve: iron +1%/h; silver & gold +1%/2h; capped at 60% (see anchor in constants). */
function simulatedMintDisplayPct(tier: ShovelTier, nowMs: number) {
  const elapsed = Math.max(0, nowMs - SHOVEL_MINT_DISPLAY_PROGRESS_ANCHOR_MS);
  const wholeHours = Math.floor(elapsed / MS_PER_HOUR);
  const base = tier === 0 ? 54 : tier === 1 ? 28 : 11;
  const increments =
    tier === 0 ? wholeHours : Math.floor(wholeHours / 2);
  return Math.min(60, base + increments);
}

/** Blends sim (below 60%) with on-chain %; from 60% onward follows real mints. */
function displayMintProgressPct(
  tier: ShovelTier,
  minted: number | undefined,
  max: number,
  nowMs: number,
) {
  const chain = chainMintPct(minted, max);
  const sim = simulatedMintDisplayPct(tier, nowMs);
  let display: number;
  if (chain >= 60) {
    display = chain;
  } else if (sim >= 60) {
    display = Math.max(60, chain);
  } else {
    display = Math.min(60, Math.max(sim, chain));
  }
  return Math.min(100, Math.round(display * 10) / 10);
}

/** Minted count shown in UI; matches `displayMintProgressPct` × max (FOMO curve). */
function displayMintedForMeter(
  tier: ShovelTier,
  minted: number | undefined,
  max: number,
  nowMs: number,
) {
  if (!max) return 0;
  const pct = displayMintProgressPct(tier, minted, max, nowMs);
  return Math.min(max, Math.max(0, Math.round((pct / 100) * max)));
}

const tierChipKeys = {
  0: "tierChipIron",
  1: "tierChipSilver",
  2: "tierChipGold",
} as const;

export function MintSection({ wallet }: { wallet: WalletApi }) {
  const { t, locale } = useI18n();
  const [status, setStatus] = useState<string | null>(null);
  /** Mobile quick-mint: default gold (rarest). */
  const [mobilePick, setMobilePick] = useState<ShovelTier>(2);
  const [onchain, setOnchain] = useState<
    Partial<Record<ShovelTier, { minted?: bigint; max?: bigint }>>
  >({});

  const addr = nftAddress();
  const sectionRef = useRef<HTMLElement>(null);
  const [mintInView, setMintInView] = useState(true);
  /** Wall-clock tick so the display-only mint meter advances hourly without waiting on RPC. */
  const [mintMeterTick, setMintMeterTick] = useState(0);

  const refreshOnchain = useCallback(async () => {
    if (!addr || !wallet.hasInjectedProvider || !window.ethereum) return;
    const browserProvider = new BrowserProvider(window.ethereum);
    const c = new Contract(addr, SHOVEL_NFT_ABI, browserProvider);
    const tiers = [0, 1, 2] as ShovelTier[];
    const pairs = await Promise.all(
      tiers.map(async (tier) => {
        try {
          const [max, minted] = await Promise.all([c.maxSupply(tier), c.totalMinted(tier)]);
          return [tier, { max, minted }] as const;
        } catch {
          return [tier, {}] as const;
        }
      }),
    );
    const next: Partial<Record<ShovelTier, { minted?: bigint; max?: bigint }>> = {};
    for (const [tier, data] of pairs) {
      next[tier] = data;
    }
    setOnchain(next);
  }, [addr, wallet.hasInjectedProvider]);

  useEffect(() => {
    void refreshOnchain();
  }, [refreshOnchain, wallet.chainId, wallet.account]);

  /** Tab back / foreground: some wallets throttle RPC while in background. */
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible" && wallet.chainId === BSC_CHAIN_ID) {
        void refreshOnchain();
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [refreshOnchain, wallet.chainId]);

  /** Throttle RPC when the mint block is off-screen (desktop long page). */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([e]) => setMintInView(Boolean(e?.isIntersecting)),
      { root: null, threshold: [0, 0.08, 0.25] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMintMeterTick((n) => n + 1);
    }, 60_000);
    return () => window.clearInterval(id);
  }, []);

  /** Poll totals on BSC; faster interval on narrow viewports and while mint is visible. */
  useEffect(() => {
    if (!wallet.hasInjectedProvider || wallet.chainId !== BSC_CHAIN_ID || !addr) {
      return;
    }
    const narrow =
      typeof window !== "undefined" && window.matchMedia("(max-width: 720px)").matches;
    const fast = narrow ? 3200 : 5500;
    const slow = 14_000;
    const intervalMs = mintInView ? fast : slow;
    const id = window.setInterval(() => {
      void refreshOnchain();
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [wallet.hasInjectedProvider, wallet.chainId, addr, refreshOnchain, mintInView]);

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
      requestShovelHoldingsRefresh();
      try {
        await refreshOnchain();
      } catch {
        /* RPC may lag right after inclusion; poll + delayed refresh below */
      }
      window.setTimeout(() => {
        void refreshOnchain();
        requestShovelHoldingsRefresh();
      }, 1200);
    } catch (e) {
      setStatus(e instanceof Error ? e.message : String(e));
    }
  };

  const pickMeta = SHOVEL_TIERS[mobilePick];
  const pickO = onchain[mobilePick];
  const pickMinted =
    pickO?.minted !== undefined ? Number(pickO.minted) : undefined;
  const pickMax =
    pickO?.max !== undefined ? Number(pickO.max) : pickMeta.supply;
  const pickSoldOut =
    pickMinted !== undefined &&
    pickMax !== undefined &&
    pickMinted >= pickMax;

  const nowMs = useMemo(() => Date.now(), [mintMeterTick]);
  const pickDisplayMinted = displayMintedForMeter(
    mobilePick,
    pickMinted,
    pickMax,
    nowMs,
  );

  return (
    <section
      ref={sectionRef}
      id="mint"
      className="section mint-section section--meme pixel-frame"
    >
      <div className="section-head">
        <h2 className="section-title">{t("mintTitle")}</h2>
        <p className="mint-theme">{t("mintTheme")}</p>
        <p className="section-note mint-rarity-note">{t("rarityNote")}</p>
      </div>

      <div className="meme-rail meme-rail--mint" aria-hidden>
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
          const pct = displayMintProgressPct(tier, minted, max, nowMs);
          const displayMinted = displayMintedForMeter(tier, minted, max, nowMs);

          return (
            <article
              key={tier}
              className={`tier-card equip-card equip-card--${meta.key}`}
              data-tier={tier}
            >
              <div className="equip-card__shine" aria-hidden />
              <div className="equip-card__corners" aria-hidden />
              <div className="tier-art-wrap">
                <SafeImg
                  sources={SHOVEL_TIER_ART_SOURCES[tier]}
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
                  <span className="mint-meter__frac">
                    {displayMinted} / {max}
                  </span>
                </div>
                <div className="mint-meter__track">
                  <div
                    className="mint-meter__fill mint-meter__fill--yellow"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <dl className="tier-stats">
                <div>
                  <dt>{t("price")}</dt>
                  <dd className="tier-stats__value tier-stats__value--price">
                    {meta.priceUsdt} USDT
                  </dd>
                </div>
                <div>
                  <dt>{t("supply")}</dt>
                  <dd className="tier-stats__value tier-stats__value--supply">
                    {displayMinted} / {max}
                  </dd>
                </div>
              </dl>
              <p className="tier-xaut-estimate" role="note">
                {(() => {
                  const n = estimatedXautPerMintFromFeeShare(meta.feeSharePercent);
                  const fmt = n.toLocaleString(locale === "zh" ? "zh-CN" : "en-US");
                  const parts = t("tierXautEstimate").split("{count}");
                  return (
                    <>
                      {parts[0]}
                      <span className="tier-xaut-estimate__num">{fmt}</span>
                      {parts.slice(1).join("{count}")}
                    </>
                  );
                })()}
              </p>
              <p className="tier-fee" role="note">
                <span className="tier-fee-label">{t("feeShareLabel")}</span>
                <span className="tier-fee-value">
                  <span className="tier-fee-num">{meta.feeSharePercent}</span>
                  <span className="tier-fee-pct">%</span>
                </span>
              </p>
              <button
                type="button"
                className="btn btn-gold btn-block equip-action equip-action--card"
                disabled={!wallet.account || !wallet.isBsc || soldOut}
                onClick={() => void mint(tier)}
              >
                {soldOut ? t("soldOut") : t("mintCta")}
              </button>
            </article>
          );
        })}
      </div>

      <div className="mint-mobile-cta">
        <p className="mint-mobile-cta__hint">{t("mintMobilePick")}</p>
        <div className="mint-tier-chips" role="tablist" aria-label={t("mintMobilePick")}>
          {([2, 1, 0] as ShovelTier[]).map((tier) => {
            const k = SHOVEL_TIERS[tier].key;
            return (
              <button
                key={tier}
                type="button"
                role="tab"
                aria-selected={mobilePick === tier}
                className={`mint-tier-chip mint-tier-chip--${k}${mobilePick === tier ? " is-selected" : ""}`}
                onClick={() => setMobilePick(tier)}
              >
                {t(tierChipKeys[tier])}
              </button>
            );
          })}
        </div>
        <p className="mint-mobile-cta__summary">
          <span className="mint-mobile-cta__price">{pickMeta.priceUsdt} USDT</span>
          <span className="mint-mobile-cta__sep" aria-hidden>
            ·
          </span>
          <span className="mint-mobile-cta__frac mono">
            {pickDisplayMinted} / {pickMax}
          </span>
          {pickSoldOut ? (
            <span className="mint-mobile-cta__badge">{t("soldOut")}</span>
          ) : null}
        </p>
        <button
          type="button"
          className="btn btn-gold mint-mobile-primary"
          disabled={!wallet.account || !wallet.isBsc || pickSoldOut}
          onClick={() => void mint(mobilePick)}
        >
          {pickSoldOut ? t("soldOut") : t("mintPrimaryCta")}
        </button>
      </div>
    </section>
  );
}
