import Vue from 'vue';
import VueRouter from 'vue-router';
import Spreadsheet from '../views/Spreadsheet.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: Spreadsheet
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
