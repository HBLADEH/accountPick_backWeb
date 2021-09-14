import request from '@/utils/request';
import { GoodsFormDataType } from './data.d';

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

export async function getGoodsById(goodsId: number): Promise<any> {
  return request({
    url: '/goods/' + goodsId,
    method: 'GET',
  });
}

export async function updateGoods(params: GoodsFormDataType): Promise<any> {
  return request({
    url: '/goods',
    method: 'PUT',
    data: params,
  });
}
