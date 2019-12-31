import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    saved_data: null
  },
  getters: {
    saved_data(state) {
      return state.saved_data;
    }
  },
  mutations: {
    save(state, payload) {
      state.saved_data = payload;
      localStorage.setItem('nusheets', JSON.stringify(state.saved_data));
      state.last_saved = new Date();
    },
    restore(state) {
      state.saved_data = JSON.parse(localStorage.getItem('nusheets'));
    }
  },
  actions: {}
});
