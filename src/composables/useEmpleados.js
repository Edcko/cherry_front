import { ref } from "vue";
import apiServices from "@/services/apiServices";
import { getCurrentInstance } from "vue";

export default function useEmpleados() {
  const empleados = ref([]);
  const empleadosActivos = ref([]);
  const app = getCurrentInstance();

  const fetchEmpleados = async () => {
    try {
      console.log('🔍 useEmpleados: Iniciando fetchEmpleados');
      empleados.value = await apiServices.getEmpleadosByCurrentSpa();
      console.log('✅ useEmpleados: Empleados cargados:', empleados.value.length, 'empleados');
      console.log('📋 useEmpleados: Lista de empleados:', empleados.value);
    } catch (error) {
      console.error("❌ Error getting empleados", error);
    }
  };

  const fetchEmpleadosActvivos = async () => {
    try{
      empleadosActivos.value = await apiServices.getEmpleadosActivosByCurrentSpa();
    } catch (error){
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
      // Realiza la solicitud de actualización al backend
      await apiServices.updateEmpleado(empleado);
  
      // Encuentra el índice del empleado en la lista local
      const index = empleados.value.findIndex((e) => e.id_empleado === empleado.id_empleado);
  
      // Si el empleado existe en la lista, actualiza sus datos localmente
      if (index !== -1) {
        empleados.value[index] = { ...empleados.value[index], ...empleado };
      } else {
        // Si no se encuentra el empleado en la lista local, recarga toda la lista
        app.appContext.config.globalProperties.$showAlert(
          "El empleado no se encontró en la lista local. Actualizando lista completa.",
          "warning"
        );
        empleados.value = await apiServices.getEmpleadosByCurrentSpa();
      }
  
      app.appContext.config.globalProperties.$showAlert(
        "El empleado se actualizó correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error al actualizar empleado:", error);
      app.appContext.config.globalProperties.$showAlert(
        "Hubo un error al actualizar el empleado.",
        "error"
      );
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
      empleados.value = await apiServices.getEmpleadosByCurrentSpa();
    } catch (error) {
      console.error("Error getting empleados", error);
    }
  };

  return {
    empleados,
    empleadosActivos,
    addEmpleado,
    updateEmpleado,
    deleteEmpleado,
    fetchEmpleados,
    fetchEmpleadosActvivos,
  };
}

