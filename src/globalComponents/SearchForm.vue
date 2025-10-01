<template>
  <div class="search-form">
    <el-form :model="searchFormDataModel" :inline="true" class="demo-form-inline">
      <el-form-item v-for="item in searchFormItems" :key="item.prop">
        <el-input v-if="item.type === 'input'" v-model="searchFormDataModel[item.prop]" :placeholder="item.placeholder"
          style="width: 240px" clearable>
          <template #append>
            <el-button :icon="Search" @click="search" />
          </template></el-input>
        <el-select v-else-if="item.type === 'select'" v-model="searchFormDataModel[item.prop]"
          :placeholder="item.placeholder">
          <el-option v-for="option in item.options" :key="option.value" :label="option.label"
            :value="option.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="add">添加用户</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { SearchFormItemInterface, SearchFormDataInterface } from '@/interface'
import type { PropType } from 'vue'
const searchFormDataModel = defineModel<SearchFormDataInterface>({
  required: true,
})
import { Search } from '@element-plus/icons-vue'
defineProps({
  searchFormItems: {
    type: Array as PropType<SearchFormItemInterface[]>,
    required: true,
    default: () => []
  }
})
const emit = defineEmits(['getUser', 'add'])
const search = () => {
  emit('getUser')
}
// 添加用户
const add = () => {
  emit('add', searchFormDataModel.value)
}
</script>

<style lang="less" scoped></style>