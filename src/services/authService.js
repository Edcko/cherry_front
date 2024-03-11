import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:3000/cherry/auth/';

// Crear una nueva instancia de Axios
  const api = axios.create({
    baseURL: API_URL,
  });

const login = async (email, password_empleado) => {
  const response = await axios.post(API_URL + 'login', {
    email,
    password_empleado,
  });
  if (response.data.token) {
    console.log('Inicio de sesion exitoso', response.data);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const getUsuario = async () => {
  const response = await api.get(API_URL + 'usuario', {
    headers: authHeader()
  });
  return response.data
}


const logout = () => {
  localStorage.removeItem('user');
  console.log('Cierre de sesion exitoso');
};

export default {
  login,
  logout,
  getUsuario,
};  