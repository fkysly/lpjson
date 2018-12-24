var XLSX = require('xlsx');
var electron = require('electron').remote;
var convertJSON = require('./convert');
const fs = require('fs');

var completeArea = document.getElementById('complete-area');
var openBtn = document.getElementById('open-btn');
var saveBtn = document.getElementById('save-btn');
var tip = document.getElementById('tip');
var fileNameText = document.getElementById('file-name-text');
openBtn.addEventListener('click', handleOpenFile, false);
saveBtn.addEventListener('click', handleSaveFile, false);

let target_json = {
  message: '初始化信息'
};

/* 处理文件结果 */
function process_wb(wb) {
  wb.SheetNames.forEach(function(sheetName) {
    const ws = wb.Sheets[sheetName];
    const raw_json = XLSX.utils.sheet_to_json(ws, { header: 'A' });
    target_json = convertJSON(raw_json);
    tip.innerText = '解析完成';
    completeArea.style.display = 'block';
  });
}

/* 打开文件事件 */
function handleOpenFile() {
  fileNameText.text = '请选择文件';
  tip.innerText = '等待解析';
  completeArea.style.display = 'none';
  var o = electron.dialog.showOpenDialog({
    title: '选择文件',
    filters: [
      {
        name: 'Spreadsheets',
        extensions: 'xls|xlsx|xlsm|xlsb'.split('|')
      }
    ],
    properties: ['openFile']
  });
  if (o && o.length > 0) {
    fileNameText.innerText = o[0];
    process_wb(XLSX.readFile(o[0]));
  }
}

/* 保存文件事件 */
function handleSaveFile() {
  var savePath = electron.dialog.showSaveDialog({
    title: '保存 JSON 文件',
    defaultPath: 'output.json'
  });
  fs.writeFile(savePath, JSON.stringify(target_json, null, 4), function(err) {
    if (err) {
      tip.innerText = '保存遇到了错误';
      console.log(err);
      return;
    }

    tip.innerText = '已保存，请查看文件';
  });
}
