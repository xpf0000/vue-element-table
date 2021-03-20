/* eslint-disable */
require('script-loader!file-saver');
const {blob} = require('./Blob')
export function export_json_to_json(jsonData, defaultTitle) {
  const data = JSON.stringify(jsonData)
  let content = new Blob([data], { type: "" });
  let title = defaultTitle || '列表'
  saveAs(content, title + ".json")
}
