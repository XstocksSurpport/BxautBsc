import { useCallback, useState } from "react";
import {
  displayBxautAddress,
  displayDividendDistributorAddress,
  displayShovelNftAddress,
  displayTreasuryAddress,
  displayXautAddress,
} from "../config/publicAddresses";
import { useI18n } from "../i18n/I18nContext";

type Row = {
  labelKey:
    | "addrLabelBxaut"
    | "addrLabelNft"
    | "addrLabelXaut"
    | "addrLabelTreasury"
    | "addrLabelDividend";
  value: string;
};

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

export function ContractAddressList() {
  const { t } = useI18n();
  const [copied, setCopied] = useState<string | null>(null);

  const rows: Row[] = [
    { labelKey: "addrLabelBxaut", value: displayBxautAddress() },
    { labelKey: "addrLabelNft", value: displayShovelNftAddress() },
    { labelKey: "addrLabelXaut", value: displayXautAddress() },
    { labelKey: "addrLabelTreasury", value: displayTreasuryAddress() },
    { labelKey: "addrLabelDividend", value: displayDividendDistributorAddress() },
  ];

  const onCopy = useCallback(async (value: string) => {
    const ok = await copyText(value);
    if (ok) {
      setCopied(value);
      window.setTimeout(() => setCopied((c) => (c === value ? null : c)), 2000);
    }
  }, []);

  return (
    <div className="hud-contract-list" aria-label={t("contractAddressBlockAria")}>
      <p className="hud-contract-list__ribbon">{t("contractAddressRibbon")}</p>
      <ul className="hud-contract-list__rows">
        {rows.map((row) => (
          <li key={row.labelKey} className="hud-contract-row">
            <span className="hud-contract-row__label">{t(row.labelKey)}</span>
            <code className="hud-contract-row__addr mono" title={row.value}>
              {row.value}
            </code>
            <button
              type="button"
              className="btn addr-copy-btn"
              aria-label={t("copyAddress")}
              onClick={() => void onCopy(row.value)}
            >
              {copied === row.value ? t("addressCopied") : t("copyAddressShort")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
