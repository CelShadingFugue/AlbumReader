import {
  BrowserWindow,
  dialog,
  ipcMain,
  type IpcMainInvokeEvent,
  type OpenDialogOptions,
} from 'electron';
import { IPC_CHANNELS } from '../shared/contracts';

function assertTrustedSender(event: IpcMainInvokeEvent): void {
  const senderUrl = event.senderFrame?.url ?? '';
  const isDevSender =
    Boolean(MAIN_WINDOW_VITE_DEV_SERVER_URL) &&
    senderUrl.startsWith(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  const isPackagedSender = senderUrl.startsWith('file://');

  if (!isDevSender && !isPackagedSender) {
    throw new Error('Blocked IPC call from an untrusted renderer.');
  }
}

/**
 * IPC handlers are the desktop equivalent of a backend API.
 * Keep filesystem/archive work in this process (or a future sidecar core),
 * never in the renderer.
 */
export function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.pickWorkspace, async (event) => {
    assertTrustedSender(event);

    const owner = BrowserWindow.fromWebContents(event.sender);
    const options: OpenDialogOptions = {
      title: '选择图片工作区',
      buttonLabel: '选择此文件夹',
      properties: ['openDirectory'],
    };

    const result = owner
      ? await dialog.showOpenDialog(owner, options)
      : await dialog.showOpenDialog(options);

    return result.canceled ? null : (result.filePaths[0] ?? null);
  });
}
