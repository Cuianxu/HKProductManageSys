<template>
  <div class="category-param">
    <el-alert title="注意：只允许为第三级分类参数" type="warning" show-icon :closable="false" />
    <SearchForm v-model="searchFormData" :searchFormItems="searchFormItems" @categoryChange="categryChange">
    </SearchForm>
    <el-tabs tab-position="top" model-value="dynamic">
      <el-tab-pane label="动态参数" name="dynamic">
        <el-button type="primary" :disabled="!categoryValue" @click="addDynamicParam">添加动态参数</el-button>
        <TableView :tableData="dynamicParamList" :tableColumns="dynamicTableColumns" @edit="editDynamicParam"
          @del="delParam" />
      </el-tab-pane>
      <el-tab-pane label="静态属性" name="static">
        <el-button type="primary" :disabled="!categoryValue" @click="addStaticParam">添加静态属性</el-button>
        <TableView :tableData="staticParamList" :tableColumns="staticTableColumns" @edit="editStaticParam"
          @del="delParam" />
      </el-tab-pane>
    </el-tabs>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500">
      <el-form :model="ruleForm" ref="dialogFormRef" :rules="dialogFormRules" label-width="120px">
        <el-form-item :label="dialogTitle.slice(2)" prop="attr_name">
          <el-input v-model="ruleForm.attr_name" placeholder="请输入参数名称"></el-input>
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
import { onMounted, ref, reactive } from 'vue';
import type { SearchFormDataInterface, SearchFormItemInterface, TableColumnInterface, ParamListInterface } from '@/interface';
import { getCategoryParamList, getCurrentCategoryTableData, addCategoryParam, editCategoryParam, deleteCategoryParam } from '@/api/goodsManage';
import TableView from '@/globalComponents/TableView.vue';
import type { FormInstance, FormRules } from 'element-plus';

// 获取分类级联选择器 options
const getCategoryOptions = async () => {
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
  getCategoryOptions()
})
// 获取选择的动态参数列表
const getDynamicParamList = () => {
  getCurrentCategoryTableData(categoryValue.value, { sel: 'many' }).then(res => {
    if (res.data.meta.status === 200) {
      dynamicParamList.value = res.data.data
    }
  })
}
// 获取选择的静态属性列表
const getStaticParamList = () => {
  getCurrentCategoryTableData(categoryValue.value, { sel: 'only' }).then(res => {
    if (res.data.meta.status === 200) {
      staticParamList.value = res.data.data
    }
  })
}
const categoryValue = ref<number>(0)
// 分类改变时，获取分类参数列表
const categryChange = (val: number[]) => {
  categoryValue.value = val[val.length - 1]
  // 获取动态参数列表
  getDynamicParamList()
  // 获取静态属性列表
  getStaticParamList()
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
const dynamicParamList = ref<ParamListInterface[]>([])
const staticParamList = ref<ParamListInterface[]>([])
const dynamicTableColumns = ref<TableColumnInterface[]>([
  {
    label: '参数名称',
    prop: 'attr_name',
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
const staticTableColumns = ref<TableColumnInterface[]>([
  {
    label: '属性名称',
    prop: 'attr_name',
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
interface RuleForm {
  attr_name: string,
}
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('')
const dialogFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  attr_name: '',
})
const dialogFormRules = reactive<FormRules<RuleForm>>({
  attr_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }],
})

const addDynamicParam = () => {
  dialogTitle.value = '添加动态参数'
  dialogVisible.value = true
}
const addStaticParam = () => {
  dialogTitle.value = '添加静态属性'
  dialogVisible.value = true
}
const confirm = async () => {
  if (!dialogFormRef.value) return
  await dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (dialogTitle.value === '添加动态参数') {
        // 表单验证通过,发送请求添加动态参数
        addCategoryParam(categoryValue.value, { attr_name: ruleForm.attr_name, attr_sel: 'many' }).then(res => {
          if (res.data.meta.status === 201) {
            ElMessage.success('添加动态参数成功')
            dialogVisible.value = false
            // 刷新动态参数列表
            getDynamicParamList()
          }
        })
      } else if (dialogTitle.value === '添加静态属性') {
        // 表单验证通过,发送请求添加静态属性
        addCategoryParam(categoryValue.value, { attr_name: ruleForm.attr_name, attr_sel: 'only' }).then(res => {
          if (res.data.meta.status === 201) {
            ElMessage.success('添加静态属性成功')
            dialogVisible.value = false
            // 刷新静态属性列表
            getStaticParamList()
          }
        })
      } else if (dialogTitle.value === '编辑动态参数') {
        // 表单验证通过,发送请求编辑动态参数
        editCategoryParam(categoryValue.value, id.value, { attr_name: ruleForm.attr_name, attr_sel: 'many' })
        ElMessage.success('编辑动态参数成功')
        dialogVisible.value = false
        // 刷新动态参数列表
        setTimeout(() => {
          getDynamicParamList()
        }, 50)
      } else if (dialogTitle.value === '编辑静态属性') {
        // 表单验证通过,发送请求编辑静态属性
        editCategoryParam(categoryValue.value, id.value, { attr_name: ruleForm.attr_name, attr_sel: 'only' })
        ElMessage.success('编辑静态属性成功')
        dialogVisible.value = false
        // 刷新静态属性列表
        setTimeout(() => {
          getStaticParamList()
        }, 50)
      }
    }
  })
}
const id = ref<number>(0)
const editDynamicParam = (row: ParamListInterface) => {
  dialogTitle.value = '编辑动态参数'
  dialogVisible.value = true
  // 编辑动态参数时，将参数信息填充到表单中
  ruleForm.attr_name = row.attr_name
  id.value = row.attr_id
}
const editStaticParam = (row: ParamListInterface) => {
  dialogTitle.value = '编辑静态属性'
  dialogVisible.value = true
  // 编辑静态属性时，将属性信息填充到表单中
  ruleForm.attr_name = row.attr_name
  id.value = row.attr_id
}
const delParam = (row: ParamListInterface) => {
  ElMessageBox.confirm(
    `此操作将永久删除该参数, 是否继续?`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteCategoryParam(categoryValue.value, row.attr_id).then(res => {
        if (res.data.meta.status === 200) {
          ElMessage.success('删除参数成功')
          getDynamicParamList()
          getStaticParamList()
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '删除用户取消',
      })
    })
}
</script>

<style lang="less" scoped>
.category-param {
  .el-alert {
    margin-bottom: 20px;
  }
}
</style>