<template>
  <div>
    <SearchForm v-model="searchFormData" :searchFormItems="searchFormItems" @getUser="getUser" @add="add">
    </SearchForm>
    <TableView :tableData="tableData" :tableColumns="tableColumns" :total="total" :searchFormData="searchFormData"
      @switchChange="switchChange" @edit="edit" @del="del" @allocate="allocate" @currentChange="currentChange"
      @sizeChange="sizeChange">
    </TableView>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getUserList } from '@/api/userManage'
import type { SearchFormItemInterface, TableColumnInterface } from '@/interface'
export interface SearchFormDataInterface {
  username: string
  pagenum: number
  pagesize: number
}
const searchFormData = ref<SearchFormDataInterface>({
  username: '',
  pagenum: 1,
  pagesize: 2
})
const searchFormItems = ref<SearchFormItemInterface[]>([
  {
    label: '用户名',
    prop: 'username',
    placeholder: '请输入用户名',
    type: 'input'
  }
])
export interface TableDataInterface {
  id: number,
  username: string,
  mobile: string,
  email: string,
  role_name: string,
  mg_state: Boolean,
  create_time: number,
}
const tableData = ref<TableDataInterface[]>([])
const tableColumns = ref<TableColumnInterface[]>([
  {
    label: '用户名',
    prop: 'username',
  },
  {
    label: '邮箱',
    prop: 'email',
  },
  {
    label: '电话',
    prop: 'mobile',
  },
  {
    label: '角色',
    prop: 'role_name',
  },
  {
    label: '状态',
    prop: 'mg_state',
    slots: 'switch'
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
      allocate: true,
      allocateLabel: '分配角色',
    }
  }
])
const total = ref<number>(0)
const getUser = () => {
  console.log(searchFormData.value)
  getUserList(searchFormData.value).then(res => {
    tableData.value = res.data.data.users
    total.value = res.data.data.total
  })
}
onMounted(() => {
  getUser()
})
// 添加用户
const add = () => {
  console.log('添加用户')
}
// 切换状态
const switchChange = (row: TableDataInterface) => {
  console.log('切换状态，发请求修改数据', row)
}

const edit = (row: TableDataInterface) => {
  console.log('edit', row)
}
const del = (row: TableDataInterface) => {
  console.log('del', row)
}
// 切换角色
const allocate = (row: TableDataInterface) => {
  console.log('切换角色', row)
}

const sizeChange = (val: number) => {
  console.log('换页了')
}
const currentChange = (val: number) => {
  console.log('总页数改变了')
}
</script>

<style lang="less" scoped></style>