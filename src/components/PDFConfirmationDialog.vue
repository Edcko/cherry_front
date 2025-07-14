<template>
  <v-dialog v-model="showDialog" max-width="400px" persistent>
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon color="teal" class="mr-2">mdi-file-pdf-box</v-icon>
        Generar Ticket PDF
      </v-card-title>
      
      <v-card-text>
        <p class="mb-3">¿Desea generar el ticket PDF para esta venta?</p>
        
        <!-- Información del cliente -->
        <div class="d-flex align-center mb-2">
          <v-icon small color="teal" class="mr-2">mdi-account</v-icon>
          <span class="text-subtitle-2">
            {{ getClienteNombre() }}
          </span>
        </div>
        
        <!-- Información del paquete -->
        <div class="d-flex align-center mb-2">
          <v-icon small color="blue" class="mr-2">mdi-package</v-icon>
          <span class="text-subtitle-2">{{ getPaqueteNombre() }}</span>
        </div>
        
        <!-- Información de pagos -->
        <div class="d-flex align-center mb-2">
          <v-icon small color="green" class="mr-2">mdi-currency-usd</v-icon>
          <span class="text-subtitle-2">Total: ${{ compra?.monto_original || 0 }}</span>
        </div>
        
        <div class="d-flex align-center mb-2">
          <v-icon small color="orange" class="mr-2">mdi-cash-check</v-icon>
          <span class="text-subtitle-2">Pagado: ${{ compra?.monto_pagado || 0 }}</span>
        </div>
        
        <div class="d-flex align-center">
          <v-icon small color="red" class="mr-2">mdi-cash-minus</v-icon>
          <span class="text-subtitle-2">Adeudado: ${{ compra?.monto_adeudado || 0 }}</span>
        </div>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="grey" 
          text 
          @click="handleCancel"
          :disabled="isGeneratingPDF"
        >
          Cancelar
        </v-btn>
        <v-btn 
          color="teal" 
          @click="handleGeneratePDF"
          :loading="isGeneratingPDF"
          :disabled="isGeneratingPDF"
        >
          <v-icon left>mdi-file-pdf-box</v-icon>
          Generar PDF
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, watch } from 'vue';
import usePDF from '@/composables/usePDF.js';
import apiService from '@/services/apiServices.js';

export default {
  name: 'PDFConfirmationDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    compra: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'pdfGenerated'],
  setup(props, { emit }) {
    const showDialog = ref(false);
    const { isGeneratingPDF, generateTicketPDF } = usePDF();
    const clienteInfo = ref(null);
    const paqueteInfo = ref(null);

    // Sincronizar el prop show con el estado interno
    watch(() => props.show, (newVal) => {
      showDialog.value = newVal;
      if (newVal && props.compra) {
        loadCompraInfo();
      }
    });

    watch(showDialog, (newVal) => {
      if (!newVal) {
        emit('close');
      }
    });

    const loadCompraInfo = async () => {
      try {
        if (props.compra?.id_compra) {
          const compraCompleta = await apiService.getCompraCompleta(props.compra.id_compra);
          if (compraCompleta) {
            clienteInfo.value = compraCompleta.Cliente || props.compra.Cliente;
            paqueteInfo.value = compraCompleta.Paquete || props.compra.Paquete;
          }
        }
      } catch (error) {
        console.error('Error al cargar información de la compra:', error);
        // Usar datos disponibles si no se puede cargar la información completa
        clienteInfo.value = props.compra?.Cliente;
        paqueteInfo.value = props.compra?.Paquete;
      }
    };

    const handleCancel = () => {
      showDialog.value = false;
    };

    const handleGeneratePDF = async () => {
      try {
        if (props.compra) {
          await generateTicketPDF(props.compra);
          emit('pdfGenerated', props.compra);
        }
        showDialog.value = false;
      } catch (error) {
        console.error('Error al generar PDF:', error);
      }
    };

    const getClienteNombre = () => {
      if (clienteInfo.value) {
        return `${clienteInfo.value.nombre_cliente} ${clienteInfo.value.apellido_paterno} ${clienteInfo.value.apellido_materno}`;
      }
      if (props.compra?.Cliente) {
        return `${props.compra.Cliente.nombre_cliente} ${props.compra.Cliente.apellido_paterno} ${props.compra.Cliente.apellido_materno}`;
      }
      return `Cliente ID: ${props.compra?.id_cliente || 'N/A'}`;
    };

    const getPaqueteNombre = () => {
      if (paqueteInfo.value) {
        return paqueteInfo.value.nombre_paquete;
      }
      if (props.compra?.Paquete) {
        return props.compra.Paquete.nombre_paquete;
      }
      return `Paquete ID: ${props.compra?.id_paquete || 'N/A'}`;
    };

    return {
      showDialog,
      isGeneratingPDF,
      handleCancel,
      handleGeneratePDF,
      getClienteNombre,
      getPaqueteNombre
    };
  }
};
</script>

<style scoped>
.v-card-title {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.v-card-text {
  padding-top: 16px;
}
</style> 