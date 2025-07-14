<template>
  <v-dialog v-model="showDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon color="teal" class="mr-2">mdi-cash-plus</v-icon>
        Abonar a Compra
      </v-card-title>
      
      <v-card-text>
        <!-- Información de la compra -->
        <div class="mb-4">
          <h4 class="text-subtitle-1 mb-2">Información de la Compra</h4>
          
          <!-- Cliente -->
          <div class="d-flex align-center mb-2">
            <v-icon small color="teal" class="mr-2">mdi-account</v-icon>
            <span class="text-body-2">
              {{ getClienteNombre() }}
            </span>
          </div>
          
          <!-- Paquete -->
          <div class="d-flex align-center mb-2">
            <v-icon small color="blue" class="mr-2">mdi-package</v-icon>
            <span class="text-body-2">{{ getPaqueteNombre() }}</span>
          </div>
          
          <!-- Fecha de compra -->
          <div class="d-flex align-center mb-3">
            <v-icon small color="grey" class="mr-2">mdi-calendar</v-icon>
            <span class="text-body-2">{{ formatDate(compra?.fecha_compra) }}</span>
          </div>
        </div>

        <!-- Resumen de pagos actual -->
        <v-divider class="mb-4"></v-divider>
        
        <div class="mb-4">
          <h4 class="text-subtitle-1 mb-2">Estado Actual de Pagos</h4>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-2">Monto Original:</span>
            <span class="font-weight-bold">${{ parseFloat(compra?.monto_original || 0).toFixed(2) }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-2">Ya Pagado:</span>
            <span class="font-weight-bold text-success">${{ parseFloat(compra?.monto_pagado || 0).toFixed(2) }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-3">
            <span class="text-body-2">Adeudado:</span>
            <span class="font-weight-bold text-warning">${{ parseFloat(compra?.monto_adeudado || 0).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Formulario de abono -->
        <v-divider class="mb-4"></v-divider>
        
        <div class="mb-4">
          <h4 class="text-subtitle-1 mb-2">Nuevo Abono</h4>
          
          <v-text-field
            v-model="montoAbono"
            label="Monto a abonar"
            type="number"
            variant="filled"
            color="teal"
            :rules="[rules.required, rules.positive, rules.maxAmount]"
            :hint="`Máximo: $${parseFloat(compra?.monto_adeudado || 0).toFixed(2)}`"
            persistent-hint
            class="mb-3"
          ></v-text-field>
          
          <v-select
            v-model="tipoAbono"
            label="Tipo de abono"
            :items="tiposAbono"
            variant="filled"
            color="teal"
            :rules="[rules.required]"
            class="mb-3"
          ></v-select>
          
          <v-textarea
            v-model="observaciones"
            label="Observaciones (opcional)"
            variant="filled"
            color="teal"
            rows="2"
            class="mb-3"
          ></v-textarea>
        </div>

        <!-- Resumen del nuevo estado -->
        <v-divider class="mb-4"></v-divider>
        
        <div v-if="montoAbono > 0" class="mb-4">
          <h4 class="text-subtitle-1 mb-2">Nuevo Estado Después del Abono</h4>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-2">Total Pagado:</span>
            <span class="font-weight-bold text-success">${{ nuevoTotalPagado.toFixed(2) }}</span>
          </div>
          
          <div class="d-flex justify-space-between mb-2">
            <span class="text-body-2">Nuevo Adeudado:</span>
            <span class="font-weight-bold" :class="nuevoAdeudado <= 0 ? 'text-success' : 'text-warning'">
              ${{ nuevoAdeudado.toFixed(2) }}
            </span>
          </div>
          
          <div class="d-flex justify-space-between">
            <span class="text-body-2">Nuevo Estado:</span>
            <span class="font-weight-bold" :class="nuevoAdeudado <= 0 ? 'text-success' : 'text-warning'">
              {{ nuevoAdeudado <= 0 ? 'Completado' : 'Adeudo' }}
            </span>
          </div>
        </div>
      </v-card-text>
      
      <v-card-actions class="px-4 pb-4">
        <v-btn color="grey" text @click="handleCancel">
          Cancelar
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn 
          color="teal" 
          :disabled="!isValid || isSubmitting"
          :loading="isSubmitting"
          @click="handleAbonar"
        >
          {{ nuevoAdeudado <= 0 ? 'Liquidar Completamente' : 'Abonar' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { getCurrentInstance } from 'vue';

export default {
  name: 'AbonarCompraDialog',
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
  emits: ['close', 'abonado'],
  setup(props, { emit }) {
    const app = getCurrentInstance();
    const showDialog = ref(false);
    const montoAbono = ref('');
    const tipoAbono = ref('');
    const observaciones = ref('');
    const isSubmitting = ref(false);

    const tiposAbono = [
      { title: 'Pago parcial', value: 'parcial' },
      { title: 'Liquidación completa', value: 'completa' },
      { title: 'Pago con descuento', value: 'descuento' }
    ];

    const rules = {
      required: (value) => !!value || 'Este campo es requerido',
      positive: (value) => parseFloat(value) > 0 || 'El monto debe ser mayor a 0',
      maxAmount: (value) => {
        const monto = parseFloat(value);
        const adeudado = parseFloat(props.compra?.monto_adeudado || 0);
        return monto <= adeudado || `El monto no puede exceder el adeudado ($${adeudado.toFixed(2)})`;
      }
    };

    // Sincronizar el prop show con el estado interno
    watch(() => props.show, (newVal) => {
      showDialog.value = newVal;
      if (newVal) {
        resetForm();
      }
    });

    watch(showDialog, (newVal) => {
      if (!newVal) {
        emit('close');
      }
    });

    const resetForm = () => {
      montoAbono.value = '';
      tipoAbono.value = '';
      observaciones.value = '';
    };

    const nuevoTotalPagado = computed(() => {
      const pagadoActual = parseFloat(props.compra?.monto_pagado || 0);
      const abono = parseFloat(montoAbono.value || 0);
      return pagadoActual + abono;
    });

    const nuevoAdeudado = computed(() => {
      const original = parseFloat(props.compra?.monto_original || 0);
      return original - nuevoTotalPagado.value;
    });

    const isValid = computed(() => {
      const monto = parseFloat(montoAbono.value || 0);
      const adeudado = parseFloat(props.compra?.monto_adeudado || 0);
      return monto > 0 && monto <= adeudado && tipoAbono.value;
    });

    const handleCancel = () => {
      showDialog.value = false;
    };

    const handleAbonar = async () => {
      try {
        isSubmitting.value = true;
        
        const datosAbono = {
          id_compra: props.compra.id_compra,
          monto_abono: parseFloat(montoAbono.value),
          tipo_abono: tipoAbono.value,
          observaciones: observaciones.value,
          nuevo_monto_pagado: nuevoTotalPagado.value,
          nuevo_monto_adeudado: nuevoAdeudado.value,
          nuevo_estado: nuevoAdeudado.value <= 0 ? 'Completado' : 'Adeudo'
        };

        emit('abonado', datosAbono);
        showDialog.value = false;
        
        app.appContext.config.globalProperties.$showAlert(
          `Abono registrado exitosamente. ${nuevoAdeudado.value <= 0 ? '¡Compra liquidada completamente!' : ''}`,
          'success'
        );
      } catch (error) {
        console.error('Error al procesar el abono:', error);
        app.appContext.config.globalProperties.$showAlert(
          'Error al procesar el abono: ' + error.message,
          'error'
        );
      } finally {
        isSubmitting.value = false;
      }
    };

    const getClienteNombre = () => {
      if (props.compra?.Cliente) {
        return `${props.compra.Cliente.nombre_cliente} ${props.compra.Cliente.apellido_paterno} ${props.compra.Cliente.apellido_materno}`;
      }
      return `Cliente ID: ${props.compra?.id_cliente || 'N/A'}`;
    };

    const getPaqueteNombre = () => {
      if (props.compra?.Paquete) {
        return props.compra.Paquete.nombre_paquete;
      }
      return `Paquete ID: ${props.compra?.id_paquete || 'N/A'}`;
    };

    const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('es-ES');
    };

    return {
      showDialog,
      montoAbono,
      tipoAbono,
      observaciones,
      isSubmitting,
      tiposAbono,
      rules,
      nuevoTotalPagado,
      nuevoAdeudado,
      isValid,
      handleCancel,
      handleAbonar,
      getClienteNombre,
      getPaqueteNombre,
      formatDate
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