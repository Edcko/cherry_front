<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ cabinaEdit ? "Editar Cabina" : "Agregar Cabina" }}</span>
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
              :items="['Matutino', 'Vespertino', 'Mixto']"
              label="Turno"
              v-model="cabina.turno"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-select
              :items="['Disponible', 'No disponible']"
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
      <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">Cerrar</v-btn>
      <v-btn color="blue-darken-1" variant="text" @click="onSubmit">
        {{ cabinaEdit ? "Actualizar" : "Guardar" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, onMounted, computed, watch } from "vue";
import apiService from "@/services/apiServices";
import store from "@/store";

export default {
  props: {
    showDialog: Boolean,
    cabinaEdit: Object, // Recibe la cabina para editar
  },
  setup(props, { emit }) {
    const cabina = ref({
      id_empleado: "",
      numero_cabina: "",
      estado_cabina: "Disponible",
      turno: "",
      id_spa: store.getters.idSpa,
    });

    const empleados = ref([]);
   // const idSpa = store.getters.idSpa;

    onMounted(async () => {
      empleados.value = await apiService.getEmpleadosActivos();
    });

    const empleadoOptions = computed(() => {
      return empleados.value.map(
        (empleado) =>
          `${empleado.nombre_empleado} ${empleado.apellido_paterno} ${empleado.apellido_materno}`
      );
    });

    watch(
      () => props.cabinaEdit,
      (newCabina) => {
        if (newCabina) {
          cabina.value = { ...newCabina }; // Cargar datos para edición
        }
      },
      { immediate: true }
    );

    const onSubmit = () => {
      const empleadoSeleccionado = empleados.value.find(
        (e) =>
          `${e.nombre_empleado} ${e.apellido_paterno} ${e.apellido_materno}` ===
          cabina.value.id_empleado
      );
      cabina.value.id_empleado = empleadoSeleccionado
        ? empleadoSeleccionado.id_empleado
        : "";

      if (props.cabinaEdit) {
        emit("updateCabina", cabina.value);
      } else {
        emit("addCabina", cabina.value);
      }
      emit("close");
    };

    return {
      cabina,
      empleados,
      onSubmit,
      empleadoOptions,
    };
  },
};
</script>
