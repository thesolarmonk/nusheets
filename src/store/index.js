import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    t_rows: 2000,
    t_cols: 10,
    t_exp: null,
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
  mutations: {
    createTable: state => {
      state.t_exp = Array.from({ length: state.t_rows }, () =>
        Array.from({ length: state.t_cols }, () => null)
      );
      state.t_data = state.t_exp;
    },
    updateCellExp: (state, payload) => {
      state.t_exp[payload.row][payload.column] = payload.value;
    }
    // updateTableData: state => {}
  },
  actions: {}
});
