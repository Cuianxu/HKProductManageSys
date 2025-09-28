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
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '180px'">
          <div class="fold_btn" @click="fold">|||</div>
          <el-menu :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" background-color="#304156"
            text-color="#fff" :default-active="currentPath" class="el-menu-vertical-demo">
            <MenuItem :menuList="menuList" @menuItemClick="menuItemClick" />
          </el-menu>
        </el-aside>
        <el-main :style="{ marginLeft: isCollapse ? '64px' : '180px' }">

          <el-breadcrumb separator="/">
            <transition-group name="move">
              <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
              <el-breadcrumb-item v-for="item in breadcrumbList" :key="item">{{ item }}</el-breadcrumb-item>
            </transition-group>
          </el-breadcrumb>

          <transition name="move" mode="out-in">
            <RouterView />
          </transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { getMenu } from "@/api/home";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
import { ElMessage } from "element-plus";
import type { Menus } from "@/interface";
import MenuItem from "@/components/MenuItem.vue";
const breadcrumbList = ref<string[]>([])
const currentPath = ref('/')
const router = useRouter();
const route = useRoute()
const menuList = ref<Menus[]>([]);
// 获取菜单router
const findMenuNameByPath = (menus: any, path: any): string[] => {
  let name = []
  for (const item of menus) {
    if (item.children && item.children.length != 0) {
      name.push(...findMenuNameByPath(item.children, path))
      if (name.length == 0) {
        continue
      } else {
        name.push(item.authName)
        return name
      }

    } else if (item.path == path) {
      name.push(item.authName)
      return name
    }
  }
  return name
}
onMounted(async () => {
  const res = await getMenu();
  if (res.data.meta.status === 200) {
    menuList.value = [{ authName: '首页', path: '/' }, ...res.data.data]
    console.log(menuList.value);
    router.push(route.path)
    currentPath.value = route.path.replace('/', '')
    breadcrumbList.value = findMenuNameByPath(menuList.value, currentPath.value).reverse()
  } else {
    ElMessage.error(res.data.meta.msg);
    return;
  }
});

// 菜单点击事件
const menuItemClick = (menu: Menus) => {
  console.log(menu.path)
  router.push(menu.path);
  currentPath.value = menu.path
  breadcrumbList.value = findMenuNameByPath(menuList.value, currentPath.value).reverse()
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
      overflow: hidden;
      position: fixed;
      transition: width 0.3s;

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
  }


  :deep(.el-menu) {
    border-right: 0;

    &.el-menu--collapse .el-sub-menu .el-sub-menu__title .el-sub-menu__icon-arrow {
      display: none !important;
    }
  }
}

.move-enter {
  opacity: 0;
  transform: translateX(-10%);
}

.move-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

.move-enter-active,
.move-leave-active {
  transition: all 0.5s;
}

.move-leave-to {
  opacity: 0;
  transform: translateX(10%);
}

.move-leave {
  opacity: 1;
  transform: translateX(0);
}
</style>