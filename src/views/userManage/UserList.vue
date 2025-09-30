<template>
  <div>
    <search-form :form-data="formData" :form-items="formItems" v-on:search="search"></search-form>
    <table-view :tableData="tableData" :tableItems="tableItems" v-on:status-edit="statusUpdate"></table-view>
  </div>
</template>

<script setup lang="ts">
import TableView from '@/globalComponents/TableView.vue';
import SearchForm from '@/globalComponents/SearchForm.vue';
import { getUserList } from '@/api/user';
import { onMounted, reactive } from 'vue';
import { ref } from 'vue';
import type { UserInfo } from '@/interface';
import { statusUpdated } from '@/api/user';
const tableItems = ref([

  {
    label: '姓名',
    prop: 'username'
  }, {
    label: '邮箱',
    prop: 'email'
  },
  {
    label: '电话',
    prop: 'mobile'
  },
  {
    label: '角色',
    prop: 'role_name'
  },
  {
    label: '状态',
    prop: 'mg_state',
    componentType: 'switch'
  }
])
const formItems = [
  {
    type: 'input',
    prop: 'username',
    placeholder: '请输入用户名'
  }
]
const formData = {
  username: ''
}
const statusUpdate = async (data: any) => {
  const res = await statusUpdated(data)
  return res

}
const search = async (data: string) => {
  const res = await getUserList({
    pagenum: 1,
    pagesize: 2, username: data
  })
  console.log(res);

}

// reactive({
//                 // 用户的唯一标识符
//   role_name: '',         // 用户角色名称
//   username: '',           // 用户名
//   // 创建时间（时间戳）
//   mobile: '',             // 手机号
//   email: '',              // 邮箱
//   mg_state: '',
// })
const tableData = ref<UserInfo[]>([])
onMounted(async () => {
  const res = await getUserList()

  tableData.value = res.data.data.users
  console.log(tableData.value);

})
</script>

<style lang="less" scoped></style>