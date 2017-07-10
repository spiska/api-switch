import Vue from 'vue'
import Router from 'vue-router'

import AppDetail from '../components/AppDetail'

// init router
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/detail/:id',
      name: 'detail',
      component: AppDetail
    }
  ]
})
