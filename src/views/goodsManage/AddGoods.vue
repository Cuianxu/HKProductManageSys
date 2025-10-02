<template>
  <div class="add-goods">
    <el-alert title="添加商品信息" type="info" center show-icon :closable="false" />
    <el-steps :active="activeStep" align-center finish-status="success">
      <el-step title="基本信息" />
      <el-step title="商品参数" />
      <el-step title="商品属性" />
      <el-step title="商品图片" />
      <el-step title="商品内容" />
      <el-step title="完成" />
    </el-steps>
    <el-tabs tab-position="left">
      <el-tab-pane label="基本信息">基本信息</el-tab-pane>
      <el-tab-pane label="商品参数">商品参数</el-tab-pane>
      <el-tab-pane label="商品属性">商品属性</el-tab-pane>
      <el-tab-pane label="商品图片">商品图片</el-tab-pane>
      <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const activeStep = ref(0);
</script>

<style lang="less" scoped>
.add-goods {
  .el-alert {
    margin-bottom: 10px;
  }

  .el-steps {
    margin-bottom: 20px;
  }
}
</style>
