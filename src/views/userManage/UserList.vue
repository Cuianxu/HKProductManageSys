<template>
  <div>
    <table-view :tableData="tableData" :tableItems="tableItems" v-on:status-edit="statusUpdate"></table-view>
  </div>
</template>

<script setup lang="ts">
import TableView from '@/globalComponents/TableView.vue';
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
const statusUpdate = async (data: any) => {
  const res = await statusUpdated(data)
  return res

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