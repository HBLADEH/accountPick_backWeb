import request from '@/utils/request';

export async function getGameList(): Promise<any> {
  return request({
    url: '/games',
    method: 'GET',
  });
}
export async function getChannelList(): Promise<any> {
  return request({
    url: '/channels',
    method: 'GET',
  });
}
export async function getChannelListByGameId(gameId: number): Promise<any> {
  return request({
    url: `/channelsByGame/${gameId}`,
    method: 'GET',
  });
}