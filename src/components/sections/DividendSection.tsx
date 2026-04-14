import type { WalletApi } from "../../hooks/useWallet";
import { DividendClaimPanel } from "./DividendClaimPanel";
import { FaqModule } from "./FaqModule";
import { GovernanceModule } from "./GovernanceModule";
import { StakingModule } from "./StakingModule";
import { TokenomicsBlock } from "./TokenomicsBlock";

export function DividendSection({ wallet }: { wallet: WalletApi }) {
  return (
    <section id="dividend" className="section dividend-section section--meme pixel-frame">
      <DividendClaimPanel wallet={wallet} />
      <TokenomicsBlock />
      <div className="submodule-pair">
        <StakingModule />
        <GovernanceModule />
      </div>
      <FaqModule />
    </section>
  );
}
