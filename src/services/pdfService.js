import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

class PDFService {
  /**
   * Genera un PDF del ticket de venta
   * @param {Object} compra - Objeto con los datos de la compra
   * @param {Object} cliente - Objeto con los datos del cliente
   * @param {Object} paquete - Objeto con los datos del paquete
   */
  async generateTicketPDF(compra, cliente, paquete) {
    try {
      // Crear el contenido HTML del ticket
      const ticketHTML = this.createTicketHTML(compra, cliente, paquete);
      
      // Crear un elemento temporal para renderizar el HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = ticketHTML;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '300px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.padding = '15px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '10px';
      tempDiv.style.lineHeight = '1.2';
      document.body.appendChild(tempDiv);

      // Convertir HTML a canvas
      const canvas = await html2canvas(tempDiv, {
        width: 300,
        height: tempDiv.scrollHeight,
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true
      });

      // Remover el elemento temporal
      document.body.removeChild(tempDiv);

      // Crear PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Verificar si el contenido cabe en una página
      if (imgHeight <= pageHeight) {
        // Si cabe en una página, centrarlo
        const yOffset = (pageHeight - imgHeight) / 2;
        pdf.addImage(imgData, 'PNG', 0, yOffset, imgWidth, imgHeight);
      } else {
        // Si no cabe, ajustar para que quepa en una página
        const scale = pageHeight / imgHeight;
        const adjustedWidth = imgWidth * scale;
        const adjustedHeight = pageHeight;
        const xOffset = (210 - adjustedWidth) / 2;
        pdf.addImage(imgData, 'PNG', xOffset, 0, adjustedWidth, adjustedHeight);
      }

      // Generar nombre del archivo
      const fecha = new Date().toISOString().split('T')[0];
      const fileName = `ticket_venta_${compra.id_compra}_${fecha}.pdf`;

      // Descargar el PDF
      pdf.save(fileName);

      return fileName;
    } catch (error) {
      console.error('Error al generar PDF:', error);
      throw new Error('No se pudo generar el PDF del ticket');
    }
  }

  /**
   * Crea el HTML del ticket de venta
   */
  createTicketHTML(compra, cliente, paquete) {
    const fecha = new Date(compra.fecha_compra).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return `
      <div style="font-family: Arial, sans-serif; max-width: 300px; margin: 0 auto; font-size: 10px; line-height: 1.2;">
        <!-- Encabezado -->
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
          <h1 style="color: #333; margin: 0; font-size: 18px; font-weight: bold;">TANYA DE ICAZA</h1>
          <p style="margin: 3px 0; color: #666; font-size: 11px;">Spa & Beauty Center</p>
          <p style="margin: 3px 0; color: #666; font-size: 9px;">Ticket de Venta</p>
        </div>

        <!-- Información del ticket -->
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="font-weight: bold; font-size: 9px;">Ticket #:</span>
            <span style="font-size: 9px;">${compra.id_compra}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span style="font-weight: bold; font-size: 9px;">Fecha:</span>
            <span style="font-size: 9px;">${fecha}</span>
          </div>
        </div>

        <!-- Información del cliente -->
        <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 15px; border-radius: 3px;">
          <h3 style="margin: 0 0 8px 0; color: #333; font-size: 12px;">Cliente</h3>
          <div style="margin-bottom: 3px;">
            <span style="font-weight: bold; font-size: 9px;">Nombre:</span>
            <span style="font-size: 9px;">${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}</span>
          </div>
          <div style="margin-bottom: 3px;">
            <span style="font-weight: bold; font-size: 9px;">Email:</span>
            <span style="font-size: 9px;">${cliente.email || 'No especificado'}</span>
          </div>
          <div style="margin-bottom: 3px;">
            <span style="font-weight: bold; font-size: 9px;">Teléfono:</span>
            <span style="font-size: 9px;">${cliente.telefono_cliente || 'No especificado'}</span>
          </div>
        </div>

        <!-- Detalles del servicio -->
        <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 15px; border-radius: 3px;">
          <h3 style="margin: 0 0 8px 0; color: #333; font-size: 12px;">Servicio</h3>
          <div style="margin-bottom: 8px;">
            <span style="font-weight: bold; font-size: 9px;">Paquete:</span>
            <span style="font-size: 9px;">${paquete.nombre_paquete}</span>
          </div>
          <div style="margin-bottom: 8px;">
            <span style="font-weight: bold; font-size: 9px;">Descripción:</span>
            <span style="font-size: 9px;">${paquete.descripcion || 'Sin descripción'}</span>
          </div>
        </div>

        <!-- Resumen de pagos -->
        <div style="border: 1px solid #ddd; padding: 10px; margin-bottom: 15px; border-radius: 3px;">
          <h3 style="margin: 0 0 8px 0; color: #333; font-size: 12px;">Resumen de Pagos</h3>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-size: 9px;">Monto Original:</span>
            <span style="font-weight: bold; font-size: 9px;">$${parseFloat(compra.monto_original).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-size: 9px;">Monto Pagado:</span>
            <span style="font-weight: bold; color: #28a745; font-size: 9px;">$${parseFloat(compra.monto_pagado).toFixed(2)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
            <span style="font-size: 9px;">Monto Adeudado:</span>
            <span style="font-weight: bold; color: #dc3545; font-size: 9px;">$${parseFloat(compra.monto_adeudado).toFixed(2)}</span>
          </div>
          <div style="border-top: 1px solid #ddd; padding-top: 5px; margin-top: 5px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: bold; font-size: 9px;">Estado:</span>
              <span style="font-weight: bold; color: ${compra.estado_compra === 'Completado' ? '#28a745' : '#ffc107'}; font-size: 9px;">
                ${compra.estado_compra}
              </span>
            </div>
          </div>
        </div>

        <!-- Pie de página -->
        <div style="text-align: center; border-top: 2px solid #333; padding-top: 10px; margin-top: 15px;">
          <p style="margin: 3px 0; color: #666; font-size: 9px;">¡Gracias por su compra!</p>
          <p style="margin: 3px 0; color: #666; font-size: 8px;">Para cualquier consulta, contáctenos</p>
          <p style="margin: 3px 0; color: #666; font-size: 8px;">Este documento es un comprobante oficial</p>
        </div>
      </div>
    `;
  }

  /**
   * Genera un PDF simple usando solo jsPDF (sin HTML)
   */
  generateSimpleTicketPDF(compra, cliente, paquete) {
    const pdf = new jsPDF();
    
    // Configuración de fuentes
    pdf.setFont('helvetica');
    pdf.setFontSize(16);
    
    // Título
    pdf.text('TANYA DE ICAZA', 105, 20, { align: 'center' });
    pdf.setFontSize(10);
    pdf.text('Spa & Beauty Center', 105, 28, { align: 'center' });
    pdf.text('Ticket de Venta', 105, 35, { align: 'center' });
    
    // Línea separadora
    pdf.line(20, 42, 190, 42);
    
    // Información del ticket
    pdf.setFontSize(9);
    pdf.text(`Ticket #: ${compra.id_compra}`, 20, 55);
    pdf.text(`Fecha: ${new Date(compra.fecha_compra).toLocaleDateString('es-ES')}`, 20, 62);
    
    // Información del cliente
    pdf.setFontSize(10);
    pdf.text('Cliente:', 20, 75);
    pdf.setFontSize(9);
    pdf.text(`Nombre: ${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}`, 20, 82);
    pdf.text(`Email: ${cliente.email || 'No especificado'}`, 20, 89);
    pdf.text(`Teléfono: ${cliente.telefono_cliente || 'No especificado'}`, 20, 96);
    
    // Información del servicio
    pdf.setFontSize(10);
    pdf.text('Servicio:', 20, 110);
    pdf.setFontSize(9);
    pdf.text(`Paquete: ${paquete.nombre_paquete}`, 20, 117);
    pdf.text(`Descripción: ${paquete.descripcion || 'Sin descripción'}`, 20, 124);
    
    // Resumen de pagos
    pdf.setFontSize(10);
    pdf.text('Resumen de Pagos:', 20, 140);
    pdf.setFontSize(9);
    pdf.text(`Monto Original: $${parseFloat(compra.monto_original).toFixed(2)}`, 20, 147);
    pdf.text(`Monto Pagado: $${parseFloat(compra.monto_pagado).toFixed(2)}`, 20, 154);
    pdf.text(`Monto Adeudado: $${parseFloat(compra.monto_adeudado).toFixed(2)}`, 20, 161);
    pdf.text(`Estado: ${compra.estado_compra}`, 20, 168);
    
    // Pie de página
    pdf.line(20, 180, 190, 180);
    pdf.setFontSize(9);
    pdf.text('¡Gracias por su compra!', 105, 190, { align: 'center' });
    pdf.setFontSize(7);
    pdf.text('Para cualquier consulta, contáctenos', 105, 197, { align: 'center' });
    
    // Generar nombre del archivo
    const fecha = new Date().toISOString().split('T')[0];
    const fileName = `ticket_venta_${compra.id_compra}_${fecha}.pdf`;
    
    // Descargar el PDF
    pdf.save(fileName);
    
    return fileName;
  }
}

export default new PDFService(); 