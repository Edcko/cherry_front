import { ref } from "vue";
import apiServices from "@/services/apiServices";
import { getCurrentInstance } from "vue";
import store from "@/store";

export default function usePaquetes() {
  const paquetes = ref([]);
  const app = getCurrentInstance();
  
  const idSpa = store.getters.idSpa;

  const fetchPaquetes = async () => {
    try {
      paquetes.value = await apiServices.getPerteneceAByCurrentSpa();
      console.log("paquetes", paquetes.value);
    } catch (error) {
      console.error("Error obteniendo los paquetes", error);
    }
  };

   const addPaquete = async (newPaquete) => {
    try {
      const addedPaquete = await apiServices.addPaquete(newPaquete);
      app.appContext.config.globalProperties.$showAlert(
        "El paquete se dio de alta correctamente",
        "success"
      );
     // await fetchPaquetes();
      return addedPaquete; // Retorna el paquete agregado
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert(
        "Hubo un error al registrar el paquete.",
        "error"
      );
      throw error; // Lanza el error para que el llamador pueda manejarlo
    }
  };

  const updatePaquete = async (paquete) => {
    try {
      await apiServices.updatePaquete(paquete);
      paquetes.value = await apiServices.getPerteneceAByCurrentSpa();
    } catch (error) {
      console.error(error);
    }
  };

  const deletePaquete = async (paquete) => {
    try {
      await apiServices.deletePaquete(paquete.id_paquete);
      app.appContext.config.globalProperties.$showAlert(
        "El paquete se eliminó correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error eliminando el paquete", error);
    }

    try {
      paquetes.value = await apiServices.getPerteneceAByCurrentSpa();
    } catch (error) {
      console.error("Error obteniendo los paquetes", error);
    }
  };

  return {
    idSpa,
    paquetes,
    addPaquete,
    updatePaquete,
    deletePaquete,
    fetchPaquetes,
  };
}
