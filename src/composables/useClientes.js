import {ref} from 'vue';
import apiServices from '@/services/apiServices';
import { getCurrentInstance } from 'vue';

export default function useClientes(){

    const cliente = ref({
        nombre_cliente: "",
        apellido_paterno: "",
        apellido_materno: "",
        email: "",
        telefono_cliente: "",
        fecha_nacimiento: "",
        sexo: "",
        direccion: "",
      });

    const dialog = ref(false);
    
    const app = getCurrentInstance();

    const openDialog = () => {
        dialog.value = true;
      };
    
      const closeDialog = () => {
        dialog.value = false;
      };    

    const addCliente = async (newCliente) => {
       try{
        await apiServices.addCliente(newCliente);
        closeDialog();
        app.appContext.config.globalProperties.$showAlert("El cliente se registro correctamente.", "success");
       }catch(error){
        console.error(error);
        app.appContext.config.globalProperties.$showAlert("Hubo un error al registar al cliente", "error");
       }

    }

    return{dialog,cliente,openDialog, closeDialog, addCliente};
}