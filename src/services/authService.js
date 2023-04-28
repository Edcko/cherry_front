// src/services/auth.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/cherry/auth/';

const login = async (email, password_empleado) => {
  const response = await axios.post(API_URL + 'login', {
    email,
    password_empleado,
  });
  if (response.data.token) {
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('user');
};

export default {
  login,
  logout,
};
