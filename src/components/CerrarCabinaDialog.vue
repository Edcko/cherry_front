<template>
    <v-card class="mx-auto" style="width: 100%; max-width: 400px;">
      <v-toolbar color="teal" dark flat>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title class="text-h5 font-weight-regular justify-center">
          Cerrar Cabina
        </v-card-title>
      </v-toolbar>
      <v-form ref="form" v-model="isValid" class="pa-4 pt-6">
        <!-- Campo para fecha y hora preseleccionadas -->
        <v-text-field
          label="Fecha y Hora de Cierre"
          v-model="cerrarForm.fecha"
          :rules="[rules.required]"
          variant="filled"
          color="teal"
          type="datetime-local"
          class="mb-4"
        ></v-text-field>
        <!-- Campo para seleccionar la cabina -->
        <v-autocomplete
          label="Cabina"
          v-model="cerrarForm.id_cabina"
          :rules="[rules.required]"
          :items="cabinaOptions"
          variant="filled"
          color="teal"
          class="mb-4"
        ></v-autocomplete>
        <!-- Campo para el motivo -->
        <v-textarea
          label="Motivo del Cierre"
          v-model="cerrarForm.motivo"
          :rules="[rules.required]"
          variant="filled"
          color="teal"
          class="mb-4"
        ></v-textarea>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions class="px-4">
        <v-btn color="teal" text @click="clearFields">Limpiar campos</v-btn>
        <v-spacer></v-spacer>
        <v-btn color="teal" text @click="onSubmit">
          Cerrar Cabina
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import { ref, watch, onMounted, computed } from "vue";
  import apiService from "@/services/apiServices";
  import store from "@/store";
  
  export default {
    name: "CerrarCabinaDialog",
    props: {
      showDialog: {
        type: Boolean,
        required: true,
      },
      // Si se pasa la cabina desde el componente padre, se la asigna por defecto
      cabina: {
        type: Object,
        default: null,
      },
      // Propiedad para la fecha y hora preseleccionadas (formato "YYYY-MM-DDTHH:MM")
      horaPreseleccionada: {
        type: String,
        default: "",
      },
    },
    setup(props, { emit }) {
      // Estructura del formulario para cerrar la cabina
      const cerrarForm = ref({
        id_cabina: props.cabina ? props.cabina.id_cabina : "",
        fecha: "",
        motivo: "",
      });
      const isValid = ref(true);
      const rules = {
        required: (value) => !!value || "Este campo es requerido",
      };
  
      // Array reactivo para las cabinas
      const cabinas = ref([]);
      // Cargar las cabinas desde la API al montar el componente
      onMounted(async () => {
        try {
          cabinas.value = await apiService.getCabinas({ idSpa: store.getters.idSpa });
        } catch (error) {
          console.error("Error al cargar cabinas:", error);
        }
      });
      // Computed para transformar las cabinas en una lista de cadenas (igual que en CitaDialog)
      const cabinaOptions = computed(() => {
        return cabinas.value.map(
          (cabina) =>
            `${cabina.numero_cabina} - Turno ${cabina.turno} - ${cabina.Empleado.nombre_empleado} ${cabina.Empleado.apellido_paterno} ${cabina.Empleado.apellido_materno}`
        );
      });
  
      // Watch para actualizar el id_cabina si la propiedad 'cabina' cambia
      watch(
        () => props.cabina,
        (newCabina) => {
          if (newCabina) {
            cerrarForm.value.id_cabina = newCabina.id_cabina;
          }
        },
        { immediate: true }
      );
  
      // Watch para asignar la fecha preseleccionada al formulario
      watch(
        () => props.horaPreseleccionada,
        (newValue) => {
          if (newValue) {
            cerrarForm.value.fecha = newValue;
          }
        },
        { immediate: true }
      );
  
      const clearFields = () => {
        cerrarForm.value.fecha = "";
        cerrarForm.value.motivo = "";
        cerrarForm.value.id_cabina = "";
      };
  
      const onSubmit = () => {
        // Realiza la conversión: busca en el arreglo de cabinas la opción seleccionada
        const cabinaSeleccionada = cabinas.value.find((cabina) => {
          const textoCabina = `${cabina.numero_cabina} - Turno ${cabina.turno} - ${cabina.Empleado.nombre_empleado} ${cabina.Empleado.apellido_paterno} ${cabina.Empleado.apellido_materno}`;
          return textoCabina === cerrarForm.value.id_cabina;
        });
        cerrarForm.value.id_cabina = cabinaSeleccionada ? cabinaSeleccionada.id_cabina : "";
        if (isValid.value) {
          emit("cerrarCabina", { ...cerrarForm.value });
          emit("close");
        }
      };
  
      return {
        cerrarForm,
        rules,
        isValid,
        clearFields,
        onSubmit,
        cabinaOptions,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales si lo deseas */
  </style>
  