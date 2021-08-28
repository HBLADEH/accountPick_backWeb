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
            <el-form-item label="所属游戏" prop="gameId">
              <el-select @visible-change="getGameList" @change="getChannelList" v-model="modelRef.gameId" placeholder="请选择" clearable style="width:100%">
                <el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                <!-- <el-option label="请选择" value="0"></el-option> -->
              </el-select>
              <!-- <el-select-v2 @visible-change="getGameList" @change="getChannelList" :options="gameList" v-model="modelRef.gameId" placeholder="请选择" filterable style="width:100%" /> -->
            </el-form-item>
            <el-form-item label="所属渠道" prop="channelId">
              <el-select v-model="modelRef.channelId" :disabled="!channelShow" multiple placeholder="请选择" style="width:100%">
                <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="margin-bottom: 10px">
            <label for="content" class="el-form-item__label">商品内容</label>
            <CKEditor v-model="modelRef.content" />
            <label for="content" class="el-form-item__label">商品预览</label>
            <CKEditorPreview v-model="contentPreview" :toolbars="[]" :disabled="true" />
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
import { computed, defineComponent, reactive, Ref, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { ElForm, ElMessage } from 'element-plus';
import { GoodsFormDataType, SelectType } from './data.d';
import { StateType as FormStateType } from './store';
import CKEditor from '@/components/CKEditor/index.vue';
import CKEditorPreview from '@/components/CKEditor/preview.vue';

interface FormBasicPageSetupData {
  modelRef: GoodsFormDataType;
  rulesRef: any;
  contentPreview: string;
  formRef: typeof ElForm;
  gameList: SelectType[];
  channelList: SelectType[];
  channelShow: boolean;
  getGameList: () => void;
  getChannelList: () => void;
  resetFields: () => void;
  submitLoading: boolean;
  handleSubmit: () => Promise<void>;
}

export default defineComponent({
  name: 'FormBasicPage',
  components: {
    CKEditor,
    CKEditorPreview,
  },
  setup(): FormBasicPageSetupData {
    const store = useStore<{ GamesFormBasic: FormStateType }>();

    // 表单值
    const modelRef = reactive<GoodsFormDataType>({
      name: '',
      coverImg: '',
      price: '',
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
      // gameId: [
      //   {
      //     required: true,
      //     message: '请选择',
      //   },
      // ],
    });
    // form
    const formRef = ref<typeof ElForm>();

    const gameList = computed<SelectType[]>(() => store.state.GamesFormBasic.gameList);
    let getGameList = async () => {
      // const res: boolean = await store.dispatch('GamesFormBasic/getGameList');
      if (gameList.value.length == 0) store.dispatch('GamesFormBasic/getGameList');
    };

    let channelShow = ref<boolean>(false);
    // let channelList: SelectType[] = store.state.GamesFormBasic.channelList;
    let channelList = computed<SelectType[]>(() => store.state.GamesFormBasic.channelList);

    const getChannelList = async () => {
      if (modelRef.gameId == null || modelRef.gameId == '') {
        store.state.GamesFormBasic.channelList = [];
        modelRef.channelId = '';
        channelShow.value = false;
      } else {
        channelShow.value = true;
        store.dispatch('GamesFormBasic/getChannelListByGameId', modelRef.gameId);
      }
    };
    let contentPreview = ref('');

    watch(
      () => modelRef.content,
      () => {
        contentPreview.value = modelRef.content;
      }
    );
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
      contentPreview: contentPreview as unknown as string,
      gameList: gameList as unknown as SelectType[],
      channelList: channelList as unknown as SelectType[],
      channelShow: channelShow as unknown as boolean,
      getGameList,
      getChannelList,
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
.goods-label {
  text-align: left;
  margin-bottom: 10px;
}
.goods-demo {
  border: 1px solid var(--ck-color-base-border);
  padding: 10px;
  min-height: 100px;
}
</style>