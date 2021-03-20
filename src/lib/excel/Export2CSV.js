/* eslint-disable */
require('script-loader!file-saver');
const {blob} = require('./Blob')
import Json2csv from 'json2csv'
export function export_json_to_csv(jsonData, defaultTitle) {
  let csv = Json2csv.parse(jsonData)
  let BOM = "\uFEFF";
  let content = new Blob([BOM + csv], { type: "text/csv" });
  let title = defaultTitle || '列表'
  saveAs(content, title + ".csv")
}
