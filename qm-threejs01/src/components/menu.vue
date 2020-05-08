
<template>
<div>

<el-menu
  :default-active="activeIndex2"
  class="el-menu-demo"
  mode="horizontal"
  @select="handleSelect"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-menu-item index="flight" >规划态势</el-menu-item>
  <el-submenu index="2">
    <template slot="title">基础</template>
    <el-menu-item index="crank">crank</el-menu-item>
    <el-menu-item index="camera">camera</el-menu-item>
    <el-menu-item index="camera1">PerpectiveCamera</el-menu-item>
    <el-submenu index="2-4">
      <template slot="title">动画</template>
      <el-menu-item index="animate">animate</el-menu-item>
      <el-menu-item index="2-4-2">选项2</el-menu-item>
      <el-menu-item index="2-4-3">选项3</el-menu-item>
    </el-submenu>
  </el-submenu>
  <el-menu-item index="3" disabled>消息中心</el-menu-item>
  <el-menu-item index="4"><a href="https://www.ele.me" target="_blank">订单管理</a></el-menu-item>
</el-menu>
</div>
</template>

<script>
  export default {
    name:'mymenu',
    data() {
      return {
        activeIndex: '1',
        activeIndex2: 'camera'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        this.$router.push({
          path: key,
          params: {data: 'query' }
        })
      }
    }
  }
</script>