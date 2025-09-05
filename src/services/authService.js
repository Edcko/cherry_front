// src/services/authService.js
import axios from 'axios';
import authHeader from './authHeader';
import ApiConfig from '@/config/api.js';

// Instancia de Axios para autenticación
const authApi = axios.create({
  baseURL: `${ApiConfig.baseURL}/auth/`,
  timeout: ApiConfig.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Opcional: capturar 401 si quieres
authApi.interceptors.response.use(
  response => response,
  error => {
    // si necesitas manejar expiración de token aquí, lo puedes hacer
    return Promise.reject(error);
  }
);

/**
 * Inicia sesión y almacena el token en localStorage
 * @param {string} email
 * @param {string} password_empleado
 */
export const login = async (email, password_empleado) => {
  console.log('🔐 authService: Iniciando login');
  console.log('🌐 authService: URL base:', authApi.defaults.baseURL);
  console.log('📧 authService: Email:', email);
  
  try {
    // Primero probar conectividad
    console.log('🔍 authService: Probando conectividad...');
    const testUrl = `${ApiConfig.baseURL}/auth/login`;
    console.log('🌐 authService: URL completa:', testUrl);
    
    const res = await authApi.post('login', { email, password_empleado });
    console.log('✅ authService: Login exitoso', res.data);
    if (res.data.token) {
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  } catch (error) {
    console.error('❌ authService: Error en login:', error);
    console.error('❌ authService: Status:', error.response?.status);
    console.error('❌ authService: URL intentada:', error.config?.url);
    console.error('❌ authService: Response data:', error.response?.data);
    throw error;
  }
};

/** Obtiene los datos del usuario autenticado */
export const getUsuario = async () => {
  const res = await authApi.get('usuario', {
    headers: authHeader(),
  });
  return res.data;
};

/** Cierra la sesión localmente */
export const logout = () => {
  localStorage.removeItem('user');
  console.log('Cierre de sesión exitoso');
};

export default {
  login,
  logout,
  getUsuario,
};
