import { ref } from 'vue';
import apiServices from '@/services/apiServices';
import { getCurrentInstance } from 'vue';

export default function useCompras() {
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
            
            // Emitir evento para generar PDF automáticamente
            if (app.appContext.config.globalProperties.$emit) {
                app.appContext.config.globalProperties.$emit('compraCreada', addedCompra);
            }
            
            return addedCompra;
        } catch (error) {
            console.error(error);
            app.appContext.config.globalProperties.$showAlert(
                'Hubo un error al crear la compra.',
                'error'
            );
            throw error;
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

    const abonarCompra = async (datosAbono) => {
        try {
            // Actualizar la compra con los nuevos montos
            const compraActualizada = {
                id_compra: datosAbono.id_compra,
                monto_pagado: datosAbono.nuevo_monto_pagado,
                monto_adeudado: datosAbono.nuevo_monto_adeudado,
                estado_compra: datosAbono.nuevo_estado
            };

            await apiServices.updateCompra(compraActualizada);
            
            // Actualizar la lista de compras
            compras.value = await apiServices.getCompras();
            
            // Mostrar mensaje de éxito
            const mensaje = datosAbono.nuevo_estado === 'Completado' 
                ? '¡Compra liquidada completamente!' 
                : `Abono de $${datosAbono.monto_abono.toFixed(2)} registrado exitosamente.`;
            
            app.appContext.config.globalProperties.$showAlert(mensaje, 'success');
            
            return compraActualizada;
        } catch (error) {
            console.error('Error al abonar compra:', error);
            app.appContext.config.globalProperties.$showAlert(
                'Error al procesar el abono: ' + error.message,
                'error'
            );
            throw error;
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
        abonarCompra,
        deleteCompra,
    };
}
