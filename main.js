var electron = require('electron');
var XLSX = require('xlsx');
var app = electron.app;

var win = null;

function createWindow() {
  if (win) return;
  win = new electron.BrowserWindow({ width: 800, height: 600 });
  win.loadURL('file://' + __dirname + '/index.html');
  // win.webContents.openDevTools();
  win.on('closed', function() {
    win = null;
  });
}
if (app.setAboutPanelOptions)
  app.setAboutPanelOptions({
    applicationName: '小猪猪课件数据生成器',
    applicationVersion: 'XLSX ' + XLSX.version,
    copyright: '@ 2018-present fkysly'
  });
app.on('open-file', function() {
  console.log(arguments);
});
app.on('ready', createWindow);
app.on('activate', createWindow);
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});
