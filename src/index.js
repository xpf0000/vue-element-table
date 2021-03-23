import BaseTable from './components/BaseTable'
import TableExportBar from './components/TableExportBar'
import TableSearchBox from './components/TableSearchBox'
import SwitchVal from './components/SwitchVal'
import { export_json_to_csv as ExportJsonToCSV } from './lib/excel/Export2CSV'
import {
  export_json_to_excel as ExportJsonToExcel,
  export_table_to_excel as ExportTableToExcel
} from './lib/excel/Export2Excel'
import { export_json_to_json as ExportJsonToTxt } from './lib/excel/Export2JSON'

function install(Vue) {
  if (install.installed) return
  install.installed = true
  Vue.component('BaseTable', BaseTable)
  Vue.component('TableExportBar', TableExportBar)
  Vue.component('TableSearchBox', TableSearchBox)
  Vue.component('SwitchVal', SwitchVal)
}

let GlobalVue = null
if (typeof window !== 'undefined') {
  GlobalVue = window.Vue
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue
}
if (GlobalVue) {
  GlobalVue.use(install)
}
export default install
export {
  BaseTable,
  TableExportBar,
  TableSearchBox,
  SwitchVal,
  ExportJsonToCSV,
  ExportJsonToExcel,
  ExportTableToExcel,
  ExportJsonToTxt
}
