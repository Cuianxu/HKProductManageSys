<template>
  <div class="wrapper">
    <el-container>
      <el-header>
        <div class="header_left">
          <img class="logo" src="@/assets/logo.jpg" alt="" />
          <span>鸿库产品管理系统</span>
        </div>
        <el-button type="danger" @click="exit">退出</el-button>
      </el-header>
      <el-container style="margin-top: 60px;">
        <el-aside :width="isCollapse ? '64px' : '180px'">
          <div class="fold_btn" @click="fold">|||</div>
          <el-menu :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" background-color="#304156"
            text-color="#fff" :default-active="currentPath" class="el-menu-vertical-demo">
            <MenuItem :menuList="menuList" @menuItemClick="menuItemClick" />
          </el-menu>
        </el-aside>
        <el-main :style="{ marginLeft: isCollapse ? '64px' : '180px' }">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }" key="home">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-for="item in breadcrumbList" :key="item">
              {{ item }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="content">
            <router-view v-slot="{ Component }">
              <transition name="route" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>

        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { getMenu } from "@/api/home";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useStore } from "@/stores/store";
import { onMounted, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import type { Menus } from "@/interface";
import MenuItem from "@/components/MenuItem.vue";
const router = useRouter();
const route = useRoute()
const currentPath = ref('/')
const menuList = ref<Menus[]>([]);
//逐级寻找菜单的title
import { findMenuNameByPath } from "@/utils/util";
const breadcrumbList = ref<string[]>([])
const store = useStore()
// 获取菜单router
onMounted(async () => {
  const res = await getMenu();
  console.log(store.token);

  if (res.data.meta.status === 200) {
    menuList.value = [
      {
        id: 0,
        order: 0,
        path: 'home',
        authName: '首页',
        children: []
      }, ...res.data.data];
    router.push(route.path)
  } else {
    ElMessage.error(res.data.meta.msg);
    return;
  }
  currentPath.value = route.path.replace('/', '')
  breadcrumbList.value = findMenuNameByPath(menuList.value, currentPath.value).reverse()
});

// 监听路由变化,更新面包屑
watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    currentPath.value = 'home'
    breadcrumbList.value = []
    return
  } else {
    currentPath.value = newPath.replace('/', '')
    breadcrumbList.value = findMenuNameByPath(menuList.value, currentPath.value).reverse()
  }
})
// 菜单点击事件
const menuItemClick = (menu: Menus) => {
  router.push(menu.path);
};

// 侧边栏折叠
const isCollapse = ref(false);
const fold = () => {
  isCollapse.value = !isCollapse.value;
};

// 退出登录
const exit = () => {
  window.localStorage.removeItem("token");
  router.push("/login");
  ElMessage.warning("已退出登录");
};
</script>

<style lang="less" scoped>
.wrapper {
  .el-header {
    color: #fff;
    background-color: #304156;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    z-index: 999;

    .header_left {
      display: flex;

      .logo {
        width: 60px;
      }

      span {
        font-size: 20px;
        font-weight: bold;
        margin-left: 10px;
        line-height: 60px;
      }
    }
  }

  .el-container {
    .el-aside {
      background-color: #304156;
      height: calc(100vh - 60px);
      transition: width 0.5s;
      position: fixed;

      .fold_btn {
        text-align: center;
        background-color: #304156;
        color: #fff;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
      }
    }

    .el-main {
      transition: margin-left 0.5s;
      background-color: #eaedf1;

      .content {
        background-color: #fff;
        margin-top: 10px;
        padding: 10px 20px;
      }
    }
  }


  :deep(.el-menu) {
    border-right: 0;

    &.el-menu--collapse .el-sub-menu .el-sub-menu__title .el-sub-menu__icon-arrow {
      display: none !important;
    }
  }

  .route-enter-from {
    opacity: 0;
    transform: translateX(-10%);
  }

  .route-enter-to {
    opacity: 1;
    transform: translateX(0px);
  }

  .route-enter-active,
  .route-leave-active {
    transition: all 0.5s;
  }

  .route-leave-to {
    opacity: 0;
    transform: translateX(10%);
  }

  .route-leave-from {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>