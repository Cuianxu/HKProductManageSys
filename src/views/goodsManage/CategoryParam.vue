<template>
  <div class="category-param">
    <el-alert title="注意：只允许为第三级分类参数" type="warning" show-icon :closable="false" />
    <SearchForm v-model="searchFormData" :searchFormItems="searchFormItems" @categoryChange="categryChange">
    </SearchForm>
    <TableView :tableData="paramList" :tableColumns="tableColumns" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { SearchFormDataInterface, SearchFormItemInterface, TableColumnInterface, CategoryParamListInterface } from '@/interface';
import { getCategoryParamList } from '@/api/goodsManage';
import TableView from '@/globalComponents/TableView.vue';

const getCategoryList = async () => {
  const res = await getCategoryParamList()
  if (res.data.meta.status === 200) {
    searchFormItems.value[0].options = res.data.data.map(item => ({
      label: item.cat_name,
      value: item.cat_id,
      children: item.children?.map(child => ({
        label: child.cat_name,
        value: child.cat_id,
        children: child.children?.map(grandchild => ({
          label: grandchild.cat_name,
          value: grandchild.cat_id,
        })) || []
      })) || []
    }))
  }
}
onMounted(() => {
  getCategoryList()
})
const categryChange = (val: number[]) => {
  console.log(111, val)
}
const searchFormData = ref<SearchFormDataInterface>({
  query: '',
  pagenum: 1,
  pagesize: 10,
})
const searchFormItems = ref<SearchFormItemInterface[]>([
  {
    label: '选择商品分类',
    prop: 'cat_id',
    type: 'cascader',
    placeholder: '请选择商品分类',
    options: []
  }
])
const paramList = ref<CategoryParamListInterface[]>([])
const tableColumns = ref<TableColumnInterface[]>([
  {
    label: '参数名称',
    prop: 'param_name',
  },
  {
    label: '操作',
    prop: '',
    slots: 'action',
    btns: {
      edit: true,
      editLabel: '编辑',
      del: true,
      delLabel: '删除',
    }
  },
])
</script>

<style lang="less" scoped>
.category-param {
  .el-alert {
    margin-bottom: 20px;
  }
}
</style>