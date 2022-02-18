<template>
  <div id="app" name="app">
    <template v-if="isBackStage">
      <router-view v-if="isBackLogin"></router-view>
      <BackHome v-else></BackHome>
    </template>
    <template v-else>
      <main-home />
    </template>
  </div>
</template>

<script>
import MainHome from "@/components/MainHome.vue";
import BackHome from "@/views/BackHome.vue";

export default {
  components: {
    MainHome,
    BackHome,
  },
  data() {
    return {
      backStageRoute: ["/admin", "/backHome", "/shopManage"],
      isBackStage: false,
      isReload: true,
      isBackLogin: false,
    };
  },
  watch: {
    $route: {
      handler: function (val, old) {
        console.log(val, old);
        this.checkAdminRoute(val.path);
      },
      // 深度观察监听
      deep: true,
    },
  },
  methods: {
    // 路由检测
    checkAdminRoute(url) {
      for (let i = 0; i < this.backStageRoute.length; i++) {
        if (this.backStageRoute[i] === url) {
          this.isReload = false;
          this.$nextTick(() => {
            this.isBackStage = true;
            this.isReload = true;
          });

          if (url === "/admin") {
            this.isBackLogin = true;
          } else {
            this.isBackLogin = false;
          }
        } else {
          this.isBackStage = false;
        }
      }
    },
  },
};
</script>

<style>
/* 全局CSS */
* {
  padding: 0;
  margin: 0;
  border: 0;
  list-style: none;
}
#app .el-header {
  padding: 0;
}
#app .el-main {
  min-height: 300px;
  padding: 20px 0;
}
#app .el-footer {
  padding: 0;
}
a,
a:hover {
  text-decoration: none;
}
/* 全局CSS END */
</style>