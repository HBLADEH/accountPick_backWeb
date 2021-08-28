export interface FormDataType {
  title: string;
  date: string[];
  select: string;
  radio1: string;
  radio2: string;
  checkbox: string[];
  remark: string;
  content: string;
}


export interface GoodsFormDataType {
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