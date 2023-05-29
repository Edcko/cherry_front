import {ref} from 'vue';
import apiServices from '@/services/apiServices';
import { getCurrentInstance } from 'vue';

export default function useClientes(){

    const clientes = ref([]);
    const dialog = ref(false);
    const app = getCurrentInstance();

    const openDialog = () => {
        dialog.value = true;
      };
    
      const closeDialog = () => {
        dialog.value = false;
      };    

      const addCliente = async (newCliente) => {
        newCliente.created_at = new Date().toISOString();
        try {
          const addedCliente = await apiServices.addCliente(newCliente);
          app.appContext.config.globalProperties.$showAlert("El cliente se dio de alta correctamente.", "success");
          clientes.value.push(addedCliente);
        } catch (error) {
          console.error(error);
          app.appContext.config.globalProperties.$showAlert("Hubo un error al crear la cliente.", "error");
        }
      };

    return{dialog, clientes, openDialog, closeDialog, addCliente};
}

