'use strict'
/**
 * secret.json
 * {
 *   client_id: "your client id",
 *   client_secret: "your client secret",
 * }
 */
const secret = require('./../secret.json');
const { app, BrowserWindow, ipcMain } = require('electron');


app.on('ready', createWindow);

// This will create our app window, no surprise there
let mainWindow;
function createWindow () {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768
  });

  // display the index.html file
  mainWindow.loadURL(`file://${ __dirname }/../build/index.html?client_id=${secret.client_id}&client_secret=${secret.client_secret}`);

  // open dev tools by default so we can see any console errors
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

/* Mac Specific things */

// when you close all the windows on a non-mac OS it quits the app
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); }
})

// if there is no mainWindow it creates one (like when you click the dock icon)
app.on('activate', () => {
  if (mainWindow === null) { createWindow(); }
})

// send streaming data
ipcMain.on("sync-token", (event, arg) => {
  require("./streaming")(arg)(data => {
    mainWindow.webContents.send("streaming-message", data);
  });
})