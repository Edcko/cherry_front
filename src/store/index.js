// store/index.js
import { createStore } from 'vuex'
import authService from '../services/authService.js' // asegúrate de que la ruta es correcta
//import axios from 'axios';

export default createStore({
  state: {
    userData: null,
    token: null,
  },
  mutations: {
    SET_USER_DATA(state, userData) {
    console.log('SET_USER_DATA ejecutada con userData:', userData);
      state.userData = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      state.token = userData.token;
      // Aquí podrías actualizar el token en Axios
      //if(state.token) {
      //  axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      // }
    },
    LOGOUT(state) {
    console.log('LOGOUT ejecutada');
      state.userData = null;
      state.token = null;
      localStorage.removeItem('user');
      // Aquí podrías borrar el token en Axios
      //axios.defaults.headers.common['Authorization'] = null;
    },
  },
  actions: {
    async login({ commit }, { email, password_empleado }) {
      const user = await authService.login(email, password_empleado);
      console.log('User:', user);
      commit('SET_USER_DATA', user);
    },
    logout({ commit }) {
      commit('LOGOUT');
    },
    checkAuthentication({ commit }) {
      const userData = localStorage.getItem('user');
      if (userData) {
        commit('SET_USER_DATA', JSON.parse(userData));
      }
    },

  },
  getters: {
    isLoggedIn: state => {
        console.log('Getter isLoggedIn:', !!state.userData);
        return !!state.userData;
      },
      userData: state => {
        console.log('Getter userData:', state.userData);
        return state.userData;
      },
      token: state => {
        console.log('Getter token:', state.token);
        return state.token;
      },
  },
  created() {
    console.log('Estado inicial:', this.state);
  },
})
