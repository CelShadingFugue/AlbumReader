import { session, type WebContents } from 'electron';

function isDev(): boolean {
  return Boolean(MAIN_WINDOW_VITE_DEV_SERVER_URL);
}

/**
 * The renderer is deliberately treated as an untrusted web page.
 * Keep navigation, popups and the Node.js integration locked down.
 */
export function hardenWebContents(contents: WebContents): void {
  contents.setWindowOpenHandler(() => ({ action: 'deny' }));

  contents.on('will-navigate', (event, targetUrl) => {
    const currentUrl = contents.getURL();
    if (targetUrl !== currentUrl) {
      event.preventDefault();
    }
  });

  contents.on('will-attach-webview', (event) => {
    event.preventDefault();
  });
}

/**
 * A CSP is set from the main process so development can allow the Vite HMR
 * websocket while production only permits local application resources.
 */
export function installContentSecurityPolicy(): void {
  const policy = isDev()
    ? [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "connect-src 'self' ws: http:",
        "object-src 'none'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
      ].join('; ')
    : [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        "connect-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "frame-ancestors 'none'",
      ].join('; ');

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [policy],
      },
    });
  });
}
