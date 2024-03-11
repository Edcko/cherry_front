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
import { utcToZonedTime, format } from "date-fns-tz";
import apiService from "@/services/apiServices";

export default {
  props: ["showDialog", "valoracionParaEditar"],
  setup(props, { emit }) {
    const valoracion = ref({
      fecha_valoracion: "",
      id_cliente: null, // Se cambió a null para un manejo más adecuado de la inicialización
      id_empleado: null,
      observaciones: "",
      recomendaciones: "",
      resultado: "",
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
      clientes.value = await apiService.getClientes();
      empleados.value = await apiService.getEmpleados();
      // Asumimos que este código corre correctamente y trae los datos esperados
    });

    // Opciones para autocompletes de clientes y empleados
    const clienteOptions = computed(() => clientes.value.map((cliente) => ({
      text: `${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}`,
      value: cliente.id_cliente
    })));
    const empleadoOptions = computed(() => empleados.value.map((empleado) => ({
      text: `${empleado.nombre_empleado} ${empleado.apellido_paterno} ${empleado.apellido_materno}`,
      value: empleado.id_empleado
    })));

    // Observador para actualizar los campos cuando se edita una valoración
    watch(() => props.valoracionParaEditar, (nuevaValoracion) => {
      if (nuevaValoracion) {
        // Ajuste de fecha para input datetime-local
        const fechaLocal = format(utcToZonedTime(new Date(nuevaValoracion.fecha_valoracion), "America/Mexico_City"), "yyyy-MM-dd'T'HH:mm");
        
        // Actualización de la valoración con datos para edición
        valoracion.value = {
          ...nuevaValoracion,
          fecha_valoracion: fechaLocal,
          id_cliente: nuevaValoracion.id_cliente,
          id_empleado: nuevaValoracion.id_empleado
        };
      }
    }, { deep: true, immediate: true });

    // Limpiar campos
    const clearFields = () => {
      valoracion.value = {
        fecha_valoracion: "",
        id_cliente: null,
        id_empleado: null,
        observaciones: "",
        recomendaciones: "",
        resultado: "",
        estado: "Por confirmar",
      };
    };

    // Enviar valoración
    const onSubmit = () => {
      // Convierte el nombre del cliente y empleado seleccionado de vuelta a sus IDs
  const clienteSeleccionado = clientes.value.find(c => 
    `${c.nombre_cliente} ${c.apellido_paterno} ${c.apellido_materno}` === valoracion.value.id_cliente
  );
  valoracion.value.id_cliente = clienteSeleccionado ? clienteSeleccionado.id_cliente : valoracion.value.id_cliente;

  const empleadoSeleccionado = empleados.value.find(e => 
    `${e.nombre_empleado} ${e.apellido_paterno} ${e.apellido_materno}` === valoracion.value.id_empleado
  );
  valoracion.value.id_empleado = empleadoSeleccionado ? empleadoSeleccionado.id_empleado : valoracion.value.id_empleado;


      // Formatear la fecha a UTC o el formato que requiera tu backend
      const fechaUTC = format(utcToZonedTime(new Date(valoracion.value.fecha_valoracion), "UTC"), "yyyy-MM-dd'T'HH:mm:ss'Z'");
      valoracion.value.fecha_valoracion = fechaUTC;

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
  