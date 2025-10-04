<template>
  <div>
    <SearchForm v-model="searchFormData" :searchFormItems="searchFormItems" addButtonLabel="添加商品" @search="getGoods"
      @add="add">
    </SearchForm>
    <TableView :tableData="goodsList" :tableColumns="tableColumns" :total="total" :searchFormData="searchFormData"
      @edit="edit" @del="del" @sizeChange="sizeChange" @currentChange="currentChange"></TableView>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import router from '@/router'
import { getGoodsList, deleteGoodsItem } from '@/api/goodsManage'
import type { GoodsTableDataInterface, SearchFormDataInterface, SearchFormItemInterface, TableColumnInterface } from '@/interface'

const goodsList = ref<GoodsTableDataInterface[]>()
const searchFormData = ref<SearchFormDataInterface>({
  query: '',
  pagenum: 1,
  pagesize: 10,
})
const searchFormItems = ref<SearchFormItemInterface[]>([
  {
    label: '商品名称',
    prop: 'goods_name',
    placeholder: '请输入商品名称',
    type: 'input'
  },
])
const tableColumns = ref<TableColumnInterface[]>([
  {
    label: '商品名称',
    prop: 'goods_name',
    width: '600px',
    align: 'left',
  },
  {
    label: '商品单价(元)',
    prop: 'goods_price',
  },
  {
    label: '商品重量',
    prop: 'goods_weight',
  },
  {
    label: '创建时间',
    prop: 'add_time',
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
  }
])

const total = ref<number>(0)
const getGoods = (params: SearchFormDataInterface = {
  query: searchFormData.value.query,
  pagenum: searchFormData.value.pagenum,
  pagesize: searchFormData.value.pagesize,
}) => {
  getGoodsList(params).then(res => {
    goodsList.value = res.data.data.goods
    total.value = res.data.data.total
  })
}
onMounted(() => {
  getGoods()
  ElMessage.success('获取商品列表成功')
})

const add = () => {
  router.push({ name: 'AddGoods' }).then(() => {
    window.location.reload()
  })
}
const edit = () => {
  return
}
const del = (row: GoodsTableDataInterface) => {
  ElMessageBox.confirm(
    `此操作将永久删除该商品，确定继续吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteGoodsItem({ id: row.goods_id }).then(res => {
        if (res.data.meta.status === 200) {
          ElMessage.success('删除商品成功')
          getGoods()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除商品取消',
      })
    })
}

const sizeChange = (val: number) => {
  searchFormData.value.pagesize = val
  getGoods()
}
const currentChange = (val: number) => {
  searchFormData.value.pagenum = val
  getGoods()
}
</script>

<style lang="less" scoped></style>