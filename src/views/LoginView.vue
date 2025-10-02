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
          <!-- 这里调用的是防抖之后的函数 -->
          <el-button @click="debouncedLogin" type="primary">登录</el-button>
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
const store = useStore();

const loginFormData = reactive({
  username: "",
  password: "",
});

onMounted(() => {
  console.log(store.token);
});

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

// 通用防抖函数封装
function useDebounce<T extends (...args: any[]) => any>(fn: T, delay = 500) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

// 登录逻辑
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
      store.token = res.data.data.token;
      router.push("/home");
    } else {
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

// 用防抖包装 login
const debouncedLogin = useDebounce(login, 1000);

// 重置登录表单
const resetForm = () => {
  loginFormRef.value.resetFields();
  loginFormData.username = "";
  loginFormData.password = "";
};
</script>
