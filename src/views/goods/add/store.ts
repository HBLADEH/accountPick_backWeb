import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { createGoods } from './service';
import { getChannelListByGameId, getGameList } from '../util/select/service'
import { FormDataType } from "./data.d";
import { SelectType } from "../util/select/data"
import { ResponseData } from '@/utils/request';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface StateType {
    gameList: SelectType[]
    channelList: SelectType[]
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        setGameList: Mutation<StateType>
        setChannelList: Mutation<StateType>
    };
    actions: {
        getGameList: Action<StateType, StateType>;
        getChannelListByGameId: Action<StateType, StateType>;
        create: Action<StateType, StateType>;
    };
}

const initState: StateType = {
    gameList: [],
    channelList: []
};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'GamesFormAddBasic',
    state: {
        ...initState
    },
    mutations: {
        setGameList(state, payload) {
            state.gameList = payload.gameList
        },
        setChannelList(state, payload) {
            state.channelList = payload.channelList
        }
    },
    actions: {
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

        async create({ commit }, payload: FormDataType) {
            try {
                await createGoods(payload);
                return true;
            } catch (error) {
                return false;
            }
        }
    }
}

export default StoreModel;