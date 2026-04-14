import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export const MOBILE_TAB_ORDER = [
  "home",
  "mint",
  "dividend",
  "community",
  "market",
  "tokenomics",
  "staking",
  "governance",
  "faq",
] as const;

export type MobileTabId = (typeof MOBILE_TAB_ORDER)[number];

function tabIndex(id: MobileTabId): number {
  const i = MOBILE_TAB_ORDER.indexOf(id);
  return i >= 0 ? i : 0;
}

type MobileTabContextValue = {
  activeTab: MobileTabId;
  setActiveTab: (id: MobileTabId) => void;
  tabIndex: number;
  isPager: boolean;
};

const MobileTabContext = createContext<MobileTabContextValue | null>(null);

const MQ = "(max-width: 720px)";

export function MobileTabProvider({ children }: { children: ReactNode }) {
  const [isPager, setIsPager] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MQ).matches : false,
  );
  const [activeTab, setActiveTabState] = useState<MobileTabId>("home");

  useEffect(() => {
    const mq = window.matchMedia(MQ);
    const onChange = () => setIsPager(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const setActiveTab = useCallback((id: MobileTabId) => {
    setActiveTabState(id);
  }, []);

  const idx = useMemo(() => tabIndex(activeTab), [activeTab]);

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      tabIndex: idx,
      isPager,
    }),
    [activeTab, setActiveTab, idx, isPager],
  );

  return (
    <MobileTabContext.Provider value={value}>{children}</MobileTabContext.Provider>
  );
}

export function useMobileTab() {
  const ctx = useContext(MobileTabContext);
  if (!ctx) throw new Error("useMobileTab must be used within MobileTabProvider");
  return ctx;
}

export { tabIndex as mobileTabIndex };
