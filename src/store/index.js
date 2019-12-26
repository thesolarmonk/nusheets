import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    t_rows: 2000,
    t_cols: 10,
    t_data: null
  },
  getters: {
    getTableData: state => {
      return state.t_data;
    },
    getCellData: state => {
      return state.t_data;
    }
  },
  mutations: {},
  actions: {}
});
