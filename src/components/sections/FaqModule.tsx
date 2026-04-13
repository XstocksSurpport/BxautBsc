import { useMemo, useState } from "react";
import { FAQ_COUNT, FAQ_PAGE_SIZE } from "../../config/faq";
import { useI18n } from "../../i18n/I18nContext";
import type { TranslationKey } from "../../i18n/translations";

function faqQKey(id: number): TranslationKey {
  return `faqQ${id}` as TranslationKey;
}

function faqAKey(id: number): TranslationKey {
  return `faqA${id}` as TranslationKey;
}

export function FaqModule() {
  const { t, locale } = useI18n();
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(FAQ_COUNT / FAQ_PAGE_SIZE));
  const start = page * FAQ_PAGE_SIZE;
  const pageIds = useMemo(() => {
    const out: number[] = [];
    for (let i = 0; i < FAQ_PAGE_SIZE && start + i < FAQ_COUNT; i++) {
      out.push(start + i + 1);
    }
    return out;
  }, [start]);

  const pageLabel =
    locale === "zh"
      ? `第 ${page + 1} / ${totalPages} 页`
      : `Page ${page + 1} of ${totalPages}`;

  return (
    <div id="faq" className="submodule-block submodule-block--faq">
      <p className="submodule-block__ribbon">{t("navFaq")}</p>
      <h3 className="submodule-block__title">{t("faqTitle")}</h3>

      <div className="faq-list">
        {pageIds.map((id) => (
          <details key={id} className="faq-item">
            <summary className="faq-item__q">{t(faqQKey(id))}</summary>
            <div className="faq-item__a">{t(faqAKey(id))}</div>
          </details>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="faq-pager">
          <button
            type="button"
            className="btn btn-outline faq-pager__btn"
            disabled={page <= 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            {t("faqPrev")}
          </button>
          <span className="faq-pager__info" aria-live="polite">
            {pageLabel}
          </span>
          <button
            type="button"
            className="btn btn-outline faq-pager__btn"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            {t("faqNext")}
          </button>
        </div>
      )}
    </div>
  );
}
