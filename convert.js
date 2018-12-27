var electron = require('electron').remote;
const isDebug = false;

let json = [];
let head = 1;
let content = [];
let contentItem = [];
let talk = {
  type: '',
  text: 'Class is beginning',
  emotion: '',
  notice: ''
};
const pattern = /^\((.+?)\) (.+)/;
let type = 'Say';

let firstContentItemFlag = true;

pushTalk();

const convertJSON = function(raw) {
  raw.every((item, index) => {
    isDebug ? console.log(index, JSON.stringify(item)) : null;
    if (item.C && item.C === head + 1) {
      pushContentItem();
      firstContentItemFlag = true;
      pushContent();
    }

    if (item.H && item.H === '●') {
      if (!firstContentItemFlag) {
        pushContentItem();
      } else {
        firstContentItemFlag = false;
      }
    }

    if (item.J) {
      if (
        item.I === undefined &&
        (contentItem.length === 0 ||
          contentItem[0].text === 'Class is beginning')
      ) {
        return true;
      }

      if (item.I) {
        type = item.I.trim();
      }

      let value = item.J.trim();
      const result = value.match(pattern);

      switch (type) {
        case 'Say':
          talk.type = type;
          if (result) {
            talk.emotion = `(${result[1]}) `;
            talk.text = result[2];
          } else {
            talk.text = value;
          }
          break;
        case 'Do':
        case 'Say & Do':
        case 'Say& Do':
        case 'Say &Do':
        case 'Say&Do':
        case 'Sing':
          talk.type = type;
          if (result) {
            talk.emotion = `(${result[1]}) `;
            talk.notice = result[2];
          } else {
            talk.notice = value;
          }
          break;
        default:
          electron.dialog.showErrorBox(
            '解析错误',
            `第${index + 1}行出错，未知的 type 类型: ${type}`
          );
          return false;
      }
      pushTalk();
    }
    if (isDebug) {
      return index > 18 ? false : true;
    } else {
      return true;
    }
  });

  pushContentItem();
  pushContent();

  return json;
};

function pushContent() {
  isDebug ? console.log('pushContent') : null;
  json.push({
    head: head - 1,
    content: content
  });
  head = head + 1;
  clearContent();
}

function pushContentItem() {
  isDebug ? console.log('pushContentItem') : null;
  content.push(contentItem);
  clearContentItem();
}

function pushTalk() {
  isDebug ? console.log('pushTalk') : null;
  contentItem.push(talk);
  clearTalk();
}

function clearTalk() {
  talk = {};
}

function clearContentItem() {
  contentItem = [];
}

function clearContent() {
  content = [];
}

module.exports = convertJSON;
