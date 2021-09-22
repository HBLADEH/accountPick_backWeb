<template>
  <el-dialog :close-on-click-modal="false" :close-on-press-escape="false" title="新增" width="500px" :model-value="visible" @close="onCancel">
    <template #footer>
      <el-button key="back" @click="() => onCancel()">取消</el-button>
      <el-button key="submit" type="primary" :loading="onSubmitLoading" @click="onFinish">提交</el-button>
    </template>

    <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model="modelRef.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="所属渠道" prop="channelId">
        <el-select v-model="modelRef.channelId" placeholder="请选择" filterable multiple clearable style="width:100%">
          <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, PropType, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import TypeSelect from './TypeSelect.vue';
import { TableFromItem } from '../data.d';
import { ElForm, ElMessage } from 'element-plus';
import { StateType as SelectStateType } from '../../../goods/util/select/store';
import { SelectType } from '@/views/goods/util/select/data';
import { useStore } from 'vuex';

interface CreateFormSetupData {
  modelRef: Omit<TableFromItem, 'id'>;
  rulesRef: any;
  formRef: typeof ElForm;
  channelList: SelectType[];
  resetFields: () => void;
  onFinish: () => Promise<void>;
}

export default defineComponent({
  name: 'CreateForm',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    onCancel: {
      type: Function,
      required: true,
    },
    onSubmitLoading: {
      type: Boolean,
      required: true,
    },
    onSubmit: {
      type: Function as PropType<
        (values: Omit<TableFromItem, 'id'>, resetFields: () => void) => void
      >,
      required: true,
    },
  },
  components: {
    TypeSelect,
  },
  setup(props): CreateFormSetupData {
    const { t } = useI18n();
    const storeSelect = useStore<{ GamesAndChannelSelect: SelectStateType }>();

    const channelList = computed<SelectType[]>(
      () => storeSelect.state.GamesAndChannelSelect.channelList
    );

    onMounted(() => {
      storeSelect.dispatch('GamesAndChannelSelect/getChannelList');
    });

    // 表单值
    const modelRef = reactive<Omit<TableFromItem, 'id'>>({
      name: '',
      channelList: [],
    });

    // 表单验证
    const rulesRef = reactive({
      name: [
        {
          required: true,
          validator: async (rule: any, value: string) => {
            if (value === '' || !value) {
              throw new Error('请输入名称');
            } else if (value.length > 15) {
              throw new Error('长度不能大于15个字');
            }
          },
        },
      ],
    });
    // form
    const formRef = ref<typeof ElForm>();
    // 重置
    const resetFields = () => {
      formRef.value && formRef.value.resetFields();
    };
    // 提交
    const onFinish = async () => {
      try {
        const valid: boolean = formRef.value ? await formRef.value.validate() : false;
        if (valid === true) {
          props.onSubmit(modelRef, resetFields);
        }
      } catch (error) {
        // console.log('error', error);
        ElMessage.warning(t('app.global.form.validatefields.catch'));
      }
    };

    return {
      modelRef,
      rulesRef,
      channelList: channelList as unknown as SelectType[],
      formRef: formRef as unknown as typeof ElForm,
      resetFields,
      onFinish,
    };
  },
});
</script>