import { ref } from 'vue';
import pdfService from '@/services/pdfService';
import apiService from '@/services/apiServices';
import { getCurrentInstance } from 'vue';

export default function usePDF() {
  const isGeneratingPDF = ref(false);
  const app = getCurrentInstance();

  /**
   * Genera un PDF del ticket de venta
   * @param {Object} compra - Objeto de la compra
   */
  const generateTicketPDF = async (compra) => {
    try {
      isGeneratingPDF.value = true;
      
      // Obtener datos completos de la compra (cliente y paquete)
      const compraCompleta = await apiService.getCompraCompleta(compra.id_compra);
      
      if (!compraCompleta) {
        throw new Error('No se pudieron obtener los datos completos de la compra');
      }

      // Extraer datos del cliente y paquete
      const cliente = compraCompleta.Cliente || compra.Cliente;
      const paquete = compraCompleta.Paquete || compra.Paquete;

      if (!cliente || !paquete) {
        throw new Error('Faltan datos del cliente o paquete para generar el ticket');
      }

      // Generar el PDF
      const fileName = await pdfService.generateTicketPDF(compra, cliente, paquete);
      
      app.appContext.config.globalProperties.$showAlert(
        `Ticket generado exitosamente: ${fileName}`,
        'success'
      );

      return fileName;
    } catch (error) {
      console.error('Error al generar PDF:', error);
      app.appContext.config.globalProperties.$showAlert(
        'Error al generar el PDF del ticket: ' + error.message,
        'error'
      );
      throw error;
    } finally {
      isGeneratingPDF.value = false;
    }
  };

  /**
   * Genera un PDF simple del ticket de venta (sin HTML)
   * @param {Object} compra - Objeto de la compra
   */
  const generateSimpleTicketPDF = async (compra) => {
    try {
      isGeneratingPDF.value = true;
      
      // Obtener datos completos de la compra (cliente y paquete)
      const compraCompleta = await apiService.getCompraCompleta(compra.id_compra);
      
      if (!compraCompleta) {
        throw new Error('No se pudieron obtener los datos completos de la compra');
      }

      // Extraer datos del cliente y paquete
      const cliente = compraCompleta.Cliente || compra.Cliente;
      const paquete = compraCompleta.Paquete || compra.Paquete;

      if (!cliente || !paquete) {
        throw new Error('Faltan datos del cliente o paquete para generar el ticket');
      }

      // Generar el PDF simple
      const fileName = pdfService.generateSimpleTicketPDF(compra, cliente, paquete);
      
      app.appContext.config.globalProperties.$showAlert(
        `Ticket generado exitosamente: ${fileName}`,
        'success'
      );

      return fileName;
    } catch (error) {
      console.error('Error al generar PDF:', error);
      app.appContext.config.globalProperties.$showAlert(
        'Error al generar el PDF del ticket: ' + error.message,
        'error'
      );
      throw error;
    } finally {
      isGeneratingPDF.value = false;
    }
  };

  return {
    isGeneratingPDF,
    generateTicketPDF,
    generateSimpleTicketPDF
  };
} 