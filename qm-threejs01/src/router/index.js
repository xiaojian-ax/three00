import Vue from 'vue'
import Router from 'vue-router'
import CesiumViewer from '@/components/cesiumViewer'
import cesiumPosition from '@/components/cesiumPosition'
import cesiumEntities from '@/components/cesiumEntities'
import cesiumFly from '@/components/cesiumFly'
import cesiumTip from '@/components/cesiumTip'
import resource from '@/components/resource'
import flight from '@/components/flight'
import draw from '@/components/cesiumDrawHelper'
import test from '@/components/cesiumDrawHelperTest'
import convert from '@/components/cesiumDrawHelperConvert'
import b3dmTest from '@/components/b3dmTest'

Vue.use(Router)

export default new Router({
  // mode: 'history',  //去掉url中的#
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('@/components/index'),
      redirect: '/camera',
      children: [

        {
          path: '/flight',
          name: 'flight',
          component: () => import('@/components/flight')
        }, 
        {
          path: '/test',
          name: 'test',
          component: () => import('@/components/base/test')
        }, 
        {
          path: '/camera',
          name: 'camera',
          component: () => import('@/components/base/camera')
        },
        {
          path: '/camera1',
          name: 'camera1',
          component: () => import('@/components/base/PerspectiveCamera.vue')
        },
        {
          path: '/animate',
          name: 'animate',
          component: () => import('@/components/base/animate.vue')
        },
        {
          path: '/crank',
          name: 'crank',
          component: () => import('@/components/base/crank.vue')
        },
      ]
    },
    {
      path: '/position',
      name: 'cesiumPosition',
      component: cesiumPosition
    },
    {
      path: '/entities',
      name: 'entities',
      component: cesiumEntities
    },
    {
      path: '/3dtiles',
      name: '3dtiles',
      component: b3dmTest
    },
    {
      path: '/fly',
      name: 'fly',
      component: cesiumFly
    },
    {
      path: '/tip',
      name: 'tip',
      component: cesiumTip
    },
    {
      path: '/resource',
      name: 'resource',
      component: resource
    },
    // {
    //   path: '/flight',
    //   name: 'flight',
    //   component: flight
    // },
    {
      path: '/draw',
      name: 'draw',
      component: draw
    },
    
    {
      path: '/test',
      name: 'test',
      component: test
    },
    {
      path: '/convert',
      name: 'congvert',
      component: convert
    }
  ]
})
