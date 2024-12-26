import { ref } from 'vue';
import apiService from "@/services/apiServices";
import { getCurrentInstance } from 'vue';
import store from '@/store';

export default function useValoraciones() {
  const valoraciones = ref([]);
  const app = getCurrentInstance();
  const searchQuery = ref("");
  const filteredValoraciones = ref([]);
  const idSpa = store.getters.idSpa; // Obtener el idSpa

  const fetchValoraciones = async () => {
    try {
      // Pasar idSpa como parametro a la API
      valoraciones.value = await apiService.getValoraciones({ idSpa });
      filteredValoraciones.value = valoraciones.value;
      console.log("Valoraciones:", valoraciones.value);
      console.log("Filtered:", filteredValoraciones.value);

    } catch (error) {
      console.error("Error obteniendo las valoraciones", error);
    }
  };

  const addValoracion = async (newValoracion) => {
    try {
      await apiService.addValoracion(newValoracion);
      app.appContext.config.globalProperties.$showAlert("La valoración se añadió correctamente.", "success");
      await fetchValoraciones({ idSpa });
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert("Hubo un error al crear la valoración.", "error");
    }
  };

 
  const updateValoracion = async (valoracion) => {
    try {
      await apiService.updateValoracion(valoracion);
      // Actualizar la valoración en el estado local
      const index = valoraciones.value.findIndex(
        (v) => v.id_valoracion === valoracion.id_valoracion
      );
      if (index !== -1) {
        valoraciones.value[index] = { ...valoraciones.value[index], ...valoracion };
      }
      filteredValoraciones.value = [...valoraciones.value];
      app.appContext.config.globalProperties.$showAlert(
        "La valoración se actualizó correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error actualizando la valoración:", error);
      app.appContext.config.globalProperties.$showAlert(
        "La actualización de valoración salió mal.",
        "error"
      );
    }
  };

  const deleteValoracion = async (valoracion) => {
    try {
      await apiService.deleteValoracion(valoracion.id_valoracion);
      app.appContext.config.globalProperties.$showAlert(
        "La valoración se eliminó correctamente.",
        "success"
      );
      // Actualizar el estado local eliminando la valoración
      valoraciones.value = valoraciones.value.filter(
        (v) => v.id_valoracion !== valoracion.id_valoracion
      );
      filteredValoraciones.value = [...valoraciones.value];
    } catch (error) {
      console.error("Error eliminando la valoración:", error);
      app.appContext.config.globalProperties.$showAlert(
        "Algo salió mal al eliminar la valoración.",
        "error"
      );
    }
  };
  const getSundays = (start, end) =>{
    let date = new Date(start);
    let sundays = [];
  
    // Avanza hasta el primer domingo
    while (date.getDay() !== 0) {
      date.setDate(date.getDate() + 1);
    }
  
    // Agrega todos los domingos hasta la fecha de finalización
    while (date <= end) {
      sundays.push(new Date(date));
      date.setDate(date.getDate() + 7);
    }
  
    return sundays;
  }

  return { valoraciones, searchQuery, filteredValoraciones, fetchValoraciones, addValoracion, updateValoracion, deleteValoracion, getSundays };
} 
