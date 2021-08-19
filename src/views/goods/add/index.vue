<template>
  <div class="indexlayout-main-conent">
    <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="100px">

      <el-card shadow="never" class="cus-card">
        <el-row>
          <el-col :xs="0" :sm="2" :md="4" :lg="6" :xl="6" class="border-solid-transparent"></el-col>
          <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="12">
            <el-form-item label="商品标题" prop="name">
              <el-input v-model="modelRef.name" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="封面图片" prop="coverImg">
              <el-input v-model="modelRef.coverImg" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input type="number" v-model="modelRef.price" placeholder="请输入" />
            </el-form-item>
            <el-form-item filterable label="所属游戏" prop="gameId">
              <el-select @click="getGameList" v-model="modelRef.gameId" placeholder="请选择" clearable style="width:100%">
                <el-option label="请选择" value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属渠道" prop="channelId">
              <el-select v-model="modelRef.channelId" placeholder="请选择" clearable style="width:100%">
                <el-option label="请选择" value="0"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="商品内容" prop="content">
              <CKEditor v-model="modelRef.content" />
            </el-form-item>
            <el-form-item label="商品预览">
              <div v-html="modelRef.content"></div>
            </el-form-item>
          </el-col>
          <el-col :xs="0" :sm="2" :md="4" :lg="6" :xl="6" class="border-solid-transparent"></el-col>
          <el-col :xs="24" :sm="20" :md="16" :lg="12" :xl="12">
            <el-form-item>
              <el-button type="primary" @click="handleSubmit" :loading="submitLoading">
                提交
              </el-button>
              <el-button @click="resetFields">
                重置
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>

  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { ElForm, ElMessage } from 'element-plus';
import { GoodsFormDataType } from './data.d';
import { StateType as FormStateType } from './store';
import CKEditor from '@/components/CKEditor/index.vue';

interface FormBasicPageSetupData {
  modelRef: GoodsFormDataType;
  rulesRef: any;
  formRef: typeof ElForm;
  getGameList: () => void;
  resetFields: () => void;
  submitLoading: boolean;
  handleSubmit: () => Promise<void>;
}

export default defineComponent({
  name: 'FormBasicPage',
  components: {
    CKEditor,
  },
  setup(): FormBasicPageSetupData {
    const store = useStore<{ FormBasic: FormStateType }>();

    // 表单值
    const modelRef = reactive<GoodsFormDataType>({
      name: '',
      coverImg: '',
      price: 0.0,
      content: '',
      gameId: '',
      channelId: '',
    });
    // 表单验证
    const rulesRef = reactive({
      name: [
        {
          required: true,
          message: '必填',
        },
      ],
      coverImg: [
        {
          required: true,
          message: '必填',
        },
      ],
      price: [
        {
          required: true,
          message: '必填',
        },
      ],
      gameId: [
        {
          required: true,
          message: '请选择',
        },
      ],
    });
    // form
    const formRef = ref<typeof ElForm>();

    const getGameList = async () => {
      const res: boolean = await store.dispatch('GamesFormBasic/getGameList');
      const { data } = res;
      console.log(res);
    };

    // 重置
    const resetFields = () => {
      formRef.value && formRef.value.resetFields();
    };
    // 提交loading
    const submitLoading = ref<boolean>(false);
    // 提交
    const handleSubmit = async () => {
      console.log(modelRef);

      submitLoading.value = true;
      try {
        const valid: boolean = formRef.value ? await formRef.value.validate() : false;
        if (valid === true) {
          const res: boolean = await store.dispatch('GamesFormBasic/create', modelRef);
          if (res === true) {
            ElMessage.success('提交成功');
            resetFields();
          }
        }
      } catch (error) {
        // console.log('error', error);
      }
      submitLoading.value = false;
    };

    return {
      modelRef,
      rulesRef,
      formRef: formRef as unknown as typeof ElForm,
      getGameList,
      resetFields,
      submitLoading: submitLoading as unknown as boolean,
      handleSubmit,
    };
  },
});
</script>
<style lang="scss">
.form-basic-width100.el-input__inner {
  width: 100%;
}
</style>