import {ref} from 'vue';
import apiServices from '@/services/apiServices';
import { getCurrentInstance } from 'vue';

export default function useClientes(){

    const clientes = ref([]);
    const app = getCurrentInstance();

    const addCliente = async (newCliente) => {
       try{
        await apiServices.addCliente(newCliente);
        app.appContext.config.globalProperties.$showAlert("El cliente se registro correctamente.", "success");
       }catch(error){
        console.error(error);
        app.appContext.config.globalProperties.$showAlert("Hubo un error al registar al cliente", "error");
       }

    }

    return(clientes, addCliente);
}