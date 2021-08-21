import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { createData, getGameList } from './service';
import { FormDataType, SelectType } from "./data.d";
import { ResponseData } from '@/utils/request';

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface StateType {
    gameList: SelectType[]
}

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
        setGameList: Mutation<StateType>
    };
    actions: {
        getGameList: Action<StateType, StateType>;
        create: Action<StateType, StateType>;
    };
}

const initState: StateType = {
    gameList: []
};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'GamesFormBasic',
    state: {
        ...initState
    },
    mutations: {
        setGameList(state, payload) {
            state.gameList = payload
        }
    },
    actions: {
        async getGameList({ commit }) {
            try {
                const response: ResponseData = await getGameList();
                const { data } = response

                commit('setGameList', {
                    ...initState,
                    gameList: data.map((v: { id: number; name: string; }) => ({
                        value: v.id,
                        label: v.name
                    }))
                })
                return true;
            } catch (error) {
                return false;
            }
        },

        async create({ commit }, payload: FormDataType) {
            try {
                await createData(payload);
                return true;
            } catch (error) {
                return false;
            }
        }
    }
}

export default StoreModel;