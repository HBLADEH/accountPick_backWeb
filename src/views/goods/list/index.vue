<template>
  <div class="indexlayout-main-conent">
    <el-card shadow="never" class="cus-card" style="margin-bottom: 15px" :body-style="{ 'padding-bottom': '0' }">
      <el-form :model="searchModelRef" ref="searchFormRef" label-width="80px">
        <el-row :gutter="16" type="flex" justify="end" class="flex-wrap-wrap">
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <el-form-item label="商品编号">
              <el-input placeholder="请输入" v-model="searchModelRef.id" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <el-form-item label="商品名称">
              <el-input placeholder="请输入" v-model="searchModelRef.name" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <el-form-item label="所属游戏">
              <el-select @visible-change="getGameList" @change="getChannelList" v-model="searchModelRef.gameId" placeholder="请选择" filterable clearable style="width:100%">
                <el-option v-for="item in gameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <!-- <el-input placeholder="请输入" v-model="searchModelRef.href" /> -->
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="6" :xl="6">
            <el-form-item label="所属渠道">
              <el-select v-model="searchModelRef.channelId" :disabled="!channelShow" placeholder="请选择" filterable clearable style="width:100%">
                <el-option v-for="item in channelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
              <!-- <TypeSelect placeholder="请选择" v-model="searchModelRef.type" style="width:100%" /> -->
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
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
          <div class="text-align-right">
            <el-col :xs="24" :sm="24" :md="24">
              <el-button type="primary" @click="goAddPage">新增</el-button>
              <el-button type="danger" @click="deleteTableDatas">删除</el-button>
            </el-col>
          </div>
        </el-row>
      </template>

      <el-table row-key="id" :data="list" v-loading="loading" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="序号" prop="id" width="55">
        </el-table-column>
        <el-table-column label="名称" prop="name">
        </el-table-column>
        <el-table-column label="封面图" prop="coverImg">
          <template #default="{row}">
            <el-image style="width: 100px; height: 100px" :src="row.coverImg" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="游戏名称" prop="gameName">
        </el-table-column>
        <el-table-column label="渠道名称" prop="channelName">
        </el-table-column>
        <el-table-column label="价格" prop="price">
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime">
        </el-table-column>
        <el-table-column label="更新时间" prop="updateTime">
        </el-table-column>

        <el-table-column label="操作" prop="action" width="150">
          <template #default="{row}">
            <el-button type="text" @click="() => detailUpdateData(row.id)">编辑</el-button>
            <el-button type="text" @click="() => deleteTableData(row.id)" :loading="deleteLoading.includes(row.id)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>

      <div class="padding-t10 text-align-right">
        <el-pagination background layout="prev, pager, next" v-model:current-page="pagination.current" :page-size="pagination.pageSize" :total="pagination.total" @current-change="(p) => {
                        getList(p || 1);
                    }">
        </el-pagination>
      </div>

    </el-card>
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { ElMessageBox, ElMessage, ElForm } from 'element-plus';
import TypeSelect from './components/TypeSelect.vue';
import { StateType as ListStateType } from './store';
/* 下拉框 */
import { StateType as SelectStateType } from '../util/select/store';
import { PaginationConfig, TableListItem, TableListQueryParams, TableSearchItem } from './data.d';
import { SelectType } from '../util/select/data';

interface GoodsSearchTablePageSetupData {
  list: TableListItem[];
  pagination: PaginationConfig;
  loading: boolean;
  getList: (current: number) => Promise<void>;
  gameList: SelectType[];
  channelList: SelectType[];
  channelShow: boolean;
  getGameList: () => void;
  getChannelList: () => void;
  goAddPage: () => void;
  handleSelectionChange: (val: TableListItem[]) => void;
  deleteLoading: number[];
  detailUpdateData: (id: number) => void;
  deleteTableData: (id: number) => void;
  deleteTableDatas: () => void;
  tabVal: string;
  searchOpen: boolean;
  setSearchOpen: () => void;
  searchModelRef: Omit<TableSearchItem, 'id'>;
  searchFormRef: typeof ElForm;
  searchResetFields: () => void;
  searchFormSubmit: () => Promise<void>;
}

export default defineComponent({
  name: 'GoodsSearchTablePage',
  components: {
    TypeSelect,
  },
  setup(): GoodsSearchTablePageSetupData {
    const router = useRouter();

    const store = useStore<{ GoodsSearchTable: ListStateType }>();
    const storeSelect = useStore<{ GamesAndChannelSelect: SelectStateType }>();

    // 列表数据
    const list = computed<TableListItem[]>(() => store.state.GoodsSearchTable.tableData.list);

    // 列表分页
    const pagination = computed<PaginationConfig>(
      () => store.state.GoodsSearchTable.tableData.pagination
    );

    // 获取数据
    const loading = ref<boolean>(true);
    const getList = async (current: number): Promise<void> => {
      loading.value = true;
      await store.dispatch('GoodsSearchTable/queryTableData', {
        id: searchModelRef.id,
        name: searchModelRef.name,
        gameId: searchModelRef.gameId,
        channelId: searchModelRef.channelId,
        pageSize: pagination.value.pageSize,
        currentPage: current,
      });
      loading.value = false;
    };

    /* 下拉框开始 */
    const gameList = computed<SelectType[]>(() => storeSelect.state.GamesAndChannelSelect.gameList);
    let getGameList = async () => {
      if (gameList.value.length == 0) storeSelect.dispatch('GamesAndChannelSelect/getGameList');
    };

    let channelShow = ref<boolean>(false);
    let channelList = computed<SelectType[]>(
      () => storeSelect.state.GamesAndChannelSelect.channelList
    );

    const getChannelList = async () => {
      searchModelRef.channelId = undefined;
      if (searchModelRef.gameId == null || !searchModelRef.gameId) {
        storeSelect.state.GamesAndChannelSelect.channelList = [];
        searchModelRef.channelId = undefined;
        channelShow.value = false;
      } else {
        channelShow.value = true;
        storeSelect.dispatch('GamesAndChannelSelect/getChannelListByGameId', searchModelRef.gameId);
      }
    };
    /* 下拉框结束 */

    let selectedData: TableListItem[];
    const handleSelectionChange = (val: TableListItem[]) => {
      selectedData = val;
    };

    const goAddPage = () => {
      router.push('/goods/add');
    };

    const detailUpdateData = (id: number) => {
      router.push({ path: '/goods/edit', query: { id: id } });
    };

    // 删除 loading
    const deleteLoading = ref<number[]>([]);
    // 删除
    const deleteTableData = (id: number) => {
      const ids = [id];
      doDeleteTableData(ids);
    };

    const deleteTableDatas = () => {
      if (selectedData) {
        const ids: number[] = selectedData.map((item, index) => {
          return item.id;
        });
        doDeleteTableData(ids);
      } else {
        ElMessage.error('请先选择要删除的数据');
      }
    };

    const doDeleteTableData = (id: number[]) => {
      ElMessageBox.confirm('确定删除吗？', '删除', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          let res: boolean = false;
          res = await store.dispatch('GoodsSearchTable/deleteTableData', id);
          if (res === true) {
            ElMessage.success('删除成功！');
            getList(pagination.value.current);
          }
        })
        .catch((error: any) => {
          console.log(error);
        });
    };

    const tabVal = ref<string>('all');

    // 搜索
    const searchOpen = ref<boolean>(false);
    const setSearchOpen = (): void => {
      searchOpen.value = !searchOpen.value;
    };
    // 表单值
    const searchModelRef = reactive<TableSearchItem>({
      name: '',
    });
    // search form
    const searchFormRef = ref<typeof ElForm>();
    // 重置
    const searchResetFields = () => {
      searchFormRef.value && searchFormRef.value.resetFields();
      searchModelRef.id = undefined;
      searchModelRef.name = '';
      searchModelRef.gameId = undefined;
      searchModelRef.channelId = undefined;
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

      /* 下拉框开始 */
      gameList: gameList as unknown as SelectType[],
      channelList: channelList as unknown as SelectType[],
      channelShow: channelShow as unknown as boolean,
      getGameList,
      getChannelList,
      /* 下拉框结束 */
      goAddPage,
      handleSelectionChange,
      deleteLoading: deleteLoading as unknown as number[],
      detailUpdateData,
      deleteTableData,
      deleteTableDatas,
      tabVal: tabVal as unknown as string,
      searchOpen: searchOpen as unknown as boolean,
      setSearchOpen,
      searchModelRef,
      searchFormRef: searchFormRef as unknown as typeof ElForm,
      searchResetFields,
      searchFormSubmit,
    };
  },
});
</script>