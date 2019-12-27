import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    s_rows: 2000,
    s_cols: 10,
    s_exp: null,
    s_data: null
  },
  getters: {
    s_rows: state => {
      return state.s_rows;
    },
    s_cols: state => {
      return state.s_cols;
    },
    s_exp: state => {
      return state.s_exp;
    },
    s_data: state => {
      return state.s_data;
    }
    // cellData: state => {
    //   return state.s_data;
    // }
  },
  mutations: {
    createTable: state => {
      state.s_exp = Array.from({ length: state.s_rows }, () =>
        Array.from({ length: state.s_cols }, () => null)
      );
      state.s_data = state.s_exp;
    },
    updateCellExp: (state, payload) => {
      state.s_exp[payload.row][payload.column] = payload.value;
    }
    // updateTableData: state => {}
  },
  actions: {}
});
