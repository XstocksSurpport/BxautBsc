import { Header } from "./components/Header";
import { PromoRollVideo } from "./components/PromoRollVideo";
import { BottomTabNav } from "./components/TopNav";
import { AssetsSubPage } from "./components/AssetsSubPage";
import { AssetsPageProvider, useAssetsPage } from "./context/AssetsPageContext";
import { CommunitySection } from "./components/sections/CommunitySection";
import { DividendSection } from "./components/sections/DividendSection";
import { MarketplaceSection } from "./components/sections/MarketplaceSection";
import { MintSection } from "./components/sections/MintSection";
import { useWallet } from "./hooks/useWallet";
import { I18nProvider, useI18n } from "./i18n/I18nContext";
import { MobileMain } from "./mobile/MobileMain";
import { MobileTabProvider, useMobileTab } from "./mobile/MobileTabContext";

function Shell() {
  const wallet = useWallet();
  const { t } = useI18n();
  const { isPager } = useMobileTab();
  const { open: assetsOpen, closeAssets } = useAssetsPage();

  return (
    <div
      className={`app-shell${isPager ? " app-shell--mobile-pager" : ""}${assetsOpen ? " app-shell--assets-page" : ""}`}
    >
      <div className="meme-chaos" aria-hidden>
        <span className="meme-float meme-float--a">☽</span>
        <span className="meme-float meme-float--b">✦</span>
        <span className="meme-float meme-float--c">▶</span>
        <span className="meme-float meme-float--d">♦</span>
        <span className="meme-float meme-float--e">?</span>
      </div>
      <div className="scanlines" aria-hidden />
      <PromoRollVideo />
      <Header wallet={wallet} />
      {wallet.error && <div className="banner-error">{wallet.error}</div>}
      {assetsOpen ? (
        <div className="assets-sub-page-host">
          <AssetsSubPage wallet={wallet} onBack={closeAssets} />
        </div>
      ) : isPager ? (
        <MobileMain wallet={wallet} />
      ) : (
        <main className="main-flow">
          <MintSection wallet={wallet} />
          <MarketplaceSection />
          <DividendSection wallet={wallet} />
          <CommunitySection />
        </main>
      )}
      <div className="bottom-dock pixel-frame">
        <BottomTabNav />
        <footer className="site-credit">
          <p>{t("siteCredit")}</p>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <MobileTabProvider>
        <AssetsPageProvider>
          <Shell />
        </AssetsPageProvider>
      </MobileTabProvider>
    </I18nProvider>
  );
}
