import { useI18n } from "../../i18n/I18nContext";

export function StakingModule() {
  const { t } = useI18n();
  return (
    <div id="staking" className="submodule-block submodule-block--muted">
      <p className="submodule-block__ribbon">{t("navStaking")}</p>
      <h3 className="submodule-block__title">{t("stakingTitle")}</h3>
      <p className="submodule-block__body">{t("stakingBody")}</p>
    </div>
  );
}
