<template>
  <div id="login" v-loading="loading" element-loading-text="Loading...">
    <div class="login_form">
      <h1>登录</h1>
      <el-form ref="loginFormRef" :model="loginFormData" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginFormData.username" type="text" placeholder="用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginFormData.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item class="login_form_btns">
          <el-button @click="login" type="primary">登录</el-button>
          <el-button @click="resetForm" type="info">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { loginReq } from "@/api/login";
import { useRouter } from "vue-router";
import { useStore } from "@/stores/store";
const router = useRouter();
const loginFormRef = ref();
const loading = ref(false);
const store = useStore()
const loginFormData = reactive({
  username: "",
  password: "",
});
onMounted(() => {
  console.log(store.token);

})
// 用户名和密码的校验规则
const loginFormRules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    {
      min: 6,
      max: 12,
      message: "密码长度必须在 6 到 12 个字符",
      trigger: "blur",
    },
  ],
});

// 点击登录进行表单校验并跳转welcome页
const login = async () => {
  if (!loginFormRef.value) return;
  try {
    // 校验表单数据
    const valid = await loginFormRef.value.validate();
    if (!valid) return;
    loading.value = true;
    const res = await loginReq(loginFormData);
    if (res.data.meta.status === 200) {
      ElMessage({
        message: res.data.meta.msg,
        type: "success",
      });
      window.localStorage.setItem("token", res.data.data.token);
      store.token = res.data.data.token
      router.push("/home");
    } else {
      // 处理非200状态码的错误
      ElMessage({
        message: res.data.meta.msg,
        type: "error",
      });
    }
  } catch (err) {
    if (err instanceof Error) {
      ElMessage({
        message: err.message,
        type: "error",
      });
    } else {
      ElMessage({
        message: "登录失败",
        type: "error",
      });
    }
  } finally {
    loading.value = false;
  }
};
// 重置登录表单
const resetForm = () => {
  loginFormRef.value.resetFields();
  loginFormData.username = "";
  loginFormData.password = "";
};
</script>

<style lang="less" scoped>
#login {
  background: url("../assets/background.jpg");
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .login_form {
    width: 450px;
    background: #ffffff26;
    padding: 30px 40px;
    border-radius: 10px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(5px);

    h1 {
      text-align: center;
      margin-bottom: 30px;
      color: #333;
    }

    .login_form_btns {
      float: right;
    }
  }
}
</style>