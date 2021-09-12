import request from '@/utils/request';
import { FormDataType } from './data.d';

export async function getGameList(): Promise<any> {
  return request({
    url: '/games',
    method: 'GET',
  });
}

export async function getChannelListByGameId(gameId: number): Promise<any> {
  return request({
    url: '/channelsByGame/' + gameId,
    method: 'GET',
  });
}

export async function createGoods(params: FormDataType): Promise<any> {
  return request({
    url: '/goods',
    method: 'POST',
    data: params,
  });
}
