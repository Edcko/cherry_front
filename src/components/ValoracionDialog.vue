<template>
  <v-card class="mx-auto" style="width: 100%; max-width: 400px;">
    <v-toolbar color="teal" dark flat>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-card-title class="text-h5 font-weight-regular justify-center">
        {{ valoracionParaEditar ? "Editar valoración" : "Agregar valoración" }}
      </v-card-title>
    </v-toolbar>

    <v-form ref="form" v-model="isValid" class="pa-4 pt-6">
      <v-text-field
        label="Fecha valoración"
        v-model="valoracion.fecha_valoracion"
        type="datetime-local"
        :rules="[rules.required]"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-text-field>
      <v-autocomplete
        label="Nombre del cliente"
        v-model="valoracion.id_cliente"
        :rules="[rules.required]"
        :items="clienteOptions"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-autocomplete>
      <v-autocomplete
        label="Nombre del terapeuta"
        v-model="valoracion.id_empleado"
        :rules="[rules.required]"
        :items="empleadoOptions"
        variant="filled"
        color="teal"
        class="mb-4"
        ></v-autocomplete>
  <!--
        <v-textarea
        label="Observaciones"
        v-model="valoracion.observaciones"
        required
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-textarea>
      <v-textarea
        label="Recomendaciones"
        v-model="valoracion.recomendaciones"
        required
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-textarea>
      <v-select
        label="Resultado"
        v-model="valoracion.resultado"
        :items="['Adquirio', 'No adquirio']"
        :rules="[rules.required]"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-select>
      -->
      <v-select
        label="Estado"
        v-model="valoracion.estado"
        :items="['Por confirmar', 'Confirmado','Adquirió', 'No adquirió', 'Cancelado']"
        :rules="[rules.required]"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-select>
    </v-form>

    <v-divider></v-divider>

    <v-card-actions class="px-4">
      <v-btn color="teal" text @click="clearFields">Limpiar campos</v-btn>
      <v-spacer></v-spacer>
      <v-btn color="teal" text @click="onSubmit">Guardar</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, computed, onMounted, watch } from "vue";
import apiService from "@/services/apiServices";

export default {
  props: ["showDialog", "valoracionParaEditar"],
  setup(props, { emit }) {
    const valoracion = ref({
      fecha_valoracion: "",
      id_cliente: "",
      id_empleado: "",
      estado: "Por confirmar",
    });

    const clientes = ref([]);
    const empleados = ref([]);

    const rules = {
      required: (value) => !!value || "Este campo es requerido",
    };
    const isValid = ref(true);

    // Carga inicial de clientes y empleados
    onMounted(async () => {
      try {
        clientes.value = await apiService.getClientes();
        empleados.value = await apiService.getEmpleados();
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    });

    // Preparación de opciones para v-autocomplete
    const clienteOptions = computed(() =>
      clientes.value.map(cliente => ({
        text: `${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}`,
        value: cliente.id_cliente
      }))
    );

    const empleadoOptions = computed(() =>
      empleados.value.map(empleado => ({
        text: `${empleado.nombre_empleado} ${empleado.apellido_paterno} ${empleado.apellido_materno}`,
        value: empleado.id_empleado
      }))
    );

    // Manejo de valoración para editar
    watch(() => props.valoracionParaEditar, (nuevaValoracion) => {
      if (nuevaValoracion) {
        // Ajustar el formato de la fecha para el input datetime-local
        valoracion.value = { ...nuevaValoracion };
        valoracion.value.fecha_valoracion = nuevaValoracion.fecha_valoracion.slice(0, 16); // Asegúrate de que la fecha tenga el formato correcto
      }
    }, { deep: true, immediate: true });

    const clearFields = () => {
      valoracion.value = {
        fecha_valoracion: "",
        id_cliente: "",
        id_empleado: "",
        estado: "Por confirmar",
      };
    };

    const onSubmit = () => {
      if (props.valoracionParaEditar) {
        emit("updateValoracion", valoracion.value);
      } else {
        emit("addValoracion", valoracion.value);
      }
      emit("close");
    };

    return {
      valoracion,
      clienteOptions,
      empleadoOptions,
      rules,
      isValid,
      clearFields,
      onSubmit,
    };
  },
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
  