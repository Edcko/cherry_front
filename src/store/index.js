// store/index.js
import { createStore } from 'vuex'
import authService from '../services/authService.js' // asegúrate de que la ruta es correcta
//import axios from 'axios';

export default createStore({
  state: {
    userData: null,
    token: null,
    tipo_empleado: null,
    id_empleado: null,
    id_spa: null,
  },
  mutations: {
    SET_USER_DATA(state, userData) {
    console.log('SET_USER_DATA ejecutada con userData:', userData);
      state.userData = userData;
      state.token = userData.token;
      state.tipo_empleado = userData.tipo_empleado;
      state.id_empleado = userData.id_empleado;
      state.id_spa = userData.id_spa;
      state.nombre_empleado = userData.nombre_empleado;
      state.apellido_paterno = userData.apellido_paterno;
      state.apellido_materno = userData.apellido_materno;
      state.nombre_spa = userData.nombre_spa;
      localStorage.setItem('user', JSON.stringify(userData));

      // Aquí podrías actualizar el token en Axios
      //if(state.token) {
      //  axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      // }
    },
    LOGOUT(state) {
    console.log('LOGOUT ejecutada');
      state.userData = null;
      state.token = null;
      state.id_empleado = null;
      state.id_spa = null;
      localStorage.removeItem('user');
      // Aquí podrías borrar el token en Axios
      //axios.defaults.headers.common['Authorization'] = null;
    },
  },
  actions: {
    async login({ commit }, { email, password_empleado }) {
      const user = await authService.login(email, password_empleado);
      console.log('User:', user);
      console.log('Token:', user.token);
      console.log('Tipo empleado:', user.tipo_empleado);
      console.log('Id empleado:', user.id_empleado);
      console.log('Id spa:', user.id_spa);
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
    nombreSpa: state => {
      console.log('Getter nombreSpa', state.nombre_spa);
      return state.nombre_spa;
    },
    nombreCompleto: state => {
      if (state.userData) {
        return `${state.userData.nombre_empleado} ${state.userData.apellido_paterno} ${state.userData.apellido_materno}`;
      }
      return "Usuario";
    },
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
      tipoEmpleado: state => {
        console.log('Getter tipoEmpleado:', state.tipo_empleado);
        return state.userData ? state.userData.tipo_empleado : null; // Nota el cambio aquí

      },
      idEmpleado: state => {
        console.log('Getter idEmpleado:', state.id_empleado);
        return state.id_empleado; // Nota el cambio aquí    
      },
      idSpa: state => {
        console.log('Getter idSpa:', state.id_spa);
        return state.id_spa; // Nota el cambio aquí    
      },
  },
  created() {
    console.log('Estado inicial:', this.state);
  },
})
