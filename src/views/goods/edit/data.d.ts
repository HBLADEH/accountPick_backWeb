export interface GoodsResponseDataType {
  id?: number;
  name: string;
  coverImg: string;
  price: string;
  content: string;
  gameId?: number;
  gameName: string;
  channelId?: number;
  channelName: string;
}
export interface GoodsFormDataType {
  id?: number;
  name: string;
  coverImg: string;
  price: string;
  content: string;
  gameId?: number;
  channelId?: number;
}

// export interface SelectType {
//   label: string;
//   value: number;
// }

export interface SelectType {
  name: string;
  id: number;
}