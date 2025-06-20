import { fileURLToPath } from 'url';
import path from 'path';
import { app, Menu, shell, BrowserWindow } from 'electron';
import {
  is,
  appMenu,
  aboutMenuItem,
  openUrlMenuItem,
  openNewGitHubIssue,
  debugInfo,
} from 'electron-util';
import config from './config.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let preferencesWindow = null;

const showPreferences = () => {
  if (preferencesWindow) {
    preferencesWindow.focus();
    return;
  }

  preferencesWindow = new BrowserWindow({
    width: 600,
    height: 400,
    parent: BrowserWindow.getFocusedWindow(),
    modal: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  preferencesWindow.loadFile(path.join(__dirname, 'preferences.html'));

  preferencesWindow.on('closed', () => {
    preferencesWindow = null;
  });
};

const helpSubmenu = [
  openUrlMenuItem({
    label: 'Website',
    url: 'https://github.com/kumarsundeep/AllInOneDesktopApp',
  }),
  openUrlMenuItem({
    label: 'Source Code',
    url: 'https://github.com/kumarsundeep/AllInOneDesktopApp',
  }),
  {
    label: 'Report an Issue…',
    click() {
      const body = `
<!-- Please succinctly describe your issue and steps to reproduce it. -->


---

${debugInfo()}`;

      openNewGitHubIssue({
        user: 'kumarsundeep',
        repo: 'AllInOneDesktopApp',
        body,
      });
    },
  },
];

if (!is.macos) {
  helpSubmenu.push(
    {
      type: 'separator',
    },
    aboutMenuItem({
      icon: path.join(__dirname, 'static', 'icon.png'),
      text: 'Created by __',
    })
  );
}

const debugSubmenu = [
  {
    label: 'Show Settings',
    click() {
      config.openInEditor();
    },
  },
  {
    label: 'Show App Data',
    async click() {
      try {
        await shell.openPath(app.getPath('userData'));
      } catch (error) {
        console.error('Failed to open app data directory:', error);
      }
    },
  },
  {
    type: 'separator',
  },
  {
    label: 'Delete Settings',
    click() {
      config.clear();
      app.relaunch();
      app.quit();
    },
  },
  {
    label: 'Delete App Data',
    async click() {
      try {
        await shell.trashItem(app.getPath('userData'));
        app.relaunch();
        app.quit();
      } catch (error) {
        console.error('Failed to move app data to trash:', error);
      }
    },
  },
];

const macosTemplate = [
  appMenu([
    {
      label: 'Preferences…',
      accelerator: 'Command+,',
      click() {
        showPreferences();
      },
    },
  ]),
  {
    role: 'fileMenu',
    submenu: [
      {
        label: 'Custom',
      },
      {
        type: 'separator',
      },
      {
        role: 'close',
      },
    ],
  },
  {
    role: 'editMenu',
  },
  {
    role: 'viewMenu',
  },
  {
    role: 'windowMenu',
  },
  {
    role: 'help',
    submenu: helpSubmenu,
  },
];

// Linux and Windows
const otherTemplate = [
  {
    role: 'fileMenu',
    submenu: [
      {
        label: 'Custom',
      },
      {
        type: 'separator',
      },
      {
        label: 'Preferences…',
        accelerator: 'Control+,',
        click() {
          showPreferences();
        },
      },
      {
        type: 'separator',
      },
      {
        role: 'quit',
      },
    ],
  },
  {
    role: 'editMenu',
  },
  {
    role: 'viewMenu',
  },
  {
    role: 'help',
    submenu: helpSubmenu,
  },
];

const template = is.macos ? macosTemplate : otherTemplate;

if (is.development) {
  template.push({
    label: 'Debug',
    submenu: debugSubmenu,
  });
}

export default Menu.buildFromTemplate(template);
