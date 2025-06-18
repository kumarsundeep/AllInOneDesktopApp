"use strict";
// Load environment variables
require("dotenv").config();

const path = require("path");
const { app, BrowserWindow, Menu } = require("electron");
const { autoUpdater } = require("electron-updater");
const { is } = require("electron-util");
const unhandled = require("electron-unhandled");
const debug = require("electron-debug");
const contextMenu = require("electron-context-menu");
const config = require("./config.js");
const menu = require("./menu.js");

unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId("com.company.AppName");

// Enable auto-updates with certificate pinning in production
if (!is.development) {
	const FOUR_HOURS = 1000 * 60 * 60 * 4;

	// Certificate pinning configuration from environment variables
	autoUpdater.publisherName = process.env.PUBLISHER_NAME;
	autoUpdater.verifyUpdateCodeSignature = true;

	// Add certificate fingerprints from environment variables
	const pinnedFingerprints = new Set();
	if (process.env.CERTIFICATE_FINGERPRINT_1)
		pinnedFingerprints.add(process.env.CERTIFICATE_FINGERPRINT_1);
	if (process.env.CERTIFICATE_FINGERPRINT_2)
		pinnedFingerprints.add(process.env.CERTIFICATE_FINGERPRINT_2);

	// Verify update signature against pinned fingerprints
	autoUpdater.on(
		"update-downloaded",
		(event, releaseNotes, releaseName, releaseDate, updateURL) => {
			const cert = event.certificates && event.certificates[0];
			if (cert && pinnedFingerprints.has(cert.fingerprint256)) {
				autoUpdater.quitAndInstall();
			} else {
				console.error("Certificate verification failed");
				// Handle invalid certificate (e.g., show error to user)
			}
		}
	);

	setInterval(() => {
		autoUpdater.checkForUpdates();
	}, FOUR_HOURS);

	autoUpdater.checkForUpdates();
}

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	const window_ = new BrowserWindow({
		title: app.name,
		show: false,
		width: 600,
		height: 400,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			contextIsolation: true,
			nodeIntegration: false,
		},
	});

	window_.on("ready-to-show", () => {
		window_.show();
	});

	window_.on("closed", () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await window_.loadFile(path.join(__dirname, "index.html"));

	return window_;
};

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on("second-instance", () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on("window-all-closed", () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on("activate", async () => {
	if (!mainWindow) {
		mainWindow = await createMainWindow();
	}
});

(async () => {
	await app.whenReady();
	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();

	const fallbackErr = config.get("fallbackErr");
	// Sanitize user input by escaping HTML special characters
	const sanitizedText = fallbackErr
		.replace(/&/g, "&")
		.replace(/</g, "<")
		.replace(/>/g, ">")
		.replace(/"/g, '"')
		.replace(/'/g, "&#039;");

	mainWindow.webContents.send(
		"set-header-text",
		`Something went wrong! ${sanitizedText}`
	);
})();
