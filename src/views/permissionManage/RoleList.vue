<template>
  <div class="role-list">
    <SearchForm addButtonLabel="添加角色" @add="add">
    </SearchForm>
    <TableView :tableData="tableData" :tableColumns="tableColumns" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { RoleTableDataInterface, TableColumnInterface } from '@/interface'
import { getRoleList } from '@/api/userManage'

const add = () => {
  return
}
const tableData = ref<RoleTableDataInterface[]>([])
const tableColumns = ref<TableColumnInterface[]>([
  {
    label: '角色名称',
    prop: 'roleName',
  },
  {
    label: '角色描述',
    prop: 'roleDesc',
  },
  {
    label: '操作',
    prop: '',
    slots: "action",
    btns: {
      edit: false,
      del: false,
      allocate: false
    }
  }
])

onMounted(async () => {
  const res = await getRoleList()
  if (res.data.meta.status === 200) {
    tableData.value = res.data.data
  }
})
</script>

<style lang="less" scoped></style>