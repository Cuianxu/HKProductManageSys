<template>
  <div>
    <el-form :model="searchFormData" label-width="auto">
      <el-form-item v-for="item in formItems">
        <template #default="scope" v-if="item.type == 'input'">

          <el-input v-model="searchFormData[item.prop]" style="width:300px;height:40px;"
            :placeholder="item.placeholder" />
          <el-button style="width:55px;height:40px;border-radius: 0 4px 4px 0;"
            @click="search(searchFormData[item.prop])"><el-icon>
              <Search />
            </el-icon></el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';

const props = defineProps<{
  formItems: any,
  formData: any
}>()
const emits = defineEmits(['search'])
const search = (data: any) => {
  emits('search', data)
  console.log(data);

}
const searchFormData = reactive<Record<string, any>>({

})
onMounted(() => {
  Object.assign(searchFormData, { ...props.formData })
  console.log(searchFormData);

})
</script>

<style lang="less" scoped>
::v-deep .el-input__wrapper {
  border-radius: 4px 0 0 4px;
  border-right: 0;
}

::v-deep .el-button {
  border-left: 0;
  background-color: #F5F7FA;
}
</style>