/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Build-time base path (mirrors `vite.config` `base`; usually set only in CI for GitHub Pages). */
  readonly VITE_BASE_PATH?: string;
  readonly VITE_BXAUT_TOKEN_ADDRESS?: string;
  readonly VITE_XAUT_TOKEN_ADDRESS?: string;
  readonly VITE_SHOVEL_NFT_ADDRESS?: string;
  readonly VITE_DIVIDEND_DISTRIBUTOR_ADDRESS?: string;
  readonly VITE_TELEGRAM_URL?: string;
  readonly VITE_TWITTER_URL?: string;
  readonly VITE_DISCORD_URL?: string;
  readonly VITE_PROMO_VIDEO_SRC?: string;
  /** Optional URL or `public/` path for mobile home loop (self-hosted; no YouTube). */
  readonly VITE_HOME_DANCE_VIDEO_SRC?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
