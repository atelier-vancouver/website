/// <reference path="../.astro/types.d.ts" />

import "react";

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number | undefined;
  }
}

declare global {
  namespace Cloudflare {
    interface Env {
      OPENAI_API_KEY: string;
    }
  }
}
