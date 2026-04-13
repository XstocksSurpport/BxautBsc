/** Dispatched after a successful mint so header totals refetch without waiting for the poll interval. */
export const SHOVEL_HOLDINGS_REFRESH_EVENT = "bxaut:shovel-holdings-refresh";

export function requestShovelHoldingsRefresh(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(SHOVEL_HOLDINGS_REFRESH_EVENT));
}
