const { app, BrowserWindow } = require("electron");
const path = require("path");

const DEFAULT_PORT = process.env.PORT || 3000;

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const url = `http://localhost:${DEFAULT_PORT}`;
  mainWindow.loadURL(url);

  if (process.env.ELECTRON_DEV === "true") {
    mainWindow.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

