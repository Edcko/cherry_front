// src/services/apiService.js
import axios from 'axios';
import authHeader from './authHeader.js';
import router from '../router/index.js'
import store from '../store/index.js'
// eslint-disable-next-line
import { ref } from 'vue';
import  useGlobalAlert  from '@/composables/useGlobalAlert.js';

const API_URL = 'http://198.199.68.78:3000/cherry/';

// Crear una nueva instancia de Axios 

  const api = axios.create({
    baseURL: API_URL,
  });

  const { showAlert } = useGlobalAlert();
  
  api.interceptors.response.use(
    (response) => {
      return response;
     },
     error => {
      if(error.response.status === 401) {
        console.log('Error 401');
        store.dispatch('logout');
        router.push('/login');
        showAlert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.', 'error');
      }
      return Promise.reject(error);
     }
  )

//------------ Get -----------//

const getPerteneceA = async () => {
  const response = await api.get(API_URL + 'perteneceA',{
    headers: authHeader()
  });
  return response.data;
};

const getPerteneceABySpa = async (spaId) => {
  const response = await api.get(API_URL + 'perteneceA/' + spaId, {
    headers: authHeader()
  });
  return response.data;
};

const getEmpleados = async () => {
  
    const response = await api.get(API_URL + 'empleados', {
      headers: authHeader(),
    });
    return response.data;
};

const getEmpleadosActivos = async () => {

    const response = await api.get(API_URL + 'empleados/activos',{
      headers: authHeader(),
    });
    return response.data;
}

const getClientes = async (params) => {

  const response = await api.get(API_URL + 'clientes', {
    headers: authHeader(),
    params
  });
  return response.data;
};

const getCitas = async (params) => {
    const response = await api.get(API_URL + 'citas', {
        headers: authHeader(),
        params
    });
    return response.data;
}

const getCitasCount = async (params) => {
  const response = await api.get(API_URL + 'citas/count', {
    headers: authHeader(),
    params, // Agregar otras opciones como params
  });
  return response.data;
};

const getCompras = async () => {
  const response = await api.get(API_URL + 'compras', {
    headers: authHeader()
  });
  return response.data;
};

const getSesiones = async () => {
  const response = await api.get(API_URL + 'sesiones', {
    headers: authHeader()
  });
  return response.data;
};

const getCabinas = async (params) => {
  const response = await api.get(API_URL + 'cabinas', {
    headers: authHeader(),
    params
  });
  return response.data;
};

const getSpas = async () => {
    const response = await api.get(API_URL + 'spas', {
        headers: authHeader()
    });
  return response.data;
};

const getPaquetes = async () => {
  const response = await api.get(API_URL + 'paquetes', {
    headers: authHeader()
  });
  return response.data;
};

const getValoraciones = async (params) => {
  const response = await api.get(API_URL + 'valoraciones', {
    headers: authHeader(),
    params
  });
  return response.data;
};

const getEstadoAgenda = async (idSpa) => {
  const response = await api.get(API_URL + "estado-agenda", {
    headers: authHeader(),
    params: { idSpa }, // Enviar el idSpa como parámetro
  });
  return response.data;
};

const getFechaApertura = async (idSpa) => {
  const response = await api.get(API_URL + "fecha-apertura", {
    headers: authHeader(),
    params: { idSpa }, // Enviar el idSpa como parámetro
  });
  return response.data;
};


//------------ Add -----------//

const addPerteneceA = async (perteneceA) => {
  const response = await api.post(API_URL + 'perteneceA/', perteneceA, {
    headers: authHeader(),
  });
  return response.data;
};

const addCliente = async (cliente) => {
  const response = await api.post(API_URL + 'cliente/', cliente, {
    headers: authHeader(),
  });
  return response.data;
};

const addCita = async (cita) => {
  const response = await api.post(API_URL + 'cita/', cita, {
    headers: authHeader(),
  });
  return response.data;
};

const addCompra = async (compra) => {
  const response = await api.post(API_URL + 'compra/', compra, {
    headers: authHeader(),
  });
  return response.data;
};

const addEmpleado = async (empleado) => {
  const response = await api.post(API_URL + 'empleado/', empleado, {
    headers: authHeader(),
  });
  return response.data;
};

const addPaquete = async (paquete) => {
  const response = await api.post(API_URL + 'paquete/', paquete, {
    headers: authHeader(),
  });
  return response.data;
};

const addCabina = async (cabina) => {
  const response = await api.post(API_URL + 'cabina/', cabina, {
    headers: authHeader(),
  });
  return response.data;
};

const addValoracion = async (valoracion) => {
  const response = await api.post(API_URL + 'valoracion/', valoracion, {
    headers: authHeader(),
  });
  return response.data;
};

// ----------- Crear Documento Cliente -------/
const generateClientDocument = async (clienteId) => {
  const response = await api.post(`clientes/${clienteId}/document`, {
    headers: authHeader(),
  });
  return response.data; // Retorna la respuesta, que incluye el `filePath`
};

//------------ Update -----------//

const updatePerteneceA = async (spaId, paqueteId, perteneceA) => {
  const response = await api.put(API_URL + 'perteneceA/' + spaId + '/' + paqueteId, perteneceA, {
    headers: authHeader(),
  });
  return response.data;
};

const updateCliente = async (cliente) => {

  const response = await api.put(API_URL + 'cliente/' + cliente.id_cliente, cliente, {
    headers: authHeader(),
  });
  return response.data;
};

const updateCita = async (cita) => {
  const response = await api.put(API_URL + 'cita/' + cita.id_cita, cita, {
    headers: authHeader(),
  });
  return response.data;
};

const updateCompra = async (compra) => {
  const response = await api.put(API_URL + 'compra/' + compra.id_compra, compra, {
    headers: authHeader(),
  });
  return response.data;
};

const updateEmpleado = async (empleado) => {
  const response = await api.put(API_URL + 'empleado/' + empleado.id_empleado, empleado,{
    headers: authHeader(),
});
  return response.data;
};

const updatePaquete = async (paquete) => {
  const response = await api.put(API_URL + 'paquete/' + paquete.id_paquete, paquete, {
    headers: authHeader(),
  });
  return response.data;
};

const updateCabina = async (cabina) => {
  const response = await api.put(API_URL + 'cabina/' + cabina.id_cabina, cabina, {
    headers: authHeader(),
  });
  return response.data;
};

const updateValoracion = async (valoracion) => {
  const response = await api.put(API_URL + 'valoracion/' + valoracion.id_valoracion, valoracion, {
    headers: authHeader(),
  });
  return response.data;
};

const updateEstadoAgenda = async (estado, idSpa) => {
  const response = await api.put(
    API_URL + "estado-agenda",
    { estado }, // Enviar el estado en el cuerpo
    {
      headers: authHeader(),
      params: { idSpa }, // Enviar el idSpa como parámetro en la URL
    }
  );
  return response.data;
};

const updateFechaApertura = async (fecha_apertura, idSpa) => {
  const response = await api.put(API_URL +
    "fecha-apertura",
    { fecha_apertura },
    { headers: authHeader(),
      params: { idSpa }, // 
     }
  );
  return response.data;
};
//------------ Delete -----------//

const deltePterneceA = async (spaId, paqueteId) => {
  const response = await api.delete(API_URL + 'perteneceA/' + spaId + '/' + paqueteId, {
    headers: authHeader(),
  });
  return response.data;
};

const deleteCliente = async (id_cliente) => {
  const response = await api.delete(API_URL + 'cliente/' + id_cliente,{
    headers: authHeader(),
  });
  return response.data;
};

const deleteCita = async (id_cita) => {
  console.log("Delete cita id:", id_cita);
  const response = await api.delete(API_URL + 'cita/' + id_cita, {
    headers: authHeader(),
  });
  return response.data;
};

const deleteCompra = async (id_compra) => {
  const response = await api.delete(API_URL + 'compra/' + id_compra, {
    headers: authHeader(),
  });
  return response.data;
};

const deleteEmpleado = async (id_empleado) => {
  console.log("Delete empleado id:", id_empleado);
  const response = await api.delete(API_URL + 'empleado/' + id_empleado, {
    headers: authHeader(),
  });
  return response.data;
};

const deletePaquete = async (id_paquete) => {
  const response = await api.delete(API_URL + 'paquete/' + id_paquete, {
    headers: authHeader(),
  });
  return response.data;
};

const deleteCabina = async (id_cabina) => {
  const response = await api.delete(API_URL + 'cabina/' + id_cabina, {
    headers: authHeader(),
  });
  return response.data;
};

const deleteValoracion = async (id_valoracion) => {
  const response = await api.delete(API_URL + 'valoracion/' + id_valoracion, {
    headers: authHeader(),
  });
  return response.data;
};

export default {
  getClientes,
  getEmpleados,
  getEmpleadosActivos,
  getCitas,
  getCitasCount,
  getCompras,
  getSesiones,
  getCabinas,
  getSpas,
  getPaquetes,
  getPerteneceA,
  getPerteneceABySpa,
  getValoraciones,
  getEstadoAgenda,
  getFechaApertura,
  addPerteneceA,
  addCliente,
  addEmpleado,
  addCita,
  addCompra,
  addCabina,
  addPaquete,
  addValoracion,
  generateClientDocument,
  updatePerteneceA,
  updateCliente,
  updateEmpleado,
  updateCita,
  updateCompra,
  updatePaquete,
  updateCabina,
  updateValoracion,
  updateEstadoAgenda,
  updateFechaApertura,
  deltePterneceA,
  deleteCliente,
  deleteEmpleado,
  deleteCita,
  deleteCompra,
  deletePaquete,
  deleteCabina,
  deleteValoracion
  // Exporta las otras solicitudes API aquí
};
