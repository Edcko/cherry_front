import { ref } from "vue";
import apiServices from "@/services/apiServices";
import { getCurrentInstance } from "vue";

export default function usePaquetes() {
  const paquetes = ref([]);
  const app = getCurrentInstance();

  const fetchPaquetes = async () => {
    try {
      paquetes.value = await apiServices.getPaquetes();
    } catch (error) {
      console.error("Error obteniendo los paquetes", error);
    }
  };

  const addPaquete = async (newPaquete) => {
    try {
      await apiServices.addPaquete(newPaquete);
      app.appContext.config.globalProperties.$showAlert(
        "El paquete se dio de alta correctamente",
        "success"
      );
      await fetchPaquetes();
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert(
        "Hubo un error al registrar el paquete.",
        "error"
      );
    }
  };

  const updatePaquete = async (paquete) => {
    try {
      await apiServices.updatePaquete(paquete);
      paquetes.value = await apiServices.getPaquetes();
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
      paquetes.value = await apiServices.getPaquetes();
    } catch (error) {
      console.error("Error obteniendo los paquetes", error);
    }
  };

  return {
    paquetes,
    addPaquete,
    updatePaquete,
    deletePaquete,
    fetchPaquetes,
  };
}
