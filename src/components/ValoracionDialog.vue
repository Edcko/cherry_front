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
        v-if="!valoracionParaEditar"
        label="Nombre del cliente"
        v-model="valoracion.id_cliente"
        :rules="[rules.required]"
        :items="clienteOptions"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-autocomplete>
      <v-text-field
        v-else
        label="Nombre del cliente"
        :value="getClienteText(valoracion.id_cliente)"
        readonly
        variant="filled"
        color="teal"
        class="mb-4"
      />
      <v-autocomplete
        v-if="!valoracionParaEditar"
        label="Nombre del terapeuta"
        v-model="valoracion.id_empleado"
        :rules="[rules.required]"
        :items="empleadoOptions"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-autocomplete>
      <v-text-field
        v-else
        label="Nombre del terapeuta"
        :value="getEmpleadoText(valoracion.id_empleado)"
        readonly
        variant="filled"
        color="teal"
        class="mb-4"
      />
      <v-select
        label="Estado"
        v-model="valoracion.estado"
        :items="['Por confirmar', 'Confirmado','Adquirió', 'No adquirió', 'Cancelado']"
        :rules="[rules.required]"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-select>
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
import store from "@/store";

export default {
  props: ["showDialog", "valoracionParaEditar"],
  setup(props, { emit }) {
    const valoracion = ref({
      fecha_valoracion: "",
      id_cliente: "",
      id_empleado: "",
      estado: "Por confirmar",
      id_spa: store.getters.idSpa,
    });

    const clientes = ref([]);
    const empleados = ref([]);

    const idSpa = store.getters.idSpa;

    const rules = {
      required: (value) => !!value || "Este campo es requerido",
    };
    const isValid = ref(true);

    onMounted(async () => {
      try {
        clientes.value = await apiService.getClientes({
          idSpa: idSpa,
        });
        empleados.value = await apiService.getEmpleados();
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    });

    const clienteOptions = computed(() => {
  return clientes.value.map((cliente) => {
    // Validar que las propiedades no sean null o undefined
    const nombre = cliente.nombre_cliente || "Sin nombre";
    const apellidoPaterno = cliente.apellido_paterno || "";
    const apellidoMaterno = cliente.apellido_materno || "";
    return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
  });
});

const empleadoOptions = computed(() => {
  return empleados.value.map((empleado) => {
    // Validar que las propiedades no sean null o undefined
    const nombre = empleado.nombre_empleado || "Sin nombre";
    const apellidoPaterno = empleado.apellido_paterno || "";
    const apellidoMaterno = empleado.apellido_materno || "";
    return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
  });
});


const getClienteText = (id) => {
  const cliente = clientes.value.find((cliente) => cliente.id_cliente === id);
  if (!cliente) return "Cliente no encontrado";
  const nombre = cliente.nombre_cliente || "Sin nombre";
  const apellidoPaterno = cliente.apellido_paterno || "";
  const apellidoMaterno = cliente.apellido_materno || "";
  return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
};

const getEmpleadoText = (id) => {
  const empleado = empleados.value.find((empleado) => empleado.id_empleado === id);
  if (!empleado) return "Empleado no encontrado";
  const nombre = empleado.nombre_empleado || "Sin nombre";
  const apellidoPaterno = empleado.apellido_paterno || "";
  const apellidoMaterno = empleado.apellido_materno || "";
  return `${nombre} ${apellidoPaterno} ${apellidoMaterno}`.trim();
};


    watch(
  () => props.valoracionParaEditar,
  (nuevaValoracion) => {
    if (nuevaValoracion) {
      valoracion.value = { ...nuevaValoracion };

      // Ajustar el formato de la fecha para el input datetime-local
      if (nuevaValoracion.fecha_valoracion) {
        const date = new Date(nuevaValoracion.fecha_valoracion);

        // Convertir la fecha a la zona horaria local
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60000);

        const formattedDate = localDate.toISOString().slice(0, 16); // Formato: YYYY-MM-DDTHH:mm
        valoracion.value.fecha_valoracion = formattedDate;
      }
    }
  },
  { deep: true, immediate: true }
);

    const clearFields = () => {
      valoracion.value = {
        fecha_valoracion: "",
        id_cliente: "",
        id_empleado: "",
        estado: "Por confirmar",
      };
    };

    const onSubmit = () => {
  if (!props.valoracionParaEditar) {
    // En caso de agregar: Convertir nombres seleccionados en IDs
    const clienteSeleccionado = clientes.value.find(
      (c) =>
        `${c.nombre_cliente} ${c.apellido_paterno} ${c.apellido_materno}`.trim() ===
        valoracion.value.id_cliente
    );
    valoracion.value.id_cliente = clienteSeleccionado
      ? clienteSeleccionado.id_cliente
      : null;

    const empleadoSeleccionado = empleados.value.find(
      (e) =>
        `${e.nombre_empleado} ${e.apellido_paterno} ${e.apellido_materno}`.trim() ===
        valoracion.value.id_empleado
    );
    valoracion.value.id_empleado = empleadoSeleccionado
      ? empleadoSeleccionado.id_empleado
      : null;
  } else {
    // En caso de editar: Asegurar que los IDs ya están presentes
    if (!valoracion.value.id_cliente || !valoracion.value.id_empleado) {
      console.error("No se puede editar la valoración sin cliente o empleado válidos.");
      return;
    }
  }

  // Emitir el evento correspondiente
  emit(
    props.valoracionParaEditar ? "updateValoracion" : "addValoracion",
    valoracion.value
  );
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
      getClienteText,
      getEmpleadoText,
    };
  },
};
</script>