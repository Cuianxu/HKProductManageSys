<template>
  <div class="permission-list">
    <TableView :tableData="tableData" :tableColumns="tableColumns" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { RightTableDataInterface, TableColumnInterface } from '@/interface'
import { getRightList } from '@/api/rightManage'

const tableData = ref<RightTableDataInterface[]>([])
const tableColumns = ref<TableColumnInterface[]>([
  {
    prop: 'authName',
    label: '权限名称',
  },

  {
    prop: 'path',
    label: '权限路径',
  },
  {
    prop: 'level',
    label: '权限等级',
    slots: 'tag',
  },
])

onMounted(() => {
  const res = getRightList().then(res => {
    if (res.data.meta.status === 200) {
      tableData.value = res.data.data
    }
  })
})

</script>

<style lang="less" scoped></style>