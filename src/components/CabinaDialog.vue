<template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Agregar Cabina</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-text-field
                label="Número de Cabina"
                v-model="cabina.numero_cabina"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="[
                  'Matutino',
                  'Vespertino',
                ]"
                label="Turno"
                v-model="cabina.turno"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-select
                :items="[
                  'Disponible',
                  'En reparación',
                ]"
                label="Estado"
                v-model="cabina.estado_cabina"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-autocomplete
                label="Terapeuta asignado"
                v-model="cabina.id_empleado"
                :items="empleadoOptions"
                required
              ></v-autocomplete>
            </v-col>
            
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="$emit('close')"
          >Cerrar</v-btn
        >
        <v-btn color="blue-darken-1" variant="text" @click="onSubmit"
          >Guardar</v-btn
        >
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import { ref, onMounted, computed } from "vue";
  import apiService from "@/services/apiServices";
  import store from "@/store";
  
  export default {
    props: ["showDialog"],
    setup(props, { emit }) {
      const cabina = ref({
        id_empleado: "",
        numero_cabina: "",
        estado_cabina: "",
        turno: "",
        id_spa: store.getters.idSpa
      });
  
      const empleados = ref([]);
      const idSpa = store.getters.idSpa;
  
      onMounted(async () => {
        empleados.value = await apiService.getEmpleados();
        console.log("Empleados:", empleados.value);
      });
  
      const empleadoOptions = computed(() => {
        return empleados.value.map(
          (empleado) =>
            `${empleado.nombre_empleado} ${empleado.apellido_paterno} ${empleado.apellido_materno}`
        );
      });
  
      const onSubmit = () => {
        const empleadoSeleccionado = empleados.value.find(
          (e) =>
            `${e.nombre_empleado} ${e.apellido_paterno} ${e.apellido_materno}` ===
            cabina.value.id_empleado
        );
        console.log("empleadoSeleccionado:", empleadoSeleccionado);
        cabina.value.id_empleado = empleadoSeleccionado
          ? empleadoSeleccionado.id_empleado
          : "";
        console.log("cabina.value.id_empleado:", cabina.value.id_empleado);
  
        emit("addCabina", cabina.value);
        emit("close");
      };
  
      return {
        idSpa,
        cabina,
        empleados,
        onSubmit,
        empleadoOptions,
      };
    },
  };
  </script>
  
  
  <style>
  .dialog {
    /* Estilos para el diálogo de creación de cabinas */
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
  