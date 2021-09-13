export interface GoodsResponseDataType {
  id: number;
  name: string;
  coverImg: string;
  price: string;
  content: string;
  gameId: string;
  gameName: string;
  channelId: string;
  channelName: string;
}
export interface GoodsFormDataType {
  id: number;
  name: string;
  coverImg: string;
  price: string;
  content: string;
  gameId: string;
  channelId: string;
}

// export interface SelectType {
//   label: string;
//   value: number;
// }

export interface SelectType {
  name: string;
  id: number;
}