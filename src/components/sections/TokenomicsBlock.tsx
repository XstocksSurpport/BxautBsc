import { useI18n } from "../../i18n/I18nContext";

function TokPctCell({ pct }: { pct: string }) {
  const i = pct.indexOf("%");
  const num = i >= 0 ? pct.slice(0, i) : pct;
  const hasPct = i >= 0;
  return (
    <span className="tok-table-figures tok-table-figures--pct">
      <span className="tok-table-num">{num}</span>
      {hasPct ? <span className="tok-table-pctsym">%</span> : null}
    </span>
  );
}

const DIST_ROWS: readonly {
  pct: string;
  amt: string;
  name: "tokR1n" | "tokR2n" | "tokR3n" | "tokR4n" | "tokR5n" | "tokR6n";
  vest: "tokR1v" | "tokR2v" | "tokR3v" | "tokR4v" | "tokR5v" | "tokR6v";
}[] = [
  { pct: "60%", amt: "12,600,000", name: "tokR1n", vest: "tokR1v" },
  { pct: "15%", amt: "3,150,000", name: "tokR2n", vest: "tokR2v" },
  { pct: "10%", amt: "2,100,000", name: "tokR3n", vest: "tokR3v" },
  { pct: "5%", amt: "1,050,000", name: "tokR4n", vest: "tokR4v" },
  { pct: "5%", amt: "1,050,000", name: "tokR5n", vest: "tokR5v" },
  { pct: "5%", amt: "1,050,000", name: "tokR6n", vest: "tokR6v" },
];

export function TokenomicsBlock() {
  const { t } = useI18n();

  return (
    <div
      id="tokenomics"
      className="tokenomics-block"
      role="region"
      aria-labelledby="tokenomics-title"
    >
      <p className="tokenomics-block__ribbon">{t("tokRibbon")}</p>
      <h3 id="tokenomics-title" className="tokenomics-block__title">
        {t("tokTitle")}
      </h3>
      <p className="tokenomics-block__lead">{t("tokLead")}</p>

      <h4 className="tokenomics-block__h">{t("tokS1")}</h4>
      <div className="tokenomics-table-wrap">
        <table className="tokenomics-table">
          <thead>
            <tr>
              <th scope="col">{t("tokHMod")}</th>
              <th scope="col">{t("tokHPct")}</th>
              <th scope="col">{t("tokHAmt")}</th>
              <th scope="col">{t("tokHVest")}</th>
            </tr>
          </thead>
          <tbody>
            {DIST_ROWS.map((row) => (
              <tr key={row.name}>
                <td>{t(row.name)}</td>
                <td className="tok-table-cell-num">
                  <TokPctCell pct={row.pct} />
                </td>
                <td className="tok-table-cell-num">
                  <span className="tok-table-figures tok-table-figures--amt">
                    {row.amt}
                  </span>
                </td>
                <td>{t(row.vest)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className="tokenomics-block__h">{t("tokS2")}</h4>
      <ul className="tokenomics-list">
        <li>{t("tokS2a")}</li>
        <li>{t("tokS2b")}</li>
        <li>{t("tokS2c")}</li>
      </ul>

      <h4 className="tokenomics-block__h">{t("tokS3")}</h4>
      <p className="tokenomics-block__p">{t("tokS3a")}</p>
      <p className="tokenomics-block__p">{t("tokS3b")}</p>
      <ul className="tokenomics-list tokenomics-list--tax">
        <li>{t("tokTax60")}</li>
        <li>{t("tokTax20")}</li>
        <li>{t("tokTax10a")}</li>
        <li>{t("tokTax10b")}</li>
      </ul>

      <h4 className="tokenomics-block__h">{t("tokS4")}</h4>
      <ul className="tokenomics-list">
        <li>{t("tokS4a")}</li>
        <li>{t("tokS4b")}</li>
        <li>{t("tokS4c")}</li>
      </ul>

      <h4 className="tokenomics-block__h">{t("tokS5")}</h4>
      <div className="tokenomics-callouts">
        <p className="tokenomics-callout">{t("tokS5a")}</p>
        <p className="tokenomics-callout">{t("tokS5b")}</p>
      </div>
    </div>
  );
}
