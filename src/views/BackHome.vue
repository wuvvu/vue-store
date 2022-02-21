<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/backLogo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info">退出</el-button></el-header
    >
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activeIndex"
        >
        <!-- 一级菜单 -->
          <el-menu-item
            :index="item.id"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 文本 -->
              <span class="authName">{{ item.authName }}</span>
            </template>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name:"BackHome",
  data() {
    return {
      menulist: [{
        id:"/shopManage",
        authName:"商品列表"
      },{
        id:"/analysis",
        authName:"市场分析"
      }],
      // 是否折叠
      isCollapse: false,
      activeIndex:"/shopManage"
    };
  },
  created(){
    this.test(this.$route.path)
  },
  methods: {
    test(index){
      this.activeIndex = index
    }
  },
};
</script>

<style scoped>
.home-container {
  height: 100vh;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font-size: 20px;
}
.el-header > div {
  display: flex;
  align-items: center;
}
.el-header > div > img {
  width: 60px;
  height: 60px;
  padding: 10px;
  box-sizing: border-box;
}
.el-header > div > span {
  margin-left: 5px;
}

.el-aside {
  background-color: #333744;
}
.el-aside > .el-menu {
  border-right: 0;
}
.el-aside > .el-menu > .authName {
  user-select: none;
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
  user-select: none;
}
</style>
