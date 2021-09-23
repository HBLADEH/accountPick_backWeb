<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never" class="cus-card" style="margin-bottom: 15px" :body-style="{ 'padding-bottom': '0' }">
      <el-form :model="searchModelRef" ref="searchFormRef" label-width="80px">
        <el-row :gutter="16" type="flex" justify="end" class="flex-wrap-wrap">
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <el-form-item label="名称：">
              <el-input placeholder="请输入" v-model="searchModelRef.name" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
            <div class="text-align-right" style="padding-bottom: 24px">
              <el-button type="primary" @click="searchFormSubmit">查询</el-button>
              <el-button @click="searchResetFields">重置</el-button>
            </div>
          </el-col>
        </el-row>
      </el-form>

    </el-card>

    <el-card shadow="never" class="cus-card">
      <template #header>
        <el-row>
          <el-col :span="8">
            <el-button type="primary" @click="() => setCreateFormVisible(true)">新增</el-button>
          </el-col>
        </el-row>
      </template>

      <el-table row-key="id" :data="list" v-loading="loading">

        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="序号" prop="id">
        </el-table-column>

        <el-table-column label="名称" prop="name">
          <template #default="{row}">
            <a :href="row.href" target="_blank">{{row.name}}</a>
          </template>
        </el-table-column>

        <el-table-column label="操作" prop="action" width="150">
          <template #default="{row}">
            <el-button type="text" @click="() => detailUpdateData(row.id)" :loading="detailUpdateLoading.includes(row.id)">编辑</el-button>
            <el-button type="text" @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <div class="padding-t10 text-align-right">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" v-model:current-page="pagination.current" :page-sizes="[10, 50, 100, 200]" :page-size="pagination.pageSize" :total="pagination.total" @size-change="(p) => { pagination.pageSize = p; getList(p); }" @current-change="(p) => { getList(p || 1); }">
        </el-pagination>
      </div>

      <create-form :visible="createFormVisible" :onCancel="() => setCreateFormVisible(false)" :onSubmitLoading="createSubmitLoading" :onSubmit="createSubmit" />

      <update-form v-if="updateFormVisible===true" :visible="updateFormVisible" :values="updateData" :onCancel="() => updataFormCancel()" :onSubmitLoading="updateSubmitLoading" :onSubmit="updateSubmit" />

    </el-card>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { ElMessageBox, ElMessage, ElForm } from 'element-plus';
import CreateForm from './components/CreateForm.vue';
import UpdateForm from './components/UpdateForm.vue';
import TypeSelect from './components/TypeSelect.vue';
import { StateType as GameStateType } from './store';

import { PaginationConfig, TableFromItem, TableListItem } from './data.d';

interface GameSearchTablePageSetupData {
  list: TableListItem[];
  pagination: PaginationConfig;
  loading: boolean;
  getList: (current: number) => Promise<void>;
  createFormVisible: boolean;
  setCreateFormVisible: (val: boolean) => void;
  createSubmitLoading: boolean;
  createSubmit: (values: Omit<TableListItem, 'id'>, resetFields: () => void) => Promise<void>;
  detailUpdateLoading: number[];
  detailUpdateData: (id: number) => Promise<void>;
  updateData: Partial<TableListItem>;
  updateFormVisible: boolean;
  updataFormCancel: () => void;
  updateSubmitLoading: boolean;
  updateSubmit: (values: TableListItem, resetFields: () => void) => Promise<void>;
  deleteLoading: number[];
  deleteTableData: (id: number) => void;
  searchModelRef: Omit<TableListItem, 'id'>;
  searchFormRef: typeof ElForm;
  searchResetFields: () => void;
  searchFormSubmit: () => Promise<void>;
}

export default defineComponent({
  name: 'GameSearchTablePage',
  components: {
    CreateForm,
    UpdateForm,
    TypeSelect,
  },
  setup(): GameSearchTablePageSetupData {
    const store = useStore<{ GameSearchTable: GameStateType }>();

    // 列表数据
    const list = computed<TableListItem[]>(() => store.state.GameSearchTable.tableData.list);

    // 列表分页
    const pagination = computed<PaginationConfig>(
      () => store.state.GameSearchTable.tableData.pagination
    );

    // 获取数据
    const loading = ref<boolean>(true);
    const getList = async (current: number): Promise<void> => {
      loading.value = true;
      await store.dispatch('GameSearchTable/queryTableData', {
        pageSize: pagination.value.pageSize,
        currentPage: current,
        name: searchModelRef.name,
      });
      loading.value = false;
    };

    // 新增弹框 - visible
    const createFormVisible = ref<boolean>(false);
    const setCreateFormVisible = (val: boolean) => {
      createFormVisible.value = val;
    };
    // 新增弹框 - 提交 loading
    const createSubmitLoading = ref<boolean>(false);
    // 新增弹框 - 提交
    const createSubmit = async (values: Omit<TableListItem, 'id'>, resetFields: () => void) => {
      createSubmitLoading.value = true;
      const res: boolean = await store.dispatch('GameSearchTable/createTableData', values);
      if (res === true) {
        resetFields();
        setCreateFormVisible(false);
        ElMessage.success('新增成功！');
        getList(1);
      }
      createSubmitLoading.value = false;
    };

    // 编辑弹框 - visible
    const updateFormVisible = ref<boolean>(false);
    const setUpdateFormVisible = (val: boolean) => {
      updateFormVisible.value = val;
    };
    const updataFormCancel = () => {
      setUpdateFormVisible(false);
      store.commit('GameSearchTable/setUpdateData', {});
    };
    // 编辑弹框 - 提交 loading
    const updateSubmitLoading = ref<boolean>(false);
    // 编辑弹框 - 提交
    const updateSubmit = async (values: TableListItem, resetFields: () => void) => {
      updateSubmitLoading.value = true;
      const res: boolean = await store.dispatch('GameSearchTable/updateTableData', values);
      if (res === true) {
        updataFormCancel();
        ElMessage.success('编辑成功！');
        console.log(pagination.value);
        getList(pagination.value.current);
      }
      updateSubmitLoading.value = false;
    };

    // 编辑弹框 data
    const updateData = computed<Partial<TableFromItem>>(
      () => store.state.GameSearchTable.updateData
    );
    const detailUpdateLoading = ref<number[]>([]);
    const detailUpdateData = async (id: number) => {
      detailUpdateLoading.value = [id];
      const res: boolean = await store.dispatch('GameSearchTable/queryUpdateData', id);
      if (res === true) {
        setUpdateFormVisible(true);
      }
      detailUpdateLoading.value = [];
    };

    // 删除 loading
    const deleteLoading = ref<number[]>([]);
    // 删除
    const deleteTableData = (id: number) => {
      ElMessageBox.confirm('确定删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          deleteLoading.value = [id];
          const res: boolean = await store.dispatch('GameSearchTable/deleteTableData', id);
          if (res === true) {
            ElMessage.success('删除成功！');
            getList(pagination.value.current);
          }
          deleteLoading.value = [];
        })
        .catch((error: any) => {
          console.log(error);
        });
    };

    // 表单值
    const searchModelRef = reactive<Omit<TableListItem, 'id'>>({
      name: '',
    });
    // search form
    const searchFormRef = ref<typeof ElForm>();
    // 重置
    const searchResetFields = () => {
      searchFormRef.value && searchFormRef.value.resetFields();
      searchModelRef.name = '';
    };
    // 搜索
    const searchFormSubmit = async () => {
      try {
        // console.log('search', searchModelRef);
        getList(1);
        // ElMessage.warning('进行了搜索!');
      } catch (error) {
        ElMessage.warning(error);
      }
    };

    onMounted(() => {
      getList(1);
    });

    return {
      list: list as unknown as TableListItem[],
      pagination: pagination as unknown as PaginationConfig,
      loading: loading as unknown as boolean,
      getList,
      createFormVisible: createFormVisible as unknown as boolean,
      setCreateFormVisible,
      createSubmitLoading: createSubmitLoading as unknown as boolean,
      createSubmit,
      detailUpdateLoading: detailUpdateLoading as unknown as number[],
      detailUpdateData,
      updateData: updateData as Partial<TableListItem>,
      updateFormVisible: updateFormVisible as unknown as boolean,
      updataFormCancel,
      updateSubmitLoading: updateSubmitLoading as unknown as boolean,
      updateSubmit,
      deleteLoading: deleteLoading as unknown as number[],
      deleteTableData,
      searchModelRef,
      searchFormRef: searchFormRef as unknown as typeof ElForm,
      searchResetFields,
      searchFormSubmit,
    };
  },
});
</script>