import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { createData, getGameList } from './service';
import { FormDataType } from "./data.d";

/* eslint-disable @typescript-eslint/no-empty-interface */
export interface StateType { }

export interface ModuleType extends StoreModuleType<StateType> {
    state: StateType;
    mutations: {
    };
    actions: {
        getGameList: Action<StateType, StateType>;
        create: Action<StateType, StateType>;
    };
}

const initState: StateType = {};

const StoreModel: ModuleType = {
    namespaced: true,
    name: 'GamesFormBasic',
    state: {
        ...initState
    },
    mutations: {
    },
    actions: {
        async getGameList({ commit }) {
            try {
                await getGameList();
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