<template>
  <div class="user-list">
    <SearchForm v-model="searchFormData" :searchFormItems="searchFormItems" addButtonLabel="添加用户" @search="getUser"
      @add="add">
    </SearchForm>
    <TableView :tableData="userList" :tableColumns="tableColumns" :total="total" :searchFormData="searchFormData"
      @switchChange="switchChange" @edit="edit" @del="del" @allocate="allocate" @currentChange="currentChange"
      @sizeChange="sizeChange">
    </TableView>
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500">
      <el-form v-if="dialogTitle === '分配角色'" :model="ruleForm" ref="dialogFormRef" label-width="120px">
        <el-form-item label="当前用户:">
          {{ ruleForm.username }}
        </el-form-item>
        <el-form-item label="当前角色:">
          {{ ruleForm.role_name }}
        </el-form-item>
        <el-form-item label="分配角色:">
          <el-select v-model="ruleForm.selectedRoleId" placeholder="请选择角色">
            <el-option v-for="role in roleOptions" :key="role.id" :label="role.roleName" :value="role.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form v-else :model="ruleForm" :rules="dialogFormRules" ref="dialogFormRef" label-width="120px">
        <el-form-item label="用户名" :prop="dialogTitle === '添加用户' ? 'username' : ''">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名" :disabled="dialogTitle === '编辑用户'"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogTitle === '添加用户'" label="密码" prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="ruleForm.mobile" placeholder="请输入电话"></el-input>
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
import { getUserList, changeStatus, addUser, editUser, deleteUser, getRoleList, changeRole } from '@/api/userManage'
import type { SearchFormItemInterface, TableColumnInterface, UserTableDataInterface, SearchFormDataInterface } from '@/interface'
import type { FormInstance, FormRules } from 'element-plus'

const searchFormData = ref<SearchFormDataInterface>({
  username: '',
  pagenum: 1,
  pagesize: 2
})
const searchFormItems = ref<SearchFormItemInterface[]>([
  {
    label: '',
    prop: 'username',
    placeholder: '请输入用户名',
    type: 'input'
  }
])

const userList = ref<UserTableDataInterface[]>([])
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
      del: true,
      allocate: true,
      allocateLabel: '分配角色',
    }
  }
])
const total = ref<number>(0)
const getUser = (params = {
  query: searchFormData.value.username as string,
  pagenum: searchFormData.value.pagenum,
  pagesize: searchFormData.value.pagesize,
}) => {
  getUserList(params).then(res => {
    userList.value = res.data.data.users
    total.value = res.data.data.total
  })
}
onMounted(() => {
  getUser({ query: '', pagenum: 1, pagesize: 2 })
})

interface RuleForm {
  id?: number
  username: string
  password?: string
  email: string
  mobile: string
  role_name?: string
  selectedRoleId?: number
}
const dialogVisible = ref<boolean>(false)
const dialogTitle = ref<string>('')
const dialogFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  username: '',
  password: '',
  email: '',
  mobile: '',
})
const dialogFormRules = reactive<FormRules<RuleForm>>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' },
  { type: 'email', message: '请输入正确的邮箱格式', trigger: ['blur', 'change'] }
  ],
  mobile: [{ required: true, min: 11, max: 11, message: '请输入正确的电话格式', trigger: ['blur', 'change'] }
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' },
  { min: 6, max: 12, message: '密码长度在 6 到 12 个字符', trigger: ['blur', 'change'] }
  ]
})

// 添加用户
const add = () => {
  dialogTitle.value = '添加用户'
  dialogVisible.value = true
}
// 确认添加用户、确认删除、分配角色
const confirm = async () => {
  if (dialogTitle.value === '分配角色') {
    changeRole(ruleForm.id!, { rid: ruleForm.selectedRoleId! })
    ElMessage.success('分配角色成功')
    dialogVisible.value = false
    setInterval(() => {
      getUser()
    }, 50)
  }
  if (!dialogFormRef.value) return
  await dialogFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (dialogTitle.value === '添加用户') {
        // 表单验证通过,发送请求添加用户
        addUser({ username: ruleForm.username, password: ruleForm.password!, email: ruleForm.email, mobile: ruleForm.mobile }).then(res => {
          if (res.data.meta.status === 201) {
            ElMessage.success('添加用户成功')
            dialogVisible.value = false
            getUser()
          }
        })
      } else if (dialogTitle.value === '编辑用户') {
        // 表单验证通过,发送请求编辑用户
        editUser({ id: ruleForm.id!, email: ruleForm.email, mobile: ruleForm.mobile })
        ElMessage.success('编辑用户成功')
        dialogVisible.value = false
        getUser();
      }
    }
  })
}
// 切换状态
const switchChange = (row: UserTableDataInterface) => {
  changeStatus({ id: row.id, status: Boolean(row.mg_state) })
}

const edit = (row: UserTableDataInterface) => {
  dialogTitle.value = '编辑用户'
  dialogVisible.value = true
  // 编辑用户时，将用户信息填充到表单中
  ruleForm.id = row.id
  ruleForm.username = row.username
  ruleForm.password = row.password
  ruleForm.email = row.email
  ruleForm.mobile = row.mobile
}
const del = (row: UserTableDataInterface) => {
  ElMessageBox.confirm(
    `确认永久删除用户 ${row.username} 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      deleteUser({ id: row.id }).then(res => {
        if (res.data.meta.status === 200) {
          ElMessage.success('删除用户成功')
          getUser()
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
// 分配角色
const roleOptions = ref<any[]>([])
const allocate = (row: UserTableDataInterface) => {
  dialogTitle.value = '分配角色'
  // 分配角色时，将用户信息填充到表单中
  ruleForm.id = row.id
  ruleForm.username = row.username
  ruleForm.role_name = row.role_name
  // 获取角色列表
  getRoleList().then(res => {
    roleOptions.value = res.data.data
  })
  dialogVisible.value = true
}

const sizeChange = (val: number) => {
  searchFormData.value.pagesize = val
  getUser()
}
const currentChange = (val: number) => {
  searchFormData.value.pagenum = val
  getUser()
}
</script>

<style lang="less" scoped></style>