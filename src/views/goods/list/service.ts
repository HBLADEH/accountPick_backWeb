import request from '@/utils/request';
import { TableListQueryParams, TableListItem } from './data.d';

export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/goods/listAll',
    method: 'get',
    params,
  });
}

export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: '/pages/list',
    method: 'POST',
    data: params,
  });
}

export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/pages/list/${id}`,
    method: 'PUT',
    data: params,
  });
}

export async function removeData(id: number[]): Promise<any> {
  return request({
    url: '/goods',
    method: 'delete',
    data: id,

  });
}

export async function detailData(id: number): Promise<any> {
  return request({ url: `/pages/list/${id}` });
}
