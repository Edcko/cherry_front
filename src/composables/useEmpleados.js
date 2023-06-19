import { ref } from "vue";
import apiServices from "@/services/apiServices";
import { getCurrentInstance } from "vue";

export default function useEmpleados() {
  const empleados = ref([]);
  const app = getCurrentInstance();

  const fetchEmpleados = async () => {
    try {
      empleados.value = await apiServices.getEmpleados();
    } catch (error) {
      console.error("Error getting empleados", error);
    }
  };

  const addEmpleado = async (newEmpleado) => {
    try {
      await apiServices.addEmpleado(newEmpleado);
      app.appContext.config.globalProperties.$showAlert(
        "El empleado se dio de alta correctamente",
        "success"
      );
      await fetchEmpleados();
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert(
        "Hubo un error al registrar al empleado.",
        "error"
      );
    }
  };

  const updateEmpleado = async (empleado) => {
    try {
      await apiServices.updateEmpleado(empleado);
      empleados.value = await apiServices.getEmpleados();
      //app.appContext.config.globalProperties.$showAlert("La ")
    } catch (error) {
      console.error(error);
    }
  };

  const deleteEmpleado = async (empleado) => {
    try {
      await apiServices.deleteEmpleado(empleado.id_empleado);
      app.appContext.config.globalProperties.$showAlert(
        "El empleado se eliminó correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error deleting empleado", error);
    }

    try {
      empleados.value = await apiServices.getEmpleados();
    } catch (error) {
      console.error("Error getting empleados", error);
    }
  };

  return {
    empleados,
    addEmpleado,
    updateEmpleado,
    deleteEmpleado,
    fetchEmpleados,
  };
}
