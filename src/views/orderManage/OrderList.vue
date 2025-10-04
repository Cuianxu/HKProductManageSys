<template>
  <div class="order-list">
    <SearchForm v-model="searchFormData" :searchFormItems="searchFormItems" @search="getOrder">
    </SearchForm>
    <TableView :tableData="orderList" :tableColumns="tableColumns" :total="total" :searchFormData="searchFormData"
      @currentChange="currentChange" @sizeChange="sizeChange">
    </TableView>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue';
import { getOrderList } from '@/api/orderManage'
import type { SearchFormItemInterface, TableColumnInterface, OrderTableDataInterface, SearchFormDataInterface } from '@/interface'

const searchFormData = ref<SearchFormDataInterface>({
  order_number: '',
  pagenum: 1,
  pagesize: 10
})
const searchFormItems = ref<SearchFormItemInterface[]>([
  {
    label: '',
    prop: 'order_number',
    placeholder: '请输入订单号',
    type: 'input'
  }
])

const orderList = ref<OrderTableDataInterface[]>([])
const tableColumns = ref<TableColumnInterface[]>([
  {
    label: '订单编号',
    prop: 'order_number',
  },
  {
    label: '订单价格',
    prop: 'order_price',
  },
  {
    label: '支付状态',
    prop: 'pay_status',
    slots: 'tag'
  },
  {
    label: '是否发货',
    prop: 'is_send',
  },
  {
    label: '下单时间',
    prop: 'create_time',
  },
  {
    label: '操作',
    prop: '',
    slots: 'action',
    btns: {}
  }
])
const total = ref<number>(0)
const getOrder = (params = {
  query: searchFormData.value.order_number as string,
  pagenum: searchFormData.value.pagenum,
  pagesize: searchFormData.value.pagesize,
}) => {
  getOrderList(params).then(res => {
    orderList.value = res.data.data.goods
    total.value = res.data.data.total
  })
}
onMounted(() => {
  getOrder()
})

const sizeChange = (val: number) => {
  searchFormData.value.pagesize = val
  getOrder()
}
const currentChange = (val: number) => {
  searchFormData.value.pagenum = val
  getOrder()
}
</script>

<style lang="less" scoped></style>