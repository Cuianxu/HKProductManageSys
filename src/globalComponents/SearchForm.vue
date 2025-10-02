<template>
  <div class="search-form">
    <el-form :model="searchFormDataModel" :inline="true" class="demo-form-inline">
      <el-form-item v-for="item in searchFormItems" :key="item.prop" :label="item.label">
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
        <el-cascader v-else-if="item.type === 'cascader'" :placeholder="item.placeholder"
          v-model="searchFormDataModel[item.prop]" :options="item.options" :props="{
            expandTrigger: 'hover' as const,
          }" @change="cascaderChange" />
      </el-form-item>
      <el-form-item>
        <el-button v-if="addButtonLabel" type="primary" @click="add">{{ addButtonLabel }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { SearchFormItemInterface, SearchFormDataInterface } from '@/interface'
import type { PropType } from 'vue'
import { Search } from '@element-plus/icons-vue'
const searchFormDataModel = defineModel<SearchFormDataInterface>({
  default: () => ({
    userName: '',
    roleName: ''
  })
})

defineProps({
  searchFormItems: {
    type: Array as PropType<SearchFormItemInterface[]>,
    default: () => []
  },
  addButtonLabel: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['search', 'add', 'categoryChange'])
const search = () => {
  emit('search')
}
// 添加用户
const add = () => {
  emit('add')
}
const cascaderChange = (val: any) => {
  emit('categoryChange', val)
}
</script>

<style lang="less" scoped></style>