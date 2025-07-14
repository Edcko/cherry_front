// src/composables/useBloqueoCabina.js
import { ref } from 'vue';
import apiService from '@/services/apiServices';
import { getCurrentInstance } from 'vue';
import store from '@/store';

export default function useBloqueoCabina() {
  const app = getCurrentInstance();
  
  // Estado reactivo para guardar los bloqueos
  const bloqueos = ref([]);
  
  // Opción para guardar errores (si lo requieres)
  const error = ref(null);

  // Obtener el idSpa desde store (igual que en useCitas)
  const idSpa = store.getters.idSpa;
  
  // Función para obtener los bloqueos filtrando por idSpa
  const fetchBloqueos = async () => {
    try {
      const data = await apiService.getBloqueos({ idSpa });
      bloqueos.value = data;
    } catch (err) {
      console.error("Error al obtener bloqueos:", err);
      error.value = err;
      // En caso de querer usar tu sistema de alertas global:
      app.appContext.config.globalProperties.$showAlert(
        "Error al cargar los bloqueos.",
        "error"
      );
    }
  };

   // Nueva función para obtener bloqueos filtrados por un rango de fechas
   const fetchBloqueosByDateRange = async (startDate, endDate) => {
    try {
      const response = await apiService.getBloqueosByDateRange({
        idSpa: store.getters.idSpa,
        startDate,
        endDate,
      });
      
      // Comparar arrays de manera más eficiente usando deep comparison
      const currentBloqueos = bloqueos.value || [];
      const hasChanges = response.length !== currentBloqueos.length || 
        response.some((newBloqueo, index) => {
          const currentBloqueo = currentBloqueos[index];
          return !currentBloqueo || 
                 newBloqueo.id_bloqueo !== currentBloqueo.id_bloqueo ||
                 newBloqueo.fecha_bloqueo !== currentBloqueo.fecha_bloqueo ||
                 newBloqueo.motivo !== currentBloqueo.motivo;
        });
      
      // Solo actualizar si realmente hay cambios
      if (hasChanges) {
        bloqueos.value = response;
      }
    } catch (error) {
      console.error("Error al obtener bloqueos por rango de fecha:", error);
    }
  };

  // Función para crear un nuevo bloqueo
  const createBloqueo = async (nuevoBloqueo) => {
    try {
      // Se asigna el idSpa si no se envía
      const bloqueoData = { ...nuevoBloqueo, id_spa: idSpa };
      const data = await apiService.addBloqueo(bloqueoData);
      // Actualiza el estado local (o se puede volver a hacer un fetch)
      bloqueos.value.push(data);
      app.appContext.config.globalProperties.$showAlert(
        "Bloqueo creado correctamente.",
        "success"
      );
    } catch (err) {
      console.error("Error al crear bloqueo:", err);
      error.value = err;
      app.appContext.config.globalProperties.$showAlert(
        "Error al crear el bloqueo.",
        "error"
      );
    }
  };

  // Función para actualizar un bloqueo existente
  const updateBloqueo = async (bloqueoActualizado) => {
    try {
      const data = await apiService.updateBloqueo(bloqueoActualizado);
      // Actualiza el registro en el array local
      const index = bloqueos.value.findIndex(b => b.id_bloqueo === data.id_bloqueo);
      if (index !== -1) {
        bloqueos.value[index] = data;
      }
      app.appContext.config.globalProperties.$showAlert(
        "Bloqueo actualizado correctamente.",
        "success"
      );
    } catch (err) {
      console.error("Error al actualizar bloqueo:", err);
      error.value = err;
      app.appContext.config.globalProperties.$showAlert(
        "Error al actualizar el bloqueo.",
        "error"
      );
    }
  };

  // Función para eliminar un bloqueo
  const removeBloqueo = async (id_bloqueo) => {
    try {
      await apiService.deleteBloqueo(id_bloqueo);
      bloqueos.value = bloqueos.value.filter(b => b.id_bloqueo !== id_bloqueo);
      app.appContext.config.globalProperties.$showAlert(
        "Bloqueo eliminado correctamente.",
        "success"
      );
    } catch (err) {
      console.error("Error al eliminar bloqueo:", err);
      error.value = err;
      app.appContext.config.globalProperties.$showAlert(
        "Error al eliminar el bloqueo.",
        "error"
      );
    }
  };

  return {
    bloqueos,
    error,
    fetchBloqueos,
    fetchBloqueosByDateRange,
    createBloqueo,
    updateBloqueo,
    removeBloqueo
  };
}