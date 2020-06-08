import Vue from 'vue'
import Router from 'vue-router'
import Pos from '@/components/page/Pos'
import userManager from '@/components/page/userManager'
import setting from '@/components/page/setting'
import shopManage from '@/components/page/shopManage'
import login from '@/components/page/login'
import charts from '@/components/page/charts'
import message from '@/components/page/message'
import index from '@/components/page/index'
import order from '@/components/page/order'
import { Message, MessageBox  } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(Router)



   const routes= [
    {
      path: '/',
      name: 'Pos',
      component: Pos,
      meta:{
        auth:true
      }
    },
    {
      path: '/index',
      name: 'index',
      component: index,
      meta:{
        auth:true
      }
    },
    {
      path: '/order',
      name: 'order',
      component: order,
      meta:{
        auth:true
      }
    },
    {
      path: '/shopManage',
      name: 'shopManage',
      component: shopManage,
      meta:{
        auth:true
      }
    },
    {
      path: '/userManager',
      name: 'userManager',
      component: userManager,
      meta:{
        auth:true
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: setting,
      meta:{
        auth:true
      }
    },
    {
      path: '/charts',
      name: 'charts',
      component: charts,
      meta:{
        auth:true
      }
    },
    {
      path: '/message',
      name: 'message',
      component: message,
      meta:{
        auth:true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: login,
      meta:{
        auth:false
      }
    },
  ]

  const router = new Router({
    mode: 'history',
    routes: routes,
  })

  //路由守卫
  router.beforeEach((to, from, next) => {
  if(to.meta.auth){//如果跳转的是需要登陆的页面,验证是否登录
    if(y.getVal("jwt")){
      next()
    }else{
      MessageBox.confirm("登录已过期", "重新登录", {
        distinguishCancelAndClose: true,
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      })
        .then(() => {
            y.go('/login')
        })
        .catch(action => {
          y.go('/login')
        });
        return
      next()
      //y.go('/login')
    }
  }else{
    next()
  }

  })

  export default router
