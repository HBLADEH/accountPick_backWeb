import request from '@/utils/request';
import { FormDataType } from './data.d';

export async function getGameList(): Promise<any> {
  return request({
    url: '/games',
    method: 'GET',
  });
}


export async function createData(params: FormDataType): Promise<any> {
  return request({
    url: '/pages/form',
    method: 'POST',
    data: params,
  });
}
