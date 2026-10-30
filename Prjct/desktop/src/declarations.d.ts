/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />
/// <reference types="vite/client" />

import type { AlbumReaderBridge } from './shared/contracts';

declare global {
  interface Window {
    albumReader: AlbumReaderBridge;
  }

  interface ImportMetaEnv {
    readonly DEV: boolean;
    readonly PROD: boolean;
  }
}
