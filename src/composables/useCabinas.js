import { ref } from 'vue';
import apiService from "@/services/apiServices";
import { getCurrentInstance } from 'vue';

export default function useCabinas() {
  const cabinas = ref([]);
  const app = getCurrentInstance();


  const fetchCabinas = async () => {
    try {
      cabinas.value = await apiService.getCabinas();
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
      await apiService.updateCabina(cabina);
      cabinas.value = await apiService.getCabinas();
      app.appContext.config.globalProperties.$showAlert("La cabina se actualizo correctamente.", "success");
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert("La actualización de la cabina salió mal.", "error");
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
