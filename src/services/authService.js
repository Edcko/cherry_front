import axios from 'axios';

const API_URL = 'http://http://198.199.68.78:3000/cherry/auth/';

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

const logout = () => {
  localStorage.removeItem('user');
  console.log('Cierre de sesion exitoso');
};

export default {
  login,
  logout,
};
