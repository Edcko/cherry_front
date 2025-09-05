// src/services/apiService.js
import axios from 'axios';
import authHeader from './authHeader.js';
import router from '../router/index.js';
import store from '../store/index.js';
import useGlobalAlert from '@/composables/useGlobalAlert.js';
import ApiConfig from '@/config/api.js';

// Imprimir configuración al cargar
ApiConfig.printConfig();

const api = axios.create({
  baseURL: ApiConfig.baseURL,
  timeout: ApiConfig.timeout,
});

const { showAlert } = useGlobalAlert();

// Interceptor global para manejar 401 y errores de red
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      store.dispatch('logout');
      router.push('/login');
      showAlert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.', 'error');
    } else if (!error.response) {
      showAlert('Error de conexión. Por favor, verifique su conexión o intente más tarde.', 'error');
    }
    return Promise.reject(error);
  }
);

// ------------ GET --------------

export async function getPerteneceA() {
  const res = await api.get('perteneceA', { headers: authHeader() });
  return res.data;
}

export async function getPerteneceABySpa(spaId) {
  const res = await api.get(`perteneceA/${spaId}`, { headers: authHeader() });
  return res.data;
}

export async function getPerteneceAByCurrentSpa() {
  const idSpa = store.getters.idSpa;
  if (!idSpa) {
    throw new Error('No se encontró el ID del spa en la store');
  }
  const res = await api.get(`perteneceA/${idSpa}`, { headers: authHeader() });
  return res.data;
}

export async function getEmpleados() {
  const res = await api.get('empleados', { headers: authHeader() });
  return res.data;
}

export async function getEmpleadosByCurrentSpa() {
  const idSpa = store.getters.idSpa;
  if (!idSpa) {
    throw new Error('No se encontró el ID del spa en la store');
  }
  console.log('🔍 apiServices: Obteniendo empleados para spa ID:', idSpa);
  console.log('🌐 apiServices: URL:', `/spa/${idSpa}/empleados`);
  const res = await api.get(`spa/${idSpa}/empleados`, { headers: authHeader() });
  console.log('📡 apiServices: Respuesta del servidor:', res.data);
  console.log('✅ apiServices: Empleados obtenidos:', res.data.length, 'empleados');
  return res.data;
}

export async function getEmpleadosActivos() {
  const res = await api.get('empleados/activos', { headers: authHeader() });
  return res.data;
}

export async function getEmpleadosActivosByCurrentSpa() {
  const idSpa = store.getters.idSpa;
  if (!idSpa) {
    throw new Error('No se encontró el ID del spa en la store');
  }
  const res = await api.get(`spa/${idSpa}/empleados/activos`, { headers: authHeader() });
  return res.data;
}

export async function getClientes(params) {
  const res = await api.get('clientes', { headers: authHeader(), params });
  return res.data;
}

export async function getCitas(params) {
  const res = await api.get('citas', { headers: authHeader(), params });
  return res.data;
}

export async function getCitaById(id) {
  const res = await api.get(`cita/${id}`, { headers: authHeader() });
  return res.data;
}

export async function getCitasCount(params) {
  const res = await api.get('citas/count', { headers: authHeader(), params });
  return res.data;
}

export async function getCompras() {
  const res = await api.get('compras', { headers: authHeader() });
  return res.data;
}

export async function getSesiones() {
  const res = await api.get('sesiones', { headers: authHeader() });
  return res.data;
}

export async function getCabinas(params) {
  const res = await api.get('cabinas', { headers: authHeader(), params });
  return res.data;
}

export async function getSpas() {
  const res = await api.get('spas', { headers: authHeader() });
  return res.data;
}

export async function getPaquetes() {
  const res = await api.get('paquetes', { headers: authHeader() });
  return res.data;
}

export async function getValoraciones(params) {
  const res = await api.get('valoraciones', { headers: authHeader(), params });
  return res.data;
}

export async function getEstadoAgenda(idSpa) {
  const res = await api.get('estado-agenda', { headers: authHeader(), params: { idSpa } });
  return res.data;
}

export async function getFechaApertura(idSpa) {
  const res = await api.get('fecha-apertura', { headers: authHeader(), params: { idSpa } });
  return res.data;
}

export async function getBloqueos(params) {
  const res = await api.get('bloqueos', { headers: authHeader(), params });
  return res.data;
}

export async function getBloqueosByDateRange(params) {
  const res = await api.get('bloqueos/daterange', { headers: authHeader(), params });
  return res.data;
}

export async function getVentasPorRango({ inicio, fin }) {
  const res = await api.get('ventas/rango', { headers: authHeader(), params: { inicio, fin } });
  return res.data;
}

export async function getVentasDetallePorRango({ inicio, fin }) {
  const res = await api.get('ventas/detalle', { headers: authHeader(), params: { inicio, fin } });
  return res.data;
}

export async function getVentasDetalleCompradores({ inicio, fin }) {
  const res = await api.get('ventas/detalle-compradores', { headers: authHeader(), params: { inicio, fin } });
  return res.data;
}

export async function getCompraCompleta(id_compra) {
  const res = await api.get(`compra/${id_compra}/completa`, { headers: authHeader() });
  return res.data;
}

// ------------ POST/ADD --------------

export async function addPerteneceA(payload) {
  const res = await api.post('perteneceA', payload, { headers: authHeader() });
  return res.data;
}

export async function addCliente(payload) {
  const res = await api.post('cliente', payload, { headers: authHeader() });
  return res.data;
}

export async function addCita(payload) {
  const res = await api.post('cita', payload, { headers: authHeader() });
  return res.data;
}

export async function addCompra(payload) {
  const res = await api.post('compra', payload, { headers: authHeader() });
  return res.data;
}

export async function addEmpleado(payload) {
  const res = await api.post('empleado', payload, { headers: authHeader() });
  return res.data;
}

export async function addPaquete(payload) {
  const res = await api.post('paquete', payload, { headers: authHeader() });
  return res.data;
}

export async function addCabina(payload) {
  const res = await api.post('cabina', payload, { headers: authHeader() });
  return res.data;
}

export async function addValoracion(payload) {
  const res = await api.post('valoracion', payload, { headers: authHeader() });
  return res.data;
}

export async function generateClientDocument(clienteId) {
  const res = await api.post(`clientes/${clienteId}/document`, null, { headers: authHeader() });
  return res.data;
}

export async function addBloqueo(payload) {
  const res = await api.post('bloqueo', payload, { headers: authHeader() });
  return res.data;
}

// ------------ PUT/UPDATE --------------

export async function updatePerteneceA(spaId, paqueteId, payload) {
  const res = await api.put(`perteneceA/${spaId}/${paqueteId}`, payload, { headers: authHeader() });
  return res.data;
}

export async function updateCliente(cliente) {
  const res = await api.put(`cliente/${cliente.id_cliente}`, cliente, { headers: authHeader() });
  return res.data;
}

export async function updateCita(cita) {
  const res = await api.put(`cita/${cita.id_cita}`, cita, { headers: authHeader() });
  return res.data;
}

export async function updateCompra(compra) {
  const res = await api.put(`compra/${compra.id_compra}`, compra, { headers: authHeader() });
  return res.data;
}

export async function updateEmpleado(empleado) {
  const res = await api.put(`empleado/${empleado.id_empleado}`, empleado, { headers: authHeader() });
  return res.data;
}

export async function updatePaquete(paquete) {
  const res = await api.put(`paquete/${paquete.id_paquete}`, paquete, { headers: authHeader() });
  return res.data;
}

export async function updateCabina(cabina) {
  const res = await api.put(`cabina/${cabina.id_cabina}`, cabina, { headers: authHeader() });
  return res.data;
}

export async function updateValoracion(valoracion) {
  const res = await api.put(`valoracion/${valoracion.id_valoracion}`, valoracion, { headers: authHeader() });
  return res.data;
}

export async function updateEstadoAgenda(estado, idSpa) {
  const res = await api.put('estado-agenda', { estado }, { headers: authHeader(), params: { idSpa } });
  return res.data;
}

export async function updateFechaApertura(fecha_apertura, idSpa) {
  const res = await api.put('fecha-apertura', { fecha_apertura }, { headers: authHeader(), params: { idSpa } });
  return res.data;
}

export async function updateBloqueo(bloqueo) {
  const res = await api.put(`bloqueo/${bloqueo.id_bloqueo}`, bloqueo, { headers: authHeader() });
  return res.data;
}

// ------------ DELETE --------------

export async function deletePerteneceA(spaId, paqueteId) {
  const res = await api.delete(`perteneceA/${spaId}/${paqueteId}`, { headers: authHeader() });
  return res.data;
}

export async function deleteCliente(id_cliente) {
  const res = await api.delete(`cliente/${id_cliente}`, { headers: authHeader() });
  return res.data;
}

export async function deleteCita(id_cita) {
  const res = await api.delete(`cita/${id_cita}`, { headers: authHeader() });
  return res.data;
}

export async function deleteCompra(id_compra) {
  const res = await api.delete(`compra/${id_compra}`, { headers: authHeader() });
  return res.data;
}

export async function deleteEmpleado(id_empleado) {
  const res = await api.delete(`empleado/${id_empleado}`, { headers: authHeader() });
  return res.data;
}

export async function deletePaquete(id_paquete) {
  const res = await api.delete(`paquete/${id_paquete}`, { headers: authHeader() });
  return res.data;
}

export async function deleteCabina(id_cabina) {
  const res = await api.delete(`cabina/${id_cabina}`, { headers: authHeader() });
  return res.data;
}

export async function deleteValoracion(id_valoracion) {
  const res = await api.delete(`valoracion/${id_valoracion}`, { headers: authHeader() });
  return res.data;
}

export async function deleteBloqueo(id_bloqueo) {
  const res = await api.delete(`bloqueo/${id_bloqueo}`, { headers: authHeader() });
  return res.data;
}

export default {
  getPerteneceA,
  getPerteneceABySpa,
  getPerteneceAByCurrentSpa,
  getEmpleados,
  getEmpleadosByCurrentSpa,
  getEmpleadosActivos,
  getEmpleadosActivosByCurrentSpa,
  getClientes,
  getCitas,
  getCitaById,
  getCitasCount,
  getCompras,
  getSesiones,
  getCabinas,
  getSpas,
  getPaquetes,
  getValoraciones,
  getEstadoAgenda,
  getFechaApertura,
  getBloqueos,
  getBloqueosByDateRange,
  getVentasPorRango,
  getVentasDetallePorRango,
  getVentasDetalleCompradores,
  getCompraCompleta,
  addPerteneceA,
  addCliente,
  addCita,
  addCompra,
  addEmpleado,
  addPaquete,
  addCabina,
  addValoracion,
  generateClientDocument,
  addBloqueo,
  updatePerteneceA,
  updateCliente,
  updateCita,
  updateCompra,
  updateEmpleado,
  updatePaquete,
  updateCabina,
  updateValoracion,
  updateEstadoAgenda,
  updateFechaApertura,
  updateBloqueo,
  deletePerteneceA,
  deleteCliente,
  deleteCita,
  deleteCompra,
  deleteEmpleado,
  deletePaquete,
  deleteCabina,
  deleteValoracion,
  deleteBloqueo
};
