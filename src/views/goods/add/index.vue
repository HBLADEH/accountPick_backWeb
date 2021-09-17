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
              <!-- <el-input v-model="modelRef.coverImg" placeholder="请输入" /> -->
              <el-upload class="avatar-uploader" action="/api/goods/uploadCoverImg" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="modelRef.coverImg" :src="modelRef.coverImg" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="价格" prop="price">
              <el-input type="number" v-model="modelRef.price" placeholder="请输入" />
            </el-form-item>
            <el-form-item label="所属游戏" prop="gameId">
              <el-select @visible-change="getGameList" @change="getChannelList" v-model="modelRef.gameId" placeholder="请选择" filterable clearable style="width:100%">
                <el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属渠道" prop="channelId">
              <el-select v-model="modelRef.channelId" :disabled="!channelShow" placeholder="请选择" filterable clearable style="width:100%">
                <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col style="margin-bottom: 10px">
            <label for="content" class="el-form-item__label">商品内容</label>
            <CKEditor v-model="modelRef.content" />
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
import { GoodsFormDataType } from '../util/from/data';
import { SelectType } from '../util/select/data';
import { StateType as FormStateType } from './store';
import { StateType as SelectStateType } from '../util/select/store';
import CKEditor from '@/components/CKEditor/index.vue';

interface FormBasicPageSetupData {
  modelRef: GoodsFormDataType;
  rulesRef: any;
  formRef: typeof ElForm;
  gameList: SelectType[];
  channelList: SelectType[];
  channelShow: boolean;
  getGameList: () => void;
  getChannelList: () => void;
  resetFields: () => void;
  handleAvatarSuccess: (res: any, file: any) => void;
  beforeAvatarUpload: (file: any) => void;
  submitLoading: boolean;
  handleSubmit: () => Promise<void>;
}

export default defineComponent({
  name: 'GoodsAddPage',
  components: {
    CKEditor,
  },
  setup(): FormBasicPageSetupData {
    const store = useStore<{ GamesFormAddBasic: FormStateType }>();
    const storeSelect = useStore<{ GamesAndChannelSelect: SelectStateType }>();

    // 表单值
    const modelRef = reactive<GoodsFormDataType>({
      name: '',
      coverImg: '',
      price: '',
      content: '',
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

    const gameList = computed<SelectType[]>(() => storeSelect.state.GamesAndChannelSelect.gameList);
    let getGameList = async () => {
      if (gameList.value.length == 0) storeSelect.dispatch('GamesAndChannelSelect/getGameList');
    };

    let channelShow = ref<boolean>(false);
    let channelList = computed<SelectType[]>(
      () => storeSelect.state.GamesAndChannelSelect.channelList
    );

    const getChannelList = async () => {
      modelRef.channelId = undefined;
      if (modelRef.gameId == null || !modelRef.gameId) {
        storeSelect.state.GamesAndChannelSelect.channelList = [];
        modelRef.channelId = undefined;
        channelShow.value = false;
      } else {
        channelShow.value = true;
        storeSelect.dispatch('GamesAndChannelSelect/getChannelListByGameId', modelRef.gameId);
      }
    };

    // 提交成功之后执行的操作
    const handleAvatarSuccess = (res: any, file: any) => {
      if (res.result) {
        URL.createObjectURL(file.raw);
        modelRef.coverImg = res.data.url;
        ElMessage.success('上传封面图片成功！');
      } else {
        ElMessage.error('上传封面图片失败！');
      }
    };

    const beforeAvatarUpload = (file: any) => {
      const isJPG = file.type === 'image/jpeg';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        ElMessage.error('上传封面图片只能是 JPG 格式!');
      }
      if (!isLt2M) {
        ElMessage.error('上传封面图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
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
          const res: boolean = await store.dispatch('GamesFormAddBasic/create', modelRef);
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
      gameList: gameList as unknown as SelectType[],
      channelList: channelList as unknown as SelectType[],
      channelShow: channelShow as unknown as boolean,
      getGameList,
      getChannelList,
      resetFields,
      handleAvatarSuccess,
      beforeAvatarUpload,
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

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>