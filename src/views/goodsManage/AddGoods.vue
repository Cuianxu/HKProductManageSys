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
    <el-tabs v-model="activeTab" tab-position="left" @tab-click="tabClick">
      <el-tab-pane label="基本信息" :name="0">
        <el-form :model="basicInfoFormData" :rules="basicInfoFormRules" ref="formRef" label-width="90px">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="basicInfoFormData.goods_name" placeholder="请输入商品名称" />
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input-number v-model="basicInfoFormData.goods_price" :min="0" controls-position="right" />
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_weight">
            <el-input-number v-model="basicInfoFormData.goods_weight" :min="0" controls-position="right" />
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_number">
            <el-input-number v-model="basicInfoFormData.goods_number" :min="0" controls-position="right" />
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader :options="goodsategoryList" placeholder="请选择商品分类" clearable :props="{
              expandTrigger: 'hover' as const,
            }" @change="cascaderChange">
            </el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数" :name="1">
        <el-form :model="basicInfoFormData" ref="paramFormRef">
          <template v-for="(item, index) in dynamicParamList" :key="index">
            <span>{{ item.attr_name }}</span>
            <el-form-item>
              <el-checkbox-group v-model="checkeds[index].attr_vals" size="small">
                <template v-if="item.attr_vals">
                  <el-checkbox v-for="(val, index) in item.attr_vals.split(' ')" :label="val" :key="index" border>{{ val
                  }}</el-checkbox>
                </template>
              </el-checkbox-group>
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品属性" :name="2">
        <el-form :model="basicInfoFormData" ref="attrFormRef">
          <template v-for="(item, index) in staticParamList" :key="index">
            <span>{{ item.attr_name }}</span>
            <el-form-item>
              <el-input v-model="staticParamList[index].attr_vals" placeholder="请输入商品属性" />
            </el-form-item>
          </template>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" :name="3">
        <!-- 图片上传 -->
        <el-upload v-model:file-list="basicInfoFormData.pics" class="upload-demo"
          action="http://127.0.0.1:8888/api/private/v1/upload" :on-preview="handlePreview" list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容" :name="4">
        <!-- 富文本编辑器容器 -->
        <div class="editor-container">
          <div ref="editorRef" class="quill-editor"></div>
        </div>
        <el-button size="small" type="primary" @click="addGoods">添加商品</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useRouter } from 'vue-router';
import { getCategoryParamList, getCurrentCategoryTableData, addGoodsItem } from "@/api/goodsManage";
import type { ParamListInterface } from "@/interface";
import type { FormInstance, FormRules, UploadUserFile, UploadProps } from "element-plus";
import type { TabsPaneContext } from "element-plus";
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // 引入Quill样式

// 富文本编辑器相关
const editorRef = ref<HTMLElement>();
let quillEditor: Quill | null = null;
const isEditorInitialized = ref(false); // 添加标志位，防止重复初始化

// 初始化富文本编辑器
const initEditor = () => {
  if (!editorRef.value || isEditorInitialized.value) {
    return; // 如果编辑器已经初始化，直接返回
  }
  // 配置工具栏选项
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // 切换按钮
    ['blockquote', 'code-block'],

    [{ 'header': 1 }, { 'header': 2 }],               // 自定义按钮值
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // 上标/下标
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // 减少缩进/缩进
    [{ 'direction': 'rtl' }],                         // 文本下方向

    [{ 'size': ['small', false, 'large', 'huge'] }],  // 自定义下拉
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // 主题默认下拉，使用主题提供的值
    [{ 'font': [] }],
    [{ 'align': [] }],

    ['image', 'video'],

    ['clean']                                         // 清除格式
  ];

  // 创建编辑器实例
  quillEditor = new Quill(editorRef.value, {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions
    },
    placeholder: '请输入商品详细介绍...',
    formats: [
      'bold', 'italic', 'underline', 'strike',
      'blockquote', 'code-block', 'header',
      'list', 'script', 'indent', 'direction',
      'size', 'color', 'background', 'font',
      'align', 'image', 'video'
    ]
  });
  // 设置初始内容
  if (basicInfoFormData.goods_introduce) {
    quillEditor.root.innerHTML = basicInfoFormData.goods_introduce;
  }
  quillEditor.on('text-change', () => {
    basicInfoFormData.goods_introduce = quillEditor?.root.innerHTML || '';
  });

  isEditorInitialized.value = true; // 标记编辑器已初始化
}

const activeStep = ref(0);
const activeTab = ref(0);
const goodsategoryList = ref<{
  label: string
  value: number
  children?: {
    label: string
    value: number
    children?: {
      label: string
      value: number
    }[]
  }[]
}[]>([])
const getGoodsCategory = async () => {
  const res = await getCategoryParamList()
  if (res.data.meta.status === 200) {
    goodsategoryList.value = res.data.data.map(item => ({
      label: item.cat_name,
      value: item.cat_id,
      children: item.children?.map(child => ({
        label: child.cat_name,
        value: child.cat_id,
        children: child.children?.map(grandchild => ({
          label: grandchild.cat_name,
          value: grandchild.cat_id,
        }))
      }))
    }))
  }
}
onMounted(() => {
  getGoodsCategory()
})
const categoryValue = ref<number>(0)
const cascaderChange = (val: any) => {
  if (val) {
    categoryValue.value = val[val.length - 1]
    basicInfoFormData.goods_cat = val.join(',')
  }
}
// 监听 tab 变化，同步到 steps
watch(activeTab, (newVal) => {
  activeStep.value = Number(newVal);
  if (newVal === 4) {
    // 使用nextTick确保DOM已更新
    nextTick(() => {
      initEditor();
    });
  }
});

const formRef = ref<FormInstance>()
const tabClick = async (tab: TabsPaneContext) => {
  if (tab.props.name === activeTab.value) {
    return
  }
  // 表单校验通过才可以切换到其他标签
  if (!formRef.value) return
  await formRef.value.validate((valid, fields) => {
    if (valid) {
      activeTab.value = Number(tab.props.name)
    } else {
      ElMessage.error('请填写完整信息')
      activeTab.value = 0
      return
    }
  })
  // 切换到商品参数标签时，获取分类参数列表
  if (tab.props.name === 1) {
    // 获取动态参数列表
    getDynamicParamList()
  } else if (tab.props.name === 2) {
    // 获取静态属性列表
    getStaticParamList()
  }
};
interface RuleForm {
  attrs?: Array<{
    attr_id: number,
    attr_value: string
  }>
  goods_name: string
  goods_price: number
  goods_weight: number
  goods_number: number
  goods_cat: string
  pics: UploadUserFile[]
  goods_introduce: string
}
const basicInfoFormData = reactive<RuleForm>({
  attrs: [],
  goods_name: '',
  goods_price: 0,
  goods_weight: 0,
  goods_number: 0,
  goods_cat: '',
  pics: [],
  goods_introduce: ''
})
const basicInfoFormRules = reactive<FormRules<RuleForm>>({
  goods_name: [{ required: true, message: '请输入商品名称', trigger: ['blur', 'change'] }],
  goods_price: [{ required: true, message: '请输入商品单价', trigger: ['blur', 'change'] },
  {
    validator: (rule, value, callback) => {
      if (Number(value) <= 0) {
        callback(new Error('单价必须大于0'));
      } else {
        callback();
      }
    },
    trigger: ['blur', 'change']
  }
  ],
  goods_weight: [{ required: true, message: '请输入商品重量', trigger: ['blur', 'change'] },
  {
    validator: (rule, value, callback) => {
      if (Number(value) <= 0) {
        callback(new Error('重量必须大于0'));
      } else {
        callback();
      }
    },
    trigger: ['blur', 'change']
  }
  ],
  goods_number: [{ required: true, message: '请输入商品数量', trigger: ['blur', 'change'] },
  {
    validator: (rule, value, callback) => {
      if (Number(value) <= 0) {
        callback(new Error('数量必须大于0'));
      } else {
        callback();
      }
    },
    trigger: 'blur'
  }
  ],
  goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }],
  pics: [{ required: true, message: '请上传商品图片', trigger: 'blur' }],
  goods_introduce: [{ required: true, message: '请输入商品介绍', trigger: 'blur' }],
})
const dynamicParamList = ref<ParamListInterface[]>([])
const checkeds = ref<{ attr_id: number, attr_vals: string[] }[]>([])
// 获取选择的动态参数列表
const getDynamicParamList = () => {
  getCurrentCategoryTableData(categoryValue.value, { sel: 'many' }).then(res => {
    if (res.data.meta.status === 200) {
      dynamicParamList.value = res.data.data
      checkeds.value = res.data.data.map(item => ({
        attr_id: item.attr_id,
        attr_vals: item.attr_vals.split(' ')
      }))
      basicInfoFormData.attrs = res.data.data.map(item => ({
        attr_id: item.attr_id,
        attr_value: checkeds.value.find(checked => checked.attr_id === item.attr_id)?.attr_vals.join(' ') || ''
      }))
    }
  })
}
const staticParamList = ref<ParamListInterface[]>([])
// 获取选择的静态属性列表
const getStaticParamList = () => {
  getCurrentCategoryTableData(categoryValue.value, { sel: 'only' }).then(res => {
    if (res.data.meta.status === 200) {
      staticParamList.value = res.data.data
      basicInfoFormData.attrs = basicInfoFormData.attrs!.concat(res.data.data.map(item => ({
        attr_id: item.attr_id,
        attr_value: item.attr_vals.split(' ')[0]
      })))
    }
  })
}

// 图片预览
const handlePreview: UploadProps['onPreview'] = (file) => {
  window.open(file.url)
}
// 添加商品
const router = useRouter();
const addGoods = () => {
  // 提交表单数据
  addGoodsItem(basicInfoFormData).then(res => {
    if (res.data.meta.status === 201) {
      ElMessage.success('添加商品成功')
      activeStep.value = 4
      // 重置表单
      formRef.value?.resetFields()
      router.push({ name: 'Goods' })
    } else {
      ElMessage.error(res.data.meta.msg)
    }
  })
}
// 组件销毁时清理编辑器
onBeforeUnmount(() => {
  if (quillEditor) {
    quillEditor = null;
  }
});
</script>

<style lang="less" scoped>
.add-goods {
  .el-alert {
    margin-bottom: 10px;
  }

  .el-steps {
    margin-bottom: 20px;
  }

  :deep(.ql-editor) {
    font-size: 14px;
    line-height: 1.6;
    min-height: 350px;

    p {
      margin-bottom: 1em;
    }

    img {
      max-width: 100%;
      height: auto;
    }
  }
}
</style>