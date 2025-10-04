<template>
  <div class="not-found">
    <div class="left">
      <img src="../assets/404.png" alt="" />
    </div>
    <div class="right">
      <h1>404错误！</h1>
      <h2>找不到网页</h2>
      <h6>
        对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。
      </h6>
      <el-button type="primary" round @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";
const router = useRouter();
const goHome = () => {
  router.push('/home')
}
</script>

<style lang="less" scoped>
.not-found {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  .left {
    img {
      margin-left: -100px;
      width: 600px;
      height: 330px;
    }
  }

  .right {
    width: 300px;
    height: 283px;

    h1 {
      margin-top: 0;
      font-size: 32px;
      color: #1482f0;
    }

    h2 {
      margin-top: 0;
    }

    h6 {
      margin-top: 0;
      font-size: 13px;
      line-height: 21px;
      color: grey;
    }
  }
}
</style>