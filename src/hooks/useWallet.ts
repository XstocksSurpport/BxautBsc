import {
  BrowserProvider,
  Contract,
  formatUnits,
  getAddress,
  JsonRpcProvider,
} from "ethers";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ERC20_ABI } from "../config/abis";
import {
  BSC_CHAIN_ID,
  BSC_NETWORK_PARAMS,
  BSC_PUBLIC_HTTP_RPC,
  BSC_USDT_ADDRESS,
} from "../config/constants";

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      removeListener?: (
        event: string,
        handler: (...args: unknown[]) => void,
      ) => void;
    };
  }
}

function shortenAddress(addr: string) {
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function sleep(ms: number) {
  return new Promise<void>((r) => {
    window.setTimeout(r, ms);
  });
}

async function ensureBsc(ethereum: NonNullable<Window["ethereum"]>) {
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: BSC_NETWORK_PARAMS.chainId }],
    });
  } catch (err: unknown) {
    const code =
      err && typeof err === "object" && "code" in err
        ? (err as { code?: number }).code
        : undefined;
    if (code === 4902) {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: BSC_NETWORK_PARAMS.chainId,
            chainName: BSC_NETWORK_PARAMS.chainName,
            nativeCurrency: BSC_NETWORK_PARAMS.nativeCurrency,
            rpcUrls: [...BSC_NETWORK_PARAMS.rpcUrls],
            blockExplorerUrls: [...BSC_NETWORK_PARAMS.blockExplorerUrls],
          },
        ],
      });
      return;
    }
    throw err;
  }
}

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoSwitchConsumed = useRef(false);

  const bscReadProvider = useMemo(
    () => new JsonRpcProvider(BSC_PUBLIC_HTTP_RPC, BSC_CHAIN_ID),
    [],
  );

  const refreshUsdt = useCallback(async () => {
    if (!account || chainId !== BSC_CHAIN_ID) {
      setUsdtBalance(null);
      return;
    }
    const owner = getAddress(account);
    const usdt = new Contract(BSC_USDT_ADDRESS, ERC20_ABI, bscReadProvider);
    const raw = await usdt.balanceOf(owner);
    let decimals = 18;
    try {
      decimals = Number(await usdt.decimals());
    } catch {
      decimals = 18;
    }
    setUsdtBalance(formatUnits(raw, decimals));
  }, [bscReadProvider, account, chainId]);

  const readChainAndAccount = useCallback(async () => {
    if (!window.ethereum) return;
    const cidHex = (await window.ethereum.request({
      method: "eth_chainId",
    })) as string;
    setChainId(Number.parseInt(cidHex, 16));
    const accounts = (await window.ethereum.request({
      method: "eth_accounts",
    })) as string[];
    setAccount(accounts[0] ?? null);
  }, []);

  useEffect(() => {
    void readChainAndAccount();
  }, [readChainAndAccount]);

  useEffect(() => {
    const eth = window.ethereum;
    if (!eth?.on) return;

    const onAccounts = (accs: unknown) => {
      const list = accs as string[];
      setAccount(list[0] ?? null);
      autoSwitchConsumed.current = false;
    };
    const onChain = (hex: unknown) => {
      setChainId(Number.parseInt(String(hex), 16));
    };

    eth.on("accountsChanged", onAccounts);
    eth.on("chainChanged", onChain);
    return () => {
      eth.removeListener?.("accountsChanged", onAccounts);
      eth.removeListener?.("chainChanged", onChain);
    };
  }, []);

  useEffect(() => {
    void refreshUsdt();
  }, [refreshUsdt]);

  const switchToBsc = useCallback(async () => {
    if (!window.ethereum) return;
    await ensureBsc(window.ethereum);
    await readChainAndAccount();
  }, [readChainAndAccount]);

  const connect = useCallback(async () => {
    setError(null);
    if (!window.ethereum) {
      setError(
        "No EVM wallet detected. Install MetaMask or a compatible wallet.",
      );
      return;
    }
    setBusy(true);
    try {
      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      const addr = accounts[0];
      if (!addr) throw new Error("No account returned");
      await ensureBsc(window.ethereum);
      setAccount(addr);
      const cidHex = (await window.ethereum.request({
        method: "eth_chainId",
      })) as string;
      setChainId(Number.parseInt(cidHex, 16));
      autoSwitchConsumed.current = true;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (!account || !window.ethereum) return;
    if (chainId === BSC_CHAIN_ID) return;
    if (autoSwitchConsumed.current) return;
    autoSwitchConsumed.current = true;
    void (async () => {
      try {
        await ensureBsc(window.ethereum!);
        await readChainAndAccount();
      } catch {
        /* user may reject */
      }
    })();
  }, [account, chainId, readChainAndAccount]);

  const disconnect = useCallback(() => {
    setAccount(null);
    setUsdtBalance(null);
    setChainId(null);
    autoSwitchConsumed.current = false;
  }, []);

  return {
    account,
    chainId,
    isBsc: chainId === BSC_CHAIN_ID,
    usdtBalance,
    busy,
    error,
    connect,
    disconnect,
    switchToBsc,
    shorten: account ? shortenAddress(account) : "",
    refreshUsdt,
    hasInjectedProvider: Boolean(window.ethereum),
    /**
     * Approve exactly `minAmount` for this spend (not unlimited).
     * Reads `allowance` via public BSC RPC — wallet RPC often fails `eth_call` on mobile (missing revert data).
     * BSC USDT is standard ERC20: one `approve(spender, amount)` is enough (no approve(0) first — that caused double popups / “cancel first” confusion).
     */
    approveUsdt: async (spender: string, minAmount: bigint) => {
      if (!window.ethereum || !account) throw new Error("Wallet not ready");
      if (chainId !== BSC_CHAIN_ID) throw new Error("Switch to BNB Smart Chain first");
      const browserProvider = new BrowserProvider(window.ethereum);
      const signer = await browserProvider.getSigner();
      const usdtWrite = new Contract(BSC_USDT_ADDRESS, ERC20_ABI, signer);
      const owner = getAddress(account);
      const spenderCs = getAddress(spender);
      const usdtRead = new Contract(BSC_USDT_ADDRESS, ERC20_ABI, bscReadProvider);

      let current = 0n;
      let lastErr: unknown;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          current = await usdtRead.allowance(owner, spenderCs);
          lastErr = undefined;
          break;
        } catch (e) {
          lastErr = e;
          await sleep(120 * (attempt + 1));
        }
      }
      if (lastErr !== undefined) {
        try {
          current = await usdtWrite.allowance(owner, spenderCs);
        } catch (e2) {
          const a = e2 instanceof Error ? e2.message : String(e2);
          const b = lastErr instanceof Error ? lastErr.message : String(lastErr);
          throw new Error(`USDT allowance check failed: ${a} (public RPC: ${b})`);
        }
      }
      if (current >= minAmount) return null;
      const tx = await usdtWrite.approve(spenderCs, minAmount);
      return tx;
    },
  };
}

export type WalletApi = ReturnType<typeof useWallet>;
