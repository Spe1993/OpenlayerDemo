/*
 * @Author: your name
 * @Date: 2020-09-21 11:34:04
 * @LastEditTime: 2020-09-21 17:06:45
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \oldemo\src\router\index.js
 */
import Vue from 'vue'
import Router from 'vue-router'
import cusMap from '@/components/cusMap'
import hellow from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'hellow',
      component: hellow
    }
  ]
})
