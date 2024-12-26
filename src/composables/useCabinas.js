import { ref } from 'vue';
import apiService from "@/services/apiServices";
import { getCurrentInstance } from 'vue';
import store from '@/store';

export default function useCabinas() {
  const cabinas = ref([]);
  const app = getCurrentInstance();

  const idSpa = store.getters.idSpa;

  const fetchCabinas = async () => {
    try {
      cabinas.value = await apiService.getCabinas({ 
        idSpa: idSpa 
        });
    } catch (error) {
      console.error("Error obteniendo las cabinas", error);
    }
  }

  const addCabina = async (newCabina) => {
    try {
      await apiService.addCabina(newCabina);
      app.appContext.config.globalProperties.$showAlert("La cabina se añadió correctamente.", "success");
        await fetchCabinas();
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert("Hubo un error al crear la cabina.", "error");
    }
  };

  const updateCabina = async (cabina) => {
    try {
      // Realiza la solicitud de actualización al backend
      await apiService.updateCabina(cabina);
  
      // Encuentra el índice de la cabina en la lista local
      const index = cabinas.value.findIndex((c) => c.id_cabina === cabina.id_cabina);
  
      // Si la cabina existe en la lista, actualiza sus datos localmente
      if (index !== -1) {
        cabinas.value[index] = { ...cabinas.value[index], ...cabina };
      } else {
        // Si no se encuentra la cabina en la lista local, maneja el caso
        app.appContext.config.globalProperties.$showAlert(
          "La cabina no se encontró en la lista local. Actualizando lista completa.",
          "warning"
        );
        // Realiza una solicitud para obtener toda la lista de cabinas
        cabinas.value = await apiService.getCabinas({ idSpa: idSpa });
      }
  
      app.appContext.config.globalProperties.$showAlert(
        "La cabina se actualizó correctamente.",
        "success"
      );
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert(
        "Hubo un error al actualizar la cabina.",
        "error"
      );
    }
  };
  

  const deleteCabina = async (cabina) => {
    try {
      await apiService.deleteCabina(cabina.id_cabina);
      app.appContext.config.globalProperties.$showAlert("La cabina se eliminó correctamente.", "success");
    } catch (error) {
      console.error("Error deleting cabina:", error);
      app.appContext.config.globalProperties.$showAlert("Algo salió mal al eliminar la cabina.", "error");
    }
    
    try {
      cabinas.value = await apiService.getCabinas();
    } catch (error) {
      console.error("Error getting cabinas:", error);      
    }
  };

  const changeEstado = async (cabina) => {
    const estados = ["disponible", "ocupada"];
    const currentIndex = estados.indexOf(cabina.estado_cabina);
    const newEstado = estados[(currentIndex + 1) % estados.length];
    cabina.estado_cabina = newEstado;
    await updateCabina(cabina);
  };

  return { cabinas, fetchCabinas, addCabina, updateCabina, deleteCabina, changeEstado };
}
