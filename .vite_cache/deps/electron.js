var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// node_modules/.vite-electron-renderer/electron.mjs
var electron = typeof __require !== "undefined" ? function requireElectron() {
  const avoid_parse_require = __require;
  return avoid_parse_require("electron");
}() : function nodeIntegrationWarn() {
  console.error(`If you need to use "electron" in the Renderer process, make sure that "nodeIntegration" is enabled in the Main process.`);
  return {
    // TODO: polyfill
  };
}();
var _ipcRenderer;
if (typeof document === "undefined") {
  _ipcRenderer = {};
  const keys = [
    "invoke",
    "postMessage",
    "send",
    "sendSync",
    "sendTo",
    "sendToHost",
    // propertype
    "addListener",
    "emit",
    "eventNames",
    "getMaxListeners",
    "listenerCount",
    "listeners",
    "off",
    "on",
    "once",
    "prependListener",
    "prependOnceListener",
    "rawListeners",
    "removeAllListeners",
    "removeListener",
    "setMaxListeners"
  ];
  for (const key of keys) {
    _ipcRenderer[key] = () => {
      throw new Error(
        "ipcRenderer doesn't work in a Web Worker.\nYou can see https://github.com/electron-vite/vite-plugin-electron/issues/69"
      );
    };
  }
} else {
  _ipcRenderer = electron.ipcRenderer;
}
var clipboard = electron.clipboard;
var contextBridge = electron.contextBridge;
var crashReporter = electron.crashReporter;
var ipcRenderer = _ipcRenderer;
var nativeImage = electron.nativeImage;
var shell = electron.shell;
var webFrame = electron.webFrame;
var deprecate = electron.deprecate;
var app = electron.app;
var autoUpdater = electron.autoUpdater;
var BaseWindow = electron.BaseWindow;
var BrowserView = electron.BrowserView;
var BrowserWindow = electron.BrowserWindow;
var contentTracing = electron.contentTracing;
var desktopCapturer = electron.desktopCapturer;
var dialog = electron.dialog;
var globalShortcut = electron.globalShortcut;
var inAppPurchase = electron.inAppPurchase;
var ipcMain = electron.ipcMain;
var Menu = electron.Menu;
var MessageChannelMain = electron.MessageChannelMain;
var MessagePortMain = electron.MessagePortMain;
var nativeTheme = electron.nativeTheme;
var netLog = electron.netLog;
var Notification = electron.Notification;
var powerMonitor = electron.powerMonitor;
var powerSaveBlocker = electron.powerSaveBlocker;
var protocol = electron.protocol;
var pushNotifications = electron.pushNotifications;
var safeStorage = electron.safeStorage;
var screen = electron.screen;
var session = electron.session;
var ShareMenu = electron.ShareMenu;
var TouchBar = electron.TouchBar;
var Tray = electron.Tray;
var utilityProcess = electron.utilityProcess;
var webContents = electron.webContents;
var WebContentsView = electron.WebContentsView;
var webFrameMain = electron.webFrameMain;
var View = electron.View;
export {
  BaseWindow,
  BrowserView,
  BrowserWindow,
  Menu,
  MessageChannelMain,
  MessagePortMain,
  Notification,
  ShareMenu,
  TouchBar,
  Tray,
  View,
  WebContentsView,
  app,
  autoUpdater,
  clipboard,
  contentTracing,
  contextBridge,
  crashReporter,
  electron as default,
  deprecate,
  desktopCapturer,
  dialog,
  globalShortcut,
  inAppPurchase,
  ipcMain,
  ipcRenderer,
  nativeImage,
  nativeTheme,
  netLog,
  powerMonitor,
  powerSaveBlocker,
  protocol,
  pushNotifications,
  safeStorage,
  screen,
  session,
  shell,
  utilityProcess,
  webContents,
  webFrame,
  webFrameMain
};
//# sourceMappingURL=electron.js.map
