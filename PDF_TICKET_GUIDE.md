# Guía de Generación de PDF para Tickets de Venta

## Descripción
Esta funcionalidad permite generar automáticamente tickets PDF para las ventas realizadas en el sistema Cherry Nails. Los tickets incluyen toda la información relevante de la venta, cliente y paquete adquirido.

## Características

### 📄 Contenido del Ticket PDF
- **Encabezado**: Logo y nombre del spa (Cherry Nails)
- **Información del ticket**: Número de ticket y fecha
- **Datos del cliente**: Nombre completo, email y teléfono
- **Detalles del servicio**: Nombre del paquete y descripción
- **Resumen de pagos**: Monto original, pagado y adeudado
- **Estado de la compra**: Completado o Adeudo
- **Pie de página**: Mensaje de agradecimiento

### 🎯 Funcionalidades Implementadas

#### 1. Generación Manual de PDF
- **Ubicación**: Lista de compras en la vista Cliente
- **Acción**: Hover sobre una compra y hacer clic en el icono PDF
- **Resultado**: Descarga automática del ticket PDF

#### 2. Generación Automática Post-Venta
- **Ubicación**: Después de crear una nueva compra
- **Acción**: Diálogo de confirmación automático
- **Resultado**: Opción de generar PDF inmediatamente

#### 3. Generación desde Dashboard
- **Ubicación**: Tarjetas de detalles de compras en el dashboard
- **Acción**: Botón PDF en cada tarjeta de compra
- **Resultado**: Descarga del ticket PDF

## 🛠️ Instalación y Configuración

### Dependencias Requeridas
```bash
npm install jspdf html2canvas
```

### Archivos Creados/Modificados

#### Nuevos Archivos:
- `src/services/pdfService.js` - Servicio principal de generación de PDF
- `src/composables/usePDF.js` - Composable para manejo de PDF
- `src/components/PDFConfirmationDialog.vue` - Diálogo de confirmación

#### Archivos Modificados:
- `src/services/apiServices.js` - Agregado método `getCompraCompleta`
- `src/composables/useCompras.js` - Modificado para emitir eventos
- `src/components/ComprasList.vue` - Agregado botón de PDF
- `src/views/Cliente.vue` - Integración completa de la funcionalidad

## 📋 Uso

### Para Usuarios Finales:

1. **Generar PDF de una venta existente**:
   - Ir a la vista Cliente
   - En la lista de ventas, hacer hover sobre una compra
   - Hacer clic en el icono PDF (📄)
   - El archivo se descargará automáticamente

2. **Generar PDF después de nueva venta**:
   - Crear una nueva compra
   - Aparecerá automáticamente un diálogo preguntando si desea generar el PDF
   - Hacer clic en "Generar PDF"
   - El archivo se descargará automáticamente

3. **Generar PDF desde el dashboard**:
   - En el dashboard, expandir los detalles de una fecha
   - Hacer clic en el icono PDF en cualquier tarjeta de compra
   - El archivo se descargará automáticamente

### Para Desarrolladores:

#### Generar PDF Programáticamente:
```javascript
import usePDF from '@/composables/usePDF.js';

const { generateTicketPDF } = usePDF();

// Generar PDF para una compra
await generateTicketPDF(compraObject);
```

#### Personalizar el PDF:
```javascript
// En src/services/pdfService.js
// Modificar el método createTicketHTML() para cambiar el diseño
// Modificar el método generateSimpleTicketPDF() para cambios básicos
```

## 🎨 Personalización

### Cambiar el Diseño del Ticket:
1. Editar `src/services/pdfService.js`
2. Modificar el método `createTicketHTML()`
3. Ajustar estilos CSS inline según necesidades

### Cambiar el Nombre del Archivo:
```javascript
// En pdfService.js, línea ~70
const fileName = `ticket_venta_${compra.id_compra}_${fecha}.pdf`;
```

### Agregar Información Adicional:
```javascript
// En createTicketHTML(), agregar nuevas secciones
<div style="...">
  <span style="font-weight: bold;">Nueva Información:</span>
  <span>${nuevoValor}</span>
</div>
```

## 🔧 Configuración del Backend

### Endpoint Requerido:
El sistema espera un endpoint en el backend para obtener datos completos de una compra:

```
GET /api/compra/{id_compra}/completa
```

**Respuesta esperada:**
```json
{
  "id_compra": 1,
  "fecha_compra": "2024-01-15",
  "monto_original": 150.00,
  "monto_pagado": 150.00,
  "monto_adeudado": 0.00,
  "estado_compra": "Completado",
  "Cliente": {
    "id_cliente": 1,
    "nombre_cliente": "Juan",
    "apellido_paterno": "Pérez",
    "apellido_materno": "García",
    "email": "juan@email.com",
    "telefono_cliente": "123456789"
  },
  "Paquete": {
    "id_paquete": 1,
    "nombre_paquete": "Manicure Básico",
    "descripcion": "Manicure completo con esmalte",
    "precio": 150.00
  }
}
```

## 🐛 Solución de Problemas

### Error: "No se pudieron obtener los datos completos de la compra"
- Verificar que el endpoint `/compra/{id}/completa` esté implementado en el backend
- Verificar la conexión con la API

### Error: "Faltan datos del cliente o paquete"
- Verificar que la compra tenga asociado un cliente y paquete válidos
- Verificar que los datos estén completos en la base de datos

### PDF no se descarga:
- Verificar permisos del navegador para descargas
- Verificar que no haya bloqueadores de popups activos
- Verificar la consola del navegador para errores JavaScript

### PDF se ve mal:
- Verificar que las fuentes estén disponibles en el sistema
- Ajustar el tamaño del canvas en `html2canvas` si es necesario
- Verificar que el HTML generado sea válido

## 📝 Notas Técnicas

### Librerías Utilizadas:
- **jsPDF**: Generación de PDFs
- **html2canvas**: Conversión de HTML a imagen para PDFs con diseño complejo

### Formatos Soportados:
- PDF (Portable Document Format)
- A4 como tamaño de página por defecto

### Compatibilidad:
- Navegadores modernos (Chrome, Firefox, Safari, Edge)
- Requiere JavaScript habilitado
- Funciona tanto en modo claro como oscuro

## 🔄 Actualizaciones Futuras

### Funcionalidades Planificadas:
- [ ] Plantillas personalizables de tickets
- [ ] Envío de PDF por email
- [ ] Almacenamiento de PDFs en el servidor
- [ ] Códigos QR en los tickets
- [ ] Firmas digitales
- [ ] Múltiples idiomas

### Mejoras Técnicas:
- [ ] Optimización de rendimiento para grandes volúmenes
- [ ] Cache de PDFs generados
- [ ] Compresión de archivos
- [ ] Watermarks personalizables 