<template>
  <div class="app-wrapper" >
    <nav-bar></nav-bar>
    <app-main></app-main>
    <div class="side">
      <el-button class="side-btn" @click="drawer = true" type="text" icon="el-icon-d-arrow-left"></el-button>
      <el-drawer
        :visible.sync="drawer"
        direction="rtl"
        :modal="false"
        :show-close="false"
        :withHeader="false"
        size="256px"
        >
        <div class="side-container">
          <div class="side-logo">
            <div class="side-app-name">{{asideTitle}}</div>
          </div>
          <el-menu
            mode="vertical"
            :show-timeout="200"
            background-color="#00142a"
            text-color="hsla(0, 0%, 100%, .65)"
            active-text-color="#409EFF"
            :default-active="activeAsideMenu"
            >
            <template v-for="item in asideMenuConfig">
              <router-link v-if="!item.children" :to="item.path" :key="item.name">
                <el-menu-item :index="item.path">
                  <i v-if="item.icon" :class="item.icon"></i>
                  <span v-if="item.name" slot="title">{{item.name}}</span>
                </el-menu-item>
              </router-link>
              <el-submenu v-else :index="item.name || item.path" :key="item.name">
                <template slot="title">
                  <i v-if="item && item.icon" :class="item.icon"></i>
                  <span v-if="item && item.name" slot="title">{{item.name}}</span>
                </template>
                <template v-for="child in item.children" v-if="!child.hidden">
                  <router-link :to="item.path + child.path" :key="child.name">
                    <el-menu-item :index="item.path + child.path">
                      <span v-if="child && child.name" slot="title">{{child.name}}</span>
                    </el-menu-item>
                  </router-link>
                </template>
              </el-submenu>
            </template>
          </el-menu>
        </div>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import { NavBar, AppMain } from './components'
import { asideMenuConfig } from './menuConfig.js'

export default {
  data () {
    return {
      drawer: false,
      asideMenuConfig,
      asideTitle: 'XX温湿度检测'
    }
  },
  name: 'layout',
  components: {
    NavBar,
    AppMain
  },
  mounted () {
    this.$storage.get('appConfig', (err, data) => {
      if (err) {
        this.addMessage(err)
        return
      }
      this.asideTitle = data.asideTitle
    })
  },
  computed: {
    activeAsideMenu () {
      return this.$route.path
    }
  }
}
</script>

<style>
.app-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  padding-top: 0;
  padding-bottom: 0;
  padding-right: .8rem;
  padding-left: .8rem;
}

.app-main {
  flex-grow: 1;
  display: flex;
}

.main-page {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: .8rem;
}

.main-page .main-page-title {
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  min-height: 6rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-right: 1rem;
  padding-left: 1rem;
  font-size: 1.6rem;
  font-weight: 700;
}

.main-page .main-page-container {
  flex-grow: 1;
  margin-top: 1rem;
  padding-bottom: 1.5rem;
  padding-right: 1rem;
  padding-left: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
}

.card {
  padding-top: 1rem;
  padding-bottom: 1rem;
  padding-right: 1rem;
  padding-left: 1rem;
  border: 1px solid #EBEEF5;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}

.top-bar {
  display: flex;
  flex-direction: row;
}

.top-bar-item {
  align-self: center;
}

.top-bar-controls{
  flex-grow: 1;
  display: flex;
  flex-direction: row-reverse;
}

.top-bar-control-item{
  margin-left: 3rem;
  align-self: center;
}

.side .side-btn {
  position: fixed;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1003;
  font-size: 3.6rem;
}

.side .side-container {
  height: 100%;
  background-color: #00142a;
}

.side .side-app-name {
  color: #fff;
  text-align: center;
  padding: 1rem;
}

.warn-text {
  color: #333;
  font-size: 1.6rem;
  font-weight: 600;
  font-style: italic;
}
</style>
