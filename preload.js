const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	setHeaderText: (text) => {
		document.querySelector("header p").textContent = text;
	},
});

// Listen for header text updates from main process
ipcRenderer.on("set-header-text", (event, text) => {
	window.electronAPI.setHeaderText(text);
});
