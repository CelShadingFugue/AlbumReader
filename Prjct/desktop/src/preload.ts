import { contextBridge, ipcRenderer } from 'electron';
import { IPC_CHANNELS, type AlbumReaderBridge } from './shared/contracts';

/**
 * Only the small, serialisable API surface is exposed to the renderer.
 * Never expose ipcRenderer itself.
 */
const bridge: AlbumReaderBridge = {
  platform: process.platform,
  pickWorkspace: () =>
    ipcRenderer.invoke(IPC_CHANNELS.pickWorkspace) as Promise<string | null>,
};

contextBridge.exposeInMainWorld('albumReader', bridge);
