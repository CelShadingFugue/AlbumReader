/**
 * Renderer <-> main process contract.
 *
 * Keep this file free of Node.js and Electron imports: it is the stable
 * boundary that the web UI is allowed to know about. A future Rust/C++ core
 * can sit behind the main-process side without changing the renderer API.
 */
export const IPC_CHANNELS = {
  pickWorkspace: 'workspace:pick',
} as const;

export interface AlbumReaderBridge {
  /** Read-only platform hint for UI labels and shortcuts. */
  readonly platform: string;
  /** Opens the native folder picker. Returns null when cancelled. */
  pickWorkspace(): Promise<string | null>;
}
