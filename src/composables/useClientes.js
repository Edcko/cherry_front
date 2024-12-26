import { ref } from "vue";
import apiServices from "@/services/apiServices";
import { getCurrentInstance } from "vue";
import store from "@/store";

export default function useClientes() {
  const clientes = ref([]);
  const app = getCurrentInstance();
  const idSpa = store.getters.idSpa;


  const addCliente = async (newCliente) => {
    newCliente.created_at = new Date().toISOString();
    try {
      const addedCliente = await apiServices.addCliente(newCliente);
      app.appContext.config.globalProperties.$showAlert(
        "El cliente se dio de alta correctamente.",
        "success"
      );
      clientes.value.push(addedCliente);
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert(
        "Hubo un error al crear el cliente.",
        "error"
      );
    }
  };

  const updateCliente = async (cliente) => {
    try {
      // Realiza la solicitud de actualización al backend
      await apiServices.updateCliente(cliente);
  
      // Encuentra el índice del cliente en la lista local
      const index = clientes.value.findIndex((c) => c.id_cliente === cliente.id_cliente);
  
       // Si el cliente existe en la lista, actualiza sus datos localmente
    if (index !== -1) {
      clientes.value[index] = { ...clientes.value[index], ...cliente };
    } else {
      // Si no se encuentra el cliente en la lista local, maneja el error
      app.appContext.config.globalProperties.$showAlert(
        "El cliente no se encontró en la lista local. Actualizando lista completa.",
        "warning"
      );
      // Realiza una solicitud para obtener toda la lista de clientes
      clientes.value = await apiServices.getClientes({ idSpa: idSpa });
    }
  
      app.appContext.config.globalProperties.$showAlert(
        "El cliente se actualizó correctamente.",
        "success"
      );
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert(
        "Hubo un error al actualizar el cliente.",
        "error"
      );
    }
  };
  

  const deleteCliente = async (cliente) => {
    try {
      await apiServices.deleteCliente(cliente.id_cliente);
      app.appContext.config.globalProperties.$showAlert(
        "El cliente se eliminó correctamente.",
        "success"
      );
    } catch (error) {
      app.appContext.config.globalProperties.$showAlert("Error al eliminar cliente", 'error');
    }

    try {
      clientes.value = await apiServices.getClientes({idSpa: idSpa});
    } catch (error) {
      console.error("Error getting clientes", error);
    }
  };

  const generateDocument = async (cliente) => {
    try {
      await apiServices.generateClientDocument(cliente.id_cliente);
  
      // Ajusta la URL para descargar el documento
      const fileName = `cliente_${cliente.id_cliente}.pdf`;
      const url = `http://localhost:3000/documents/${fileName}`;
      
      // Crea un enlace para descargar el documento
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error al generar el documento:', error);
      app.appContext.config.globalProperties.$showAlert(
        "Hubo un error al generar el documento.",
        "error"
      );
    }
  };
    

  return { 
    clientes, 
    addCliente, 
    updateCliente, 
    deleteCliente,
    generateDocument,
  };
}
