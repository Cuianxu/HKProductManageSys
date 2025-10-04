<template>
  <div>
    <SearchForm addButtonLabel="添加分类" @add="add"></SearchForm>
    <TableView :type="type" :tableData="goodsategoryList" :tableColumns="tableColumns" :total="total"
      :searchFormData="searchFormData" @currentChange="currentChange" @sizeChange="sizeChange">
    </TableView>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500">
      <el-form :model="ruleForm" ref="dialogFormRef" :rules="dialogFormRules" label-width="120px">
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="ruleForm.categoryName" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="ruleForm.cat_pid" placeholder="请选择分类" :options="categoryOptions" clearable :props="{
            expandTrigger: 'hover' as const,
            checkStrictly: true,
            showPrefix: false,
            checkOnClickNode: true,
          }" @change="cascaderChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirm()">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>

</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getCategoryParamList, addCategory, getGoodsCategoryList } from '@/api/goodsManage'
import type { CategoryParamListInterface, TableColumnInterface, SearchFormDataInterface } from '@/interface'
const categoryOptions = ref<{ label: string, value: number, children?: { label: string, value: number, children?: { label: string, value: number }[] }[] }[]>([])
const getCategoryOptions = async () => {
  const res = await getCategoryParamList()
  if (res.data.meta.status === 200) {
    categoryOptions.value = res.data.data.map(item => ({
      label: item.cat_name,
      value: item.cat_id,
      children: item.children?.map(child => ({
        label: child.cat_name,
        value: child.cat_id,
      })) || []
    }))
  }
}
interface RuleForm {
  categoryName: string,
  cat_level: number,
  cat_pid: number,
}
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('')
const dialogFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  categoryName: '',
  cat_level: 0,
  cat_pid: 0
})
const dialogFormRules = reactive<FormRules<RuleForm>>({
  categoryName: [{ required: true, message: '请输入分类名称', trigger: ['blur', 'change'] }],
})
const add = () => {
  dialogTitle.value = '添加分类'
  getCategoryOptions()
  dialogVisible.value = true
}
const cascaderChange = (val: any) => {
  if (val) {
    ruleForm.cat_level = val.length
    ruleForm.cat_pid = val[val.length - 1]
  }
}
const confirm = async () => {
  if (!dialogFormRef.value) return
  await dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (dialogTitle.value === '添加分类') {
        // 表单验证通过,发送请求添加分类
        addCategory({ cat_name: ruleForm.categoryName, cat_level: ruleForm.cat_level, cat_pid: ruleForm.cat_pid })
        ElMessage.success('添加分类成功')
        dialogVisible.value = false
        setTimeout(() => {
          getCategoryList()
        }, 50)
      }
    }
  })
}
const goodsategoryList = ref<CategoryParamListInterface[]>([])
const type = ref<string>('treeTable')
const tableColumns = ref<TableColumnInterface[]>([
  {
    label: '分类名称',
    prop: 'cat_name',
    align: 'left'
  },
  {
    label: '是否有效',
    prop: 'cat_deleted',
    slots: "icon",
  },
  {
    label: '排序',
    prop: 'cat_level',
    slots: "tag"
  },
  {
    label: '操作',
    prop: '',
    slots: 'action',
    btns: {}
  },
])
const total = ref<number>(0)
const getCategoryList = async () => {
  const res = await getGoodsCategoryList(searchFormData.value)
  if (res.data.meta.status === 200) {
    goodsategoryList.value = res.data.data.result
    total.value = res.data.data.total
  }
}
onMounted(() => {
  getCategoryList()
})
const searchFormData = ref<SearchFormDataInterface>({
  type: 3,
  pagenum: 1,
  pagesize: 5
})
const sizeChange = (val: number) => {
  searchFormData.value.pagesize = val
  getCategoryList()
}
const currentChange = (val: number) => {
  searchFormData.value.pagenum = val
  getCategoryList()
}
</script>

<style lang="less" scoped></style>