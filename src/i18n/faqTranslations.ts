/** FAQ copy aligned with on-site features only (no investment advice). */

export const faqEn = {
  faqQ1: "What is the relationship between BXAUT and XAUT?",
  faqA1:
    "BXAUT is the ecosystem governance token and, in this project’s framing, the on-chain gold-dividend tax token. XAUT is Tether’s gold stablecoin: issued as a 1:1 representation against allocated physical gold—the on-chain gold asset referenced for gold-linked dividends here.",

  faqQ2:
    "What are the on-chain contract addresses for BXAUT, the Shovel NFT, XAUT, the treasury, and the dividend claim contract?",
  faqA2:
    "• BXAUT: 0x9674AB0C99eAfE7d20158d360cE13E4D671Aa09C\n• Shovel NFT: 0x4cE1A9ae57feE8eD8594b7F76382cF71EFB8931A\n• XAUT: 0x21cAef8A43163Eea865baeE23b9C2E327696A3bf\n• Treasury: 0x5AD2F3984258038Cfcb350CF30414FFF211428D8\n• Dividend claim: 0x32e94d1945F0521934c813B11133689149f118C4",

  faqQ3: "How do I mint a shovel NFT?",
  faqA3:
    "Open the Mint section, connect your wallet, switch to BSC, then approve USDT and mint a tier.",

  faqQ4: "What are the three tiers, prices, and supplies?",
  faqA4:
    "Iron: 1 USDT, 666 supply. Silver: 11 USDT, 111 supply. Gold: 111 USDT, 22 supply. All three tiers share one NFT contract; rarity is Gold > Silver > Iron as shown on the mint cards.",

  faqQ5: "What does “fee income share (per NFT)” mean on each card?",
  faqA5:
    "Those percentages are the product’s published per-NFT share of the total dividend / fee pool (display values on the cards). Always verify economics in official docs and on-chain data.",

  faqQ6: "What is the Shovel Black Market section?",
  faqA6:
    "The Shovel Black Market is the trading venue for the three Shovel NFT tiers. It is where holders can bid freely and trade fairly in an open market.",

  faqQ7: "How do I claim XAUT / dividend rewards?",
  faqA7:
    "Use the Dividend section on BSC: connect the same wallet, check pending rewards, and press Claim.",

  faqQ8: "What is the BXAUT total supply and allocation table?",
  faqA8:
    "Fixed 21,000,000 BXAUT. The Tokenomics block under Dividends lists LP, NFT yield pool, seed/community, marketing, team, and DAO tranches with percentages, amounts, and vesting summaries—same numbers shown in the on-site table.",

  faqQ9: "What tax model does the Tokenomics text describe?",
  faqA9:
    "The copy states a 5% buy and 5% sell tax, with trade tax flowing into the NFT dividend pool, then split (60% liquidity / XAUT, 20% random airdrops to shovel holders, 10% brand, 10% market stability). Final parameters are enforced by deployed contracts and official announcements, not this static page alone.",

  faqQ10: "Where are staking and governance?",
  faqA10:
    "Below Tokenomics you will find Bxaut Staking (marked not open yet) and Governance (no on-page proposals; contact the team to submit). Availability follows official rollout.",

  faqQ11: "Why does minting fail or show an error string?",
  faqA11:
    "Common causes: wrong network, insufficient USDT or BNB for gas, user rejected the transaction, or RPC issues. The mint panel surfaces status text from the wallet or revert reason when available.",

  faqQ12: "Which USDT address does the mint flow use?",
  faqA12:
    "The code uses the standard BSC USDT contract at 0x55d398326f99059fF775485246999027B3197955 with 18 decimals for approvals and payments, matching the rest of this front-end.",

  faqQ13: "What does “Wrong network” / switch to BSC mean?",
  faqA13:
    "The app checks that your wallet is on BSC chain id 56. Use the provided button to request a network switch, then retry connect/mint/claim.",

  faqQ14: "What does the 60 / 20 / 10 / 10 split refer to?",
  faqA14:
    "Under “Tax & NFT revenue routing”, it describes how NFT-ecosystem revenue (including tax) is intended to be allocated after it reaches the pool: liquidity building, random holder airdrops, brand growth, and market-stability buyback/burn. Execution is via multisig and on-chain processes as published by the project.",

  faqQ15: "What about anti-whale and transparency claims?",
  faqA15:
    "The Tokenomics section summarizes caps, multisig custody, and periodic reporting as product commitments. Exact limits and schedules must be confirmed in official legal/technical releases and contract code.",
} as const;

export const faqZh = {
  faqQ1: "BXAUT 和 XAUT 有什么关系？",
  faqA1:
    "$BXAUT 是生态治理代币，也是首个唯一分红链上黄金的税收分红币。XAUT 由泰达（Tether）公司发行，是与现货黄金 1:1 锚定的黄金稳定币。",

  faqQ2: "BXAUT、铲子 NFT、XAUT、国库与分红领取合约的地址是多少？",
  faqA2:
    "• $BXAUT：0x9674AB0C99eAfE7d20158d360cE13E4D671Aa09C\n• 铲子 NFT：0x4cE1A9ae57feE8eD8594b7F76382cF71EFB8931A\n• XAUT：0x21cAef8A43163Eea865baeE23b9C2E327696A3bf\n• 国库：0x5AD2F3984258038Cfcb350CF30414FFF211428D8\n• 分红领取：0x32e94d1945F0521934c813B11133689149f118C4",

  faqQ3: "如何铸造铲子 NFT？",
  faqA3: "在「铸造」区连接钱包、切换到 BSC，按提示授权 USDT 后选择档位铸造。",

  faqQ4: "三档铲子的价格与发行量是多少？",
  faqA4:
    "铁铲：1 USDT，总量 666；银铲：11 USDT，总量 111；金铲：111 USDT，总量 22。三档共用同一 NFT 合约，稀缺性为金 > 银 > 铁，与铸造卡片展示一致。",

  faqQ5: "卡片上的「单枚 NFT 手续费收入占比」是什么？",
  faqA5:
    "该百分比为产品口径下、单枚 NFT 在总分红/手续费池中的展示占比（见各卡数值）。具体经济模型请以官方文档与链上数据为准。",

  faqQ6: "「铲子黑市」板块做什么？",
  faqA6:
    "铲子黑市是 NFT 三档铲子的交易市场，可在此市场自由竞价、公平交易。",

  faqQ7: "如何领取 XAUT / 分红类奖励？",
  faqA7: "在「分红」区连接同一钱包（需在 BSC），查看待领取数量后点击「领取」。",

  faqQ8: "$BXAUT 总量与分配表在哪里看？",
  faqA8:
    "总量恒定为 21,000,000 枚。分红区下方的「代币经济学」表格列出 LP、NFT 收益矿池、种子/社区、市场、团队、DAO 等模块的比例、数量与释放摘要，与本站展示一致。",

  faqQ9: "代币经济学里写的税费模型是什么？",
  faqA9:
    "文案说明买卖各 5% 税费，交易税费进入 NFT 收益池后再按 60% 流动性（XAUT 对）、20% 随机空投、10% 品牌、10% 市值管理等方向分配。最终以已部署合约及官方公示为准，本页为说明性展示。",

  faqQ10: "质押和治理在哪里？",
  faqA10:
    "在代币经济学下方提供「Bxaut 质押」（标注暂未开放）与「治理投票」（当前无提案，需联系团队提交）。具体开放时间以官方公告为准。",

  faqQ11: "铸造失败或出现英文错误提示？",
  faqA11:
    "常见原因：未在 BSC、USDT 或 BNB 不足、用户拒绝交易、RPC 异常等。铸造区会尽量展示钱包或合约返回的状态/错误信息。",

  faqQ12: "铸造使用的 USDT 合约地址是？",
  faqA12:
    "代码使用 BSC 上常见 USDT 合约 0x55d398326f99059fF775485246999027B3197955，按 18 位小数进行授权与扣款，与本站其余逻辑一致。",

  faqQ13: "页面提示「错误网络」或要求切换 BSC？",
  faqA13:
    "站点会校验钱包链 ID 是否为 BSC（56）。请点击提示中的切换按钮，在钱包中同意切换到 BNB Smart Chain 后再试连接/铸造/领取。",

  faqQ14: "文案中的 60 / 20 / 10 / 10 指什么？",
  faqA14:
    "指 NFT 生态收入（含税费等）进入池后的再分配方向：流动性筑基、铲子持有者随机空投、品牌增长、市值管理（回购销毁等）。执行依赖多签与链上流程，以项目方公示为准。",

  faqQ15: "防鲸与透明度承诺如何理解？",
  faqA15:
    "代币经济学区概括了单笔/单地址上限、多签托管与定期披露等产品承诺。具体参数与执行细则请以正式法律/技术文档及合约代码为准。",
} as const;
