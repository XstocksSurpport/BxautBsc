import { BrowserProvider } from "ethers";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { displayShovelNftAddress } from "../config/publicAddresses";
import { publicAsset } from "../config/publicPath";
import type { WalletApi } from "../hooks/useWallet";
import { useI18n } from "../i18n/I18nContext";
import { loadOwnedShovelNfts, type OwnedNftDisplay } from "../lib/ownedShovelNfts";

function fallbackShovelImage(tokenId: number): string {
  if (tokenId >= 1 && tokenId <= 666) return publicAsset("nft/iron-shovel.jpg");
  if (tokenId >= 667 && tokenId <= 777) return publicAsset("nft/silver-shovel.jpg");
  return publicAsset("nft/gold-shovel.jpg");
}

export function MyNftsPopover({ wallet }: { wallet: WalletApi }) {
  const { t } = useI18n();
  const titleId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<OwnedNftDisplay[]>([]);

  const addr = displayShovelNftAddress();

  const load = useCallback(async () => {
    if (!wallet.account || !window.ethereum) return;
    setLoading(true);
    setError(null);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const list = await loadOwnedShovelNfts(provider, addr, wallet.account);
      setItems(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [addr, wallet.account]);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const el = rootRef.current;
      if (el && !el.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  if (!wallet.account || !wallet.isBsc) return null;

  return (
    <div className="my-nfts-wrap" ref={rootRef}>
      <button
        type="button"
        className="btn btn-outline btn-my-nfts"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={open ? titleId : undefined}
      >
        {t("myNfts")}
      </button>
      {open && (
        <div className="my-nfts-popover pixel-frame" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <div className="my-nfts-popover-head">
            <h2 id={titleId} className="my-nfts-title">
              {t("myNfts")}
            </h2>
            <button type="button" className="btn btn-ghost my-nfts-close" onClick={() => setOpen(false)}>
              {t("myNftsClose")}
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
                    <img
                      className="my-nfts-thumb"
                      src={it.image || fallbackShovelImage(it.tokenId)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <p className="my-nfts-name">{it.name}</p>
                  <p className="my-nfts-id mono">#{it.tokenId}</p>
                </li>
              ))}
            </ul>
          )}
          <p className="my-nfts-footnote">{t("myNftsFootnote")}</p>
        </div>
      )}
    </div>
  );
}
