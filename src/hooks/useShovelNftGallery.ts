import { BrowserProvider } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { displayShovelNftAddress } from "../config/publicAddresses";
import type { WalletApi } from "./useWallet";
import { loadOwnedShovelNfts, type OwnedNftDisplay } from "../lib/ownedShovelNfts";

export function useShovelNftGallery(wallet: WalletApi, active: boolean) {
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
    if (!active || !wallet.account || !wallet.isBsc) return;
    void load();
  }, [active, load, wallet.account, wallet.isBsc]);

  return { items, loading, error, reload: load };
}
