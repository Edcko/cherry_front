<template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Agregar Valoración</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="ID Cliente"
                v-model="valoracion.id_cliente"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-textarea
                label="Observaciones"
                v-model="valoracion.observaciones"
                required
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-textarea
                label="Recomendaciones"
                v-model="valoracion.recomendaciones"
                required
              ></v-textarea>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="['Verdadero', 'Falso']"
                label="Resultado"
                v-model="valoracion.resultado"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="Paquete Recomendado"
                v-model="valoracion.paquete_recomendado"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">Cerrar</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="onSubmit">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    props: ["showDialog"],
    setup(props, { emit }) {
      const valoracion = ref({
        id_cliente: "",
        observaciones: "",
        recomendaciones: "",
        resultado: "",
        paquete_recomendado: ""
      });
  
      const onSubmit = () => {
        emit("addValoracion", valoracion.value);
        emit("close");
      };
  
      return {
        valoracion,
        onSubmit
      };
    }
  };
  </script>
  
  <style scoped>
  .dialog {
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 5px;
    padding: 40px;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    z-index: 100;
  }
  </style>
  