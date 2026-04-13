import { BrowserProvider } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { sumEstimatedBxautForOwnedShovelIds } from "../config/constants";
import { displayShovelNftAddress } from "../config/publicAddresses";
import { loadOwnedShovelTokenIds } from "../lib/ownedShovelNfts";
import { SHOVEL_HOLDINGS_REFRESH_EVENT } from "../lib/shovelHoldingsRefresh";
import type { WalletApi } from "./useWallet";

const POLL_MS = 12_000;

export function usePendingBxautFromShovels(wallet: WalletApi) {
  const addr = displayShovelNftAddress();
  const [displayTotal, setDisplayTotal] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTotals = useCallback(async () => {
    if (!wallet.account || !wallet.isBsc || !window.ethereum) {
      setDisplayTotal(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const ids = await loadOwnedShovelTokenIds(provider, addr, wallet.account);
      setDisplayTotal(sumEstimatedBxautForOwnedShovelIds(ids));
    } catch (e) {
      console.warn("usePendingBxautFromShovels", e);
    } finally {
      setIsLoading(false);
    }
  }, [addr, wallet.account, wallet.isBsc]);

  useEffect(() => {
    void fetchTotals();
  }, [fetchTotals]);

  useEffect(() => {
    if (!wallet.account || !wallet.isBsc) return;
    const id = window.setInterval(() => void fetchTotals(), POLL_MS);
    return () => window.clearInterval(id);
  }, [fetchTotals, wallet.account, wallet.isBsc]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "visible") void fetchTotals();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [fetchTotals]);

  useEffect(() => {
    const onRefresh = () => void fetchTotals();
    window.addEventListener(SHOVEL_HOLDINGS_REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(SHOVEL_HOLDINGS_REFRESH_EVENT, onRefresh);
  }, [fetchTotals]);

  const show =
    Boolean(wallet.account && wallet.isBsc) && (displayTotal !== null || isLoading);

  return { show, isLoading, displayTotal };
}
