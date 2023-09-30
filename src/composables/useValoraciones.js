import { ref } from 'vue';
import apiService from "@/services/apiServices";
import { getCurrentInstance } from 'vue';

export default function useValoraciones() {
  const valoraciones = ref([]);
  const app = getCurrentInstance();

  const fetchValoraciones = async () => {
    try {
      valoraciones.value = await apiService.getValoraciones();
    } catch (error) {
      console.error("Error obteniendo las valoraciones", error);
    }
  }

  const addValoracion = async (newValoracion) => {
    try {
      await apiService.addValoracion(newValoracion);
      app.appContext.config.globalProperties.$showAlert("La valoración se añadió correctamente.", "success");
      await fetchValoraciones();
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert("Hubo un error al crear la valoración.", "error");
    }
  };

  const updateValoracion = async (valoracion) => {
    try {
      await apiService.updateValoracion(valoracion);
      valoraciones.value = await apiService.getValoraciones();
      app.appContext.config.globalProperties.$showAlert("La valoración se actualizó correctamente.", "success");
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert("La actualización de valoración salió mal.", "error");
    }
  };

  const deleteValoracion = async (valoracion) => {
    try {
      await apiService.deleteValoracion(valoracion.id_valoracion);
      app.appContext.config.globalProperties.$showAlert("La valoración se eliminó correctamente.", "success");
    } catch (error) {
      console.error("Error deleting valoracion:", error);
      app.appContext.config.globalProperties.$showAlert("Algo salió mal al eliminar la valoración.", "error");
    }
    
    try {
      valoraciones.value = await apiService.getValoraciones();
    } catch (error) {
      console.error("Error getting valoraciones:", error);      
    }
  };

  return { valoraciones, fetchValoraciones, addValoracion, updateValoracion, deleteValoracion };
}
