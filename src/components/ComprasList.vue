<template>
  <v-card class="mx-auto my-4" max-width="1000" elevation="10">
    <v-card-title class="custom-button">
      Ventas
      <v-spacer></v-spacer>
      <v-text-field
        v-model="localSearchQuery"
        append-icon="mdi-magnify"
        label="Buscar compras"
        single-line
        hide-details
        clearable
      ></v-text-field>
    </v-card-title>
    <v-divider></v-divider>

    <!-- Añadir v-if para mostrar la carga solo si isLoading es true -->
    <v-row justify="center" align="center" v-if="isLoading" class="full-height">
      <v-progress-circular indeterminate color="teal"></v-progress-circular>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-virtual-scroll
          :items="filteredCompras"
          height="400"
          item-height="48"
        >
        <template v-slot:default="{ item }">
          <v-list-item two-line>
  <v-list-item>
    <v-list-item-title>
      {{ item.Cliente.nombre_cliente }} {{ item.Cliente.apellido_paterno }} {{ item.Cliente.apellido_materno }}
    </v-list-item-title>
    <v-list-item-subtitle>
      Paquete: {{ item.Paquete.nombre_paquete }} - Fecha de Compra: {{ item.fecha_compra }}<br>
      Monto Original: ${{ item.monto_original }} - Monto Pagado: ${{ item.monto_pagado }} - Monto Adeudado: ${{ item.monto_adeudado }}<br>
      Estado: {{ item.estado_compra }}
    </v-list-item-subtitle>
  </v-list-item>
  <v-list-item-action class="button-actions">
    <v-btn icon @click="handleGeneratePDF(item)" class="mr-2" :loading="isGeneratingPDF">
      <v-tooltip activator="parent" location="top">Generar ticket PDF</v-tooltip>
      <v-icon color="teal">mdi-file-pdf-box</v-icon>
    </v-btn>
    <v-btn 
      icon 
      @click="handleAbonarCompra(item)" 
      class="mr-2"
      :disabled="item.estado_compra === 'Completado'"
      :color="item.estado_compra === 'Completado' ? 'grey' : 'teal'"
    >
      <v-tooltip activator="parent" location="top">Abonar o liquidar compra</v-tooltip>
      <v-icon>{{ item.estado_compra === 'Completado' ? 'mdi-check-circle' : 'mdi-cash-plus' }}</v-icon>
    </v-btn>
    <v-btn icon @click="handleDeleteCompra(item)">
      <v-tooltip activator="parent" location="top">Eliminar compra</v-tooltip>
      <v-icon color="teal">mdi-delete</v-icon>
    </v-btn>
  </v-list-item-action>
</v-list-item>
<v-divider></v-divider>
</template>
        </v-virtual-scroll>
      </v-col>
    </v-row>

    <!--  boton para agregar compras -->
    <v-row justify="center" class="my-2">
      <v-dialog v-model="showCompraDialog" persistent max-width="600px">
        <template v-slot:activator="{ props }">
  <v-btn dark class="custom-button" elevation="8" v-bind="props" @click="showCompraDialog = true" icon>
    <v-icon>mdi-playlist-plus</v-icon>
  </v-btn>
</template>
    <compra-dialog :show-dialog="showCompraDialog" @close="showCompraDialog = false" @addCompra="handleAddCompra" />
  </v-dialog>

</v-row>
  <!--  boton para agregar compras -->

  </v-card>

  <!-- Diálogo de confirmación de eliminación -->
  <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro de eliminar la cita {{ compraToDelete.id_compra }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red darken-1" text @click="deleteCompra">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  <!-- Diálogo de abono -->
  <abonar-compra-dialog 
    :show="showAbonarDialog" 
    :compra="compraToAbonar" 
    @close="showAbonarDialog = false" 
    @abonado="handleAbonado" 
  />

</template>


<script>
import { ref, computed } from "vue";
import CompraDialog from "@/components/CompraDialog.vue";
import AbonarCompraDialog from "@/components/AbonarCompraDialog.vue";
import usePDF from "@/composables/usePDF.js";
import useCompras from "@/composables/useCompras.js";

export default {
  name: "ComprasList",
  components: {
    CompraDialog,
    AbonarCompraDialog,
  },
  props: {
    compras: {
      type: Array,
      required: true
    },
    isLoading: {
      type: Boolean,
      default: false
    }, 
  },
  emits: ['addCompra', 'deleteCompra', 'compraUpdated'],
  setup(props, { emit }) { //Aqui desestructuras 'emit'
    const localSearchQuery = ref('');
    const showCompraDialog = ref(false);
    const confirmDeleteDialog = ref(false);
    const compraToDelete = ref(null);
    const showAbonarDialog = ref(false);
    const compraToAbonar = ref(null);

    // Importar composables
    const { isGeneratingPDF, generateTicketPDF } = usePDF();
    const { abonarCompra } = useCompras();

    // Se define una función de búsqueda que actualizará el filtro cada vez que el usuario escriba en el campo de búsqueda.
    // eslint-disable-next-line
 //   const searchCompras = (newValue) => {
      // La lógica de filtrado se aplica aquí, similar a lo que ya tienes en el watcher.
 //   };

    // Metodo para manejar el evento addCompra
    const handleAddCompra = (compra) => {
      emit('addCompra', compra); // Emitir evento al componente padre
    }

    const handleDeleteCompra = (compra) => {
     compraToDelete.value = compra;
     confirmDeleteDialog.value = true;
    };

    const deleteCompra = () => {
      emit('deleteCompra', compraToDelete.value);
      confirmDeleteDialog.value = false;
    };

    const handleAbonarCompra = (compra) => {
      // Solo permitir abonar si la compra no está completada
      if (compra.estado_compra === 'Completado') {
        return;
      }
      
      compraToAbonar.value = compra;
      showAbonarDialog.value = true;
    };

    const handleAbonado = async (datosAbono) => {
      try {
        await abonarCompra(datosAbono);
        // Emitir evento para actualizar la lista en el componente padre
        emit('compraUpdated');
      } catch (error) {
        console.error('Error al procesar el abono:', error);
      }
    };

    // Método para generar PDF del ticket
    const handleGeneratePDF = async (compra) => {
      try {
        await generateTicketPDF(compra);
      } catch (error) {
        console.error('Error al generar PDF:', error);
      }
    };

    const filteredCompras = computed(() => {
      if (localSearchQuery.value === '') {
        return props.compras;
      } else {
        return props.compras.filter((compra) => {
          return (
            compra.Cliente.nombre_cliente.toLowerCase().includes(localSearchQuery.value.toLowerCase()) ||
            compra.Cliente.apellido_paterno.toLowerCase().includes(localSearchQuery.value.toLowerCase()) ||
            compra.Cliente.apellido_materno.toLowerCase().includes(localSearchQuery.value.toLowerCase()) ||
            compra.Paquete.nombre_paquete.toLowerCase().includes(localSearchQuery.value.toLowerCase()) ||
            compra.fecha_compra.toLowerCase().includes(localSearchQuery.value.toLowerCase()) ||
            compra.estado_compra.toLowerCase().includes(localSearchQuery.value.toLowerCase())
          );
        });
      }
    });

    return {
      showCompraDialog,
      localSearchQuery,
      filteredCompras,
    //  searchCompras,
      handleAddCompra,
      handleDeleteCompra,
      handleAbonarCompra,
      handleAbonado,
      handleGeneratePDF,
      confirmDeleteDialog,
      compraToDelete,
      deleteCompra,
      isGeneratingPDF,
      showAbonarDialog,
      compraToAbonar
    };
  }
};
</script>

<style scoped>
.custom-button {
  color: teal;
}
.custom-button-abonar{
  color: teal;
}

.full-height {
  height: 80vh;
}

.my-2 {
  padding-top: 8px;
  padding-bottom: 8px;
}

.button-actions {
  display: flex;
  align-items: center;
  justify-content: center; /* Centra los botones horizontalmente */
  padding: 4px 0; /* Añade un pequeño espacio en la parte superior e inferior */
  
}

</style>
