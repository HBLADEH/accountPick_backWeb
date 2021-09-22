import { ResponseData } from '@/utils/request';
import { StoreModuleType } from '@/utils/store';
import { Action, Mutation } from 'vuex';
import { SelectType } from '../select/data'
import { getChannelList, getChannelListByGameId, getGameList } from './service';

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
    getChannelList: Action<StateType, StateType>;
  };
}

const initState: StateType = {
  gameList: [],
  channelList: []
};

const StoreModel: ModuleType = {
  namespaced: true,
  name: 'GamesAndChannelSelect',
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
    async getChannelList({ commit }) {
      try {
        const response: ResponseData = await getChannelList();
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
  }
}

export default StoreModel;