// src/services/apiService.js
import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://ec2-18-191-179-167.us-east-2.compute.amazonaws.com:3000/cherry/';

const getEmpleados = async () => {
  
    const response = await axios.get(API_URL + 'empleados', {
      headers: authHeader(),
    });
    return response.data;
};

const getClientes = async () => {

  const response = await axios.get(API_URL + 'clientes', {
    headers: authHeader(),
  });
  return response.data;
}

const getCitas = async () => {
    const response = await axios.get(API_URL + 'citas', {
        headers: authHeader()
    });
    return response.data;
};

const getSesiones = async () => {
  const response = await axios.get(API_URL + 'sesiones', {
    headers: authHeader()
  });
  return response.data;
}

const addCliente = async (cliente) => {
  const response = await axios.post(API_URL + 'cliente/', cliente, {
    headers: authHeader(),
  });
  return response.data;
};

const addCita = async (cita) => {
  const response = await axios.post(API_URL + 'cita/', cita, {
    headers: authHeader(),
  });
  return response.data;
};

const updateCita = async (cita) => {
  const response = await axios.put(API_URL + 'cita/' + cita.id_cita, cita, {
    headers: authHeader(),
  });
  return response.data;
};

const deleteCita = async (id_cita) => {
  console.log("Delete cita id:", id_cita);
  const response = await axios.delete(API_URL + 'cita/' + id_cita, {
    headers: authHeader(),
  });
  return response.data;
};

export default {
  getClientes,
  getEmpleados,
  getCitas,
  getSesiones,
  addCliente,
  addCita,
  updateCita,
  deleteCita,
  // Exporta las otras solicitudes API aquí
};
