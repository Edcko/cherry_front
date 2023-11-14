import { ref } from 'vue';
import apiServices from '@/services/apiServices';
import { getCurrentInstance } from 'vue';

export default function useClientes() {
    const compras = ref([]);
    const app = getCurrentInstance();

    const addCompra = async (newCompra) => {
        newCompra.created_at = new Date().toISOString();
        try {
            const addedCompra = await apiServices.addCompra(newCompra);
            app.appContext.config.globalProperties.$showAlert(
                'La compra se dio de alta correctamente.',
                'success'
            );
            compras.value.push(addedCompra);
            compras.value = await apiServices.getCompras();
        } catch (error) {
            console.error(error);
            app.appContext.config.globalProperties.$showAlert(
                'Hubo un error al crear la compra.',
                'error'
            );
        }
    };

    const updateCompra = async (compra) => {
        try {
            await apiServices.updateCompra(compra);
            compras.value = await apiServices.getCompras();
            //app.appContext.config.globalProperties.$showAlert("La ")
        } catch (error) {
            console.error(error);
        }
    };

    const deleteCompra = async (compra) => {
        try {
            await apiServices.deleteCompra(compra.id_compra);
            app.appContext.config.globalProperties.$showAlert(
                'La compra se eliminó correctamente.',
                'success'
            );
        } catch (error) {
            app.appContext.config.globalProperties.$showAlert('Error al eliminar compra', 'error');
        }

        try {
            compras.value = await apiServices.getCompras();
        } catch (error) {
            console.error('Error getting compras', error);
        }
    };

    return {
        compras,
        addCompra,
        updateCompra,
        deleteCompra,
    };
}
