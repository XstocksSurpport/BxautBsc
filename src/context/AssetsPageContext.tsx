import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMobileTab } from "../mobile/MobileTabContext";

type AssetsPageContextValue = {
  open: boolean;
  openAssets: () => void;
  closeAssets: () => void;
};

const AssetsPageContext = createContext<AssetsPageContextValue | null>(null);

export function AssetsPageProvider({ children }: { children: ReactNode }) {
  const { isPager, setActiveTab } = useMobileTab();
  const [open, setOpen] = useState(false);

  const openAssets = useCallback(() => setOpen(true), []);

  const closeAssets = useCallback(() => {
    setOpen(false);
    if (isPager) setActiveTab("home");
  }, [isPager, setActiveTab]);

  const value = useMemo(
    () => ({ open, openAssets, closeAssets }),
    [open, openAssets, closeAssets],
  );

  return (
    <AssetsPageContext.Provider value={value}>{children}</AssetsPageContext.Provider>
  );
}

export function useAssetsPage() {
  const ctx = useContext(AssetsPageContext);
  if (!ctx) throw new Error("useAssetsPage must be used within AssetsPageProvider");
  return ctx;
}
