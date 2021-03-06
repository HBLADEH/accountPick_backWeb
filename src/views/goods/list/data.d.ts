export interface TableListQueryParams {
  name: string;
  page: number;
  per: number;
}

export interface PaginationConfig {
  total: number;
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
}

export interface TableSearchItem {
  id?: number;
  name: string;
  gameId?: number;
  channelId?: number;
}
export interface TableListItem {
  id: number;
  name: string;
  price: number;
  gameName: string;
  channelName: string;
  createTime: string;
  updateTime: string;
}

export interface TableDataType {
  list: TableListItem[];
  pagination: PaginationConfig;
}
