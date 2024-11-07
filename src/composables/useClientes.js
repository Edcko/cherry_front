import { ref } from "vue";
import apiServices from "@/services/apiServices";
import { getCurrentInstance } from "vue";

export default function useClientes() {
  const clientes = ref([]);
  const app = getCurrentInstance();

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
        "Hubo un error al crear la cliente.",
        "error"
      );
    }
  };

  const updateCliente = async (cliente) => {
    try {
      await apiServices.updateCliente(cliente);
      clientes.value = await apiServices.getClientes();
      //app.appContext.config.globalProperties.$showAlert("La ")
    } catch (error) {
      console.error(error);
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
      clientes.value = await apiServices.getClientes();
    } catch (error) {
      console.error("Error getting clientes", error);
    }
  };

  const generateDocument = async (cliente) => {
    try {
      await apiServices.generateClientDocument(cliente.id_cliente);
  
      // Ajusta la URL para descargar el documento
      const fileName = `cliente_${cliente.id_cliente}.pdf`;
      const url = `http://198.199.68.78:3000/documents/${fileName}`;
      
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
