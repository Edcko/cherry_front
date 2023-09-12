<template>
    <v-row justify="center">
      
      <v-col cols="12" md="6">
        <!-- Buscador de compras -->
        <v-toolbar color="teal" dark>
        <v-toolbar-title class="white--text">Paquetes adquiridos</v-toolbar-title>
      </v-toolbar>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="localSearchQuery"
              append-icon="mdi-magnify"
              label="Buscar compras"
              single-line
              hide-details
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
  
        <!-- Listado de compras -->
        <v-row v-if="!isLoading" class="compras-spacing">
          <v-col 
            v-for="compra in filteredCompras" 
            :key="compra.id_cliente" 
            cols="12"
          >
            <v-card>
              <v-card-item>
                <div>
                  <div class="text-h6">
                    {{ compra.Cliente.nombre_cliente }} {{ compra.Cliente.apellido_paterno }} {{ compra.Cliente.apellido_materno }}
                  </div>
                  <div class="text-caption">
                    Paquete: {{ compra.Paquete.nombre_paquete }}
                  </div>
                  <div class="text-caption">
                    Fecha de Compra: {{ compra.fecha_compra }}
                  </div>
                  <div class="text-caption">
                    Monto Original: ${{ compra.monto_original }}
                  </div>
                  <div class="text-caption">
                    Monto Pagado: ${{ compra.monto_pagado }}
                  </div>
                  <div class="text-caption">
                    Monto Adeudado: ${{ compra.monto_adeudado }}
                  </div>
                  <div class="text-caption">
                    Estado: {{ compra.estado_compra }}
                  </div>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
</template>
  
  
  <script>
  import { ref, computed } from "vue";
  
  export default {
    props: {
      compras: {
        type: Array,
        required: true
      },
      isLoading: {
        type: Boolean,
        default: false
      }
    },
    setup(props) {
      const localSearchQuery = ref("");
  
      const filteredCompras = computed(() => {
        return props.compras.filter((compra) => {
          return (
            compra.Cliente.nombre_cliente
              .toLowerCase()
              .includes(localSearchQuery.value.toLowerCase()) ||
            compra.Cliente.apellido_paterno
              .toLowerCase()
              .includes(localSearchQuery.value.toLowerCase()) ||
            compra.Cliente.apellido_materno
              .toLowerCase()
              .includes(localSearchQuery.value.toLowerCase()) ||
            compra.Paquete.nombre_paquete
              .toLowerCase()
              .includes(localSearchQuery.value.toLowerCase()) ||
            compra.fecha_compra
              .toLowerCase()
              .includes(localSearchQuery.value.toLowerCase()) ||
            compra.estado_compra
              .toLowerCase()
              .includes(localSearchQuery.value.toLowerCase())
          );
        });
      });
  
      return {
        localSearchQuery,
        filteredCompras
      };
    }
  };
  </script>
  
  <!-- Aquí irían tus estilos -->
  