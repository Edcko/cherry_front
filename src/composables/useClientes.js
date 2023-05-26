import {ref} from 'vue';
import apiServices from '@/services/apiServices';
import { getCurrentInstance } from 'vue';

export default function useClientes(){

    const cliente = ref({
        nombre_cliente: "",
        apellido_paterno: "",
        apellido_materno: "",
        tipo_cliente: "",
        email: "",
        telefono_cliente: "",
        fecha_nacimiento: "",
        sexo: "",
        id_spa: "",
      });

      const dialog = ref(false);
    
    const app = getCurrentInstance();

    const openDialog = () => {
        dialog.value = true;
      };
    
      const closeDialog = () => {
        dialog.value = false;
      };    

    const createCliente = async (newCliente) => {
       try{
        const newClient = await apiServices.addCliente(newCliente);
        closeDialog();
        app.appContext.config.globalProperties.$showAlert("El cliente se registro correctamente.", "success");
        return newClient; 
       }catch(error){
        console.error(error);
        app.appContext.config.globalProperties.$showAlert("Hubo un error al registar al cliente", "error");
       }

    }

    return{dialog, cliente, openDialog, closeDialog, createCliente};
}

