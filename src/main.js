import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import BaseTable from './index'
Vue.use(ElementUI, {
  size: 'small'
})
Vue.use(BaseTable, {
  border: true,
  stripe: true
})
new Vue({
  el: '#app',
  render: (h) => h(App)
})
