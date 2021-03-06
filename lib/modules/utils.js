'use babel';

import { getSourceInfo } from './core/editor';
import plugin from '../prelum';

// запрос параметров блока документ()
export function getDocKeywordParams(keys) {
  if (!keys) {
    return console.warn('getDocKeywordParams: keys not found');
  }

  const { editor } = getSourceInfo();
  const params = [];
  const regex = new RegExp(`(${keys.join('|')})\\s\-\\s(.+)`, 'mg');

  let keywordRange = getDocKeywordPosition();

  editor.scanInBufferRange(regex, keywordRange, function (result) {
    const key = result.match[1];
    const param = result.match[2];

    params.push({ key, param, range: result.range });
  });

  return params;
}

export function getDocKeywordPosition() {
  const { editor } = getSourceInfo();

  let range;

  editor.scan(/^документ\(.*\)((.|\s(?!--))*)/m, function (result) {
    range = result.range;
  });

  return range;
}

// вставка параметров в блок документ()
export function addParamToDocKeyword(paramStr) {
  const { start } = getDocKeywordPosition();
  const { editor } = getSourceInfo();
  const insertPoint = { row: start.row + 1, column: 0 };

  editor.setCursorBufferPosition(insertPoint);
  editor.setTextInBufferRange([insertPoint, insertPoint], paramStr + '\n');
}

// обновление параметра в блоке документ()
export function updateParamInDocKeyword(params) {
  const { editor } = getSourceInfo();
  const { keys, searchString, newString } = params;

  const findedParams = getDocKeywordParams(keys);
  const targetParam = findedParams.find(item => {
    return item.param.match(searchString);
  });

  if (targetParam) {
    editor.setTextInBufferRange(targetParam.range, newString);
  } else {
    addParamToDocKeyword(newString);
  }
}

const { notifications: notify } = atom;

export function closeNotifications() {
  notify.getNotifications().forEach(item => {
    item.dismiss();
  });
}

function dismissAll() {
  notify.getNotifications().forEach(item => {
    if (/warning|error/.test(item.type)) return;
    item.dismiss();
  });
}

export function log(type, params) {
  const { title } = params;

  params.dismissable = true;

  dismissAll()

  switch (type) {
    case 'error':
      notify.addError(
        'PRELUM: ' + title || 'Ошибка трансляции документа',
        params
      );
      plugin.processing = false;
      break;
    case 'warning':
      notify.addWarning(`PRELUM: ${title}`, params);
      params.dismissable = false
      break;
    case 'success':
      notify.addSuccess(`PRELUM: ${title}`, params);

      setTimeout(dismissAll, params.duration || 2000)
      break;
    default:
      notify.addInfo(`PRELUM: ${title}`, params);
  }
}

export function clearLogs() {
  notify.getNotifications().forEach(i => {
    i.dismiss();
  });
}

export function getOutputUri(source, format) {
  if (!format || !source) return null;

  const { dir, name } = source;
  return `${dir}/${name}.${format}`;
}

export function getOpenedFormat(source) {
  let format = '';
  let activeFormat = '';

  const fileName = source.name;

  atom.workspace.observePanes(pane => {
    const items = pane.getItems();
    const activeItem = pane.getActiveItem()

    items.forEach(item => {
      const isActive = item === activeItem
      if (item) {
        if (item.uri && item.uri.indexOf(fileName + '.html') >= 0) {
          isActive ? activeFormat = 'html' : format = 'html';
        } else if (
          item.filePath &&
          item.filePath.indexOf(fileName + '.pdf') >= 0
        ) {
          isActive ? activeFormat = 'pdf' : format = 'pdf';
        }
      }
    });
  });

  return activeFormat || format;
}
