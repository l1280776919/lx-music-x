/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*/musicSdk*" {
  const content: any;
  export default content;
  export const toMD5: (str: string) => string;
  export const decodeName: (str?: string | null) => string;
}

