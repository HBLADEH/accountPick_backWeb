import request from '@/utils/request';
import { GoodsFormDataType } from '../util/from/data';

export async function getGoodsById(goodsId: number): Promise<any> {
  return request({
    url: `/goods/${goodsId}`,
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
