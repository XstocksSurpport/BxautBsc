import { useI18n } from "../../i18n/I18nContext";

export function GovernanceModule() {
  const { t } = useI18n();
  return (
    <div id="governance" className="submodule-block submodule-block--muted">
      <p className="submodule-block__ribbon">{t("navGovernance")}</p>
      <h3 className="submodule-block__title">{t("govTitle")}</h3>
      <p className="submodule-block__body">{t("govBody")}</p>
    </div>
  );
}
