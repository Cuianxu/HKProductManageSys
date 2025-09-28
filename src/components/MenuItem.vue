<template>
  <div>
    <template v-for="menu in menuList" :key="menu.path">
      <el-sub-menu v-if="menu.children && menu.children.length" :index="menu.path">
        <template #title>
          <i :class="['iconfont icon-' + menu.path, 'menu-icon']"></i>
          <span>{{ menu.authName }}</span>
        </template>

        <!-- 子菜单 -->
        <MenuItem :menuList="menu.children" @menuItemClick="menuItemClick" />
      </el-sub-menu>
      <el-menu-item v-else :index="menu.path" @click="menuItemClick(menu)">
        <i :class="['iconfont', 'icon-' + ((menu.path == '/') ? 'reports' : 'menu'), 'menu-icon']"></i>
        <template #title>
          <span>{{ menu.authName }}</span>
        </template>
      </el-menu-item>
    </template>
  </div>
</template>

<script lang="ts" setup>

import { defineProps, defineEmits } from "vue";
import type { PropType } from "vue";
import type { Menus } from "@/interface";

defineOptions({
  name: "MenuItem",
});

defineProps({
  menuList: {
    type: Array as PropType<Menus[]>,
    default: () => [],
  },
});

const emit = defineEmits(["menuItemClick"]);
const menuItemClick = (item: Menus) => {
  emit("menuItemClick", item);
};
</script>

<style lang="less" scoped>
.menu-icon {
  font-size: 20px;
  margin-right: 24px;
}
</style>