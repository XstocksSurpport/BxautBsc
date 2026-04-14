import type { WalletApi } from "../hooks/useWallet";
import { CommunitySection } from "../components/sections/CommunitySection";
import { DividendClaimPanel } from "../components/sections/DividendClaimPanel";
import { FaqModule } from "../components/sections/FaqModule";
import { GovernanceModule } from "../components/sections/GovernanceModule";
import { MarketplaceSection } from "../components/sections/MarketplaceSection";
import { MintSection } from "../components/sections/MintSection";
import { StakingModule } from "../components/sections/StakingModule";
import { TokenomicsBlock } from "../components/sections/TokenomicsBlock";
import { MOBILE_TAB_ORDER, useMobileTab } from "./MobileTabContext";
import { MobileHomePage } from "./MobileHomePage";

type Props = { wallet: WalletApi };

export function MobileMain({ wallet }: Props) {
  const { tabIndex } = useMobileTab();
  const n = MOBILE_TAB_ORDER.length;
  const pagePct = 100 / n;

  return (
    <div className="mobile-pages-viewport">
      <div
        className="mobile-pages-rail"
        style={{
          width: `${n * 100}%`,
          transform: `translateX(-${tabIndex * pagePct}%)`,
        }}
      >
        <div
          className="mobile-page"
          style={{ flex: `0 0 ${pagePct}%`, width: `${pagePct}%` }}
          data-tab="home"
          aria-hidden={tabIndex !== 0}
        >
          <MobileHomePage wallet={wallet} />
        </div>
        <div
          className="mobile-page"
          style={{ flex: `0 0 ${pagePct}%`, width: `${pagePct}%` }}
          data-tab="mint"
          aria-hidden={tabIndex !== 1}
        >
          <MintSection wallet={wallet} />
        </div>
        <div
          className="mobile-page"
          style={{ flex: `0 0 ${pagePct}%`, width: `${pagePct}%` }}
          data-tab="dividend"
          aria-hidden={tabIndex !== 2}
        >
          <section
            id="dividend"
            className="section dividend-section section--meme pixel-frame mobile-page-section"
          >
            <DividendClaimPanel wallet={wallet} />
          </section>
        </div>
        <div
          className="mobile-page"
          style={{ flex: `0 0 ${pagePct}%`, width: `${pagePct}%` }}
          data-tab="community"
          aria-hidden={tabIndex !== 3}
        >
          <CommunitySection />
        </div>
        <div
          className="mobile-page"
          style={{ flex: `0 0 ${pagePct}%`, width: `${pagePct}%` }}
          data-tab="market"
          aria-hidden={tabIndex !== 4}
        >
          <MarketplaceSection />
        </div>
        <div
          className="mobile-page"
          style={{ flex: `0 0 ${pagePct}%`, width: `${pagePct}%` }}
          data-tab="tokenomics"
          aria-hidden={tabIndex !== 5}
        >
          <div className="mobile-page-section-inner">
            <TokenomicsBlock />
          </div>
        </div>
        <div
          className="mobile-page"
          style={{ flex: `0 0 ${pagePct}%`, width: `${pagePct}%` }}
          data-tab="staking"
          aria-hidden={tabIndex !== 6}
        >
          <div className="mobile-page-section-inner">
            <StakingModule />
          </div>
        </div>
        <div
          className="mobile-page"
          style={{ flex: `0 0 ${pagePct}%`, width: `${pagePct}%` }}
          data-tab="governance"
          aria-hidden={tabIndex !== 7}
        >
          <div className="mobile-page-section-inner">
            <GovernanceModule />
          </div>
        </div>
        <div
          className="mobile-page"
          style={{ flex: `0 0 ${pagePct}%`, width: `${pagePct}%` }}
          data-tab="faq"
          aria-hidden={tabIndex !== 8}
        >
          <div className="mobile-page-section-inner">
            <FaqModule />
          </div>
        </div>
      </div>
    </div>
  );
}
