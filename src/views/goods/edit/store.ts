import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { getGoodsById, getChannelListByGameId, getGameList, updateGoods } from './service';
import { GoodsResponseDataType, GoodsFormDataType, SelectType } from "./data.d";
import { ResponseData } from '@/utils/request';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface StateType {
    goods: GoodsResponseDataType
    gameList: SelectType[]
    channelList: SelectType[]
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        setGoods: Mutation<StateType>
        setGameList: Mutation<StateType>
        setChannelList: Mutation<StateType>
    };
    actions: {
        getGameList: Action<StateType, StateType>;
        getChannelListByGameId: Action<StateType, StateType>;
        getGoodsById: Action<StateType, StateType>;
        update: Action<StateType, StateType>;
    };
}

const initState: StateType = {
    goods: {
        id: 0,
        name: '',
        coverImg: '',
        price: '',
        content: '',
        gameName: '',
        channelName: '',
    },
    gameList: [],
    channelList: []
};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'GoodsFormEditBasic',
    state: {
        ...initState
    },
    mutations: {
        setGoods(state, payload) {
            state.goods = payload.goods
        },
        setGameList(state, payload) {
            state.gameList = payload.gameList
        },
        setChannelList(state, payload) {
            state.channelList = payload.channelList
        }
    },
    actions: {

        async getGoodsById({ commit }, goodsId: number) {
            const response: ResponseData = await getGoodsById(goodsId);
            const { data } = response
            commit('setGoods', {
                ...initState,
                goods: data
            })
        },

        async getGameList({ commit }) {
            try {
                const response: ResponseData = await getGameList();
                const { data } = response
                commit('setGameList', {
                    ...initState,
                    gameList: data
                })
                return true;
            } catch (error) {
                return false;
            }
        },
        async getChannelListByGameId({ commit }, gameId: number) {
            try {
                const response: ResponseData = await getChannelListByGameId(gameId);
                const { data } = response
                commit('setChannelList', {
                    ...initState,
                    channelList: data
                })
                return true;
            } catch (error) {
                return false;
            }
        },
        async update({ commit }, goods: GoodsFormDataType) {
            try {
                await updateGoods(goods);
                return true;
            } catch (error) {
                return false;
            }
        }
    }
}

export default StoreModel;