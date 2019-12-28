// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import HeaderAsideLayout from './layouts/HeaderAsideLayout'
import LandingPage from './pages/LandingPage'
import AddEquipment from './pages/AddEquipment'
import TestConfig from './pages/TestConfig'
import Dashboard from './pages/Dashboard'
import Workspace from './pages/Workspace'
// import History from './pages/History'
// import NotFound from './pages/NotFound'
// import Main from './components/Main.vue'

const routerConfig = [
  {
    path: '/',
    layout: HeaderAsideLayout,
    component: LandingPage
  },
  {
    path: '/landingPage',
    layout: HeaderAsideLayout,
    component: LandingPage
  },
  {
    path: '/addEquipment',
    layout: HeaderAsideLayout,
    component: AddEquipment
  },
  {
    path: '/testConfig',
    layout: HeaderAsideLayout,
    component: TestConfig
  },
  {
    path: '/dashboard',
    layout: HeaderAsideLayout,
    component: Dashboard
  },
  {
    path: '/workplace',
    layout: HeaderAsideLayout,
    component: Workspace
  }
  // {
  //   path: '*',
  //   layout: HeaderAsideLayout,
  //   component: require('@/pages/LandingPage').default
  // }
]

export default routerConfig
