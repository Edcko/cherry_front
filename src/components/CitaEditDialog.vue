<template>
  <v-dialog v-model="showEditDialog" persistent max-width="1024">
    <v-card>
      <v-card-title class="headline">Editar Cita</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" :lazy-validation="lazy">
          <v-text-field v-model="citaClone.id_empleado" label="ID Empleado" required></v-text-field>
          <v-text-field v-model="citaClone.id_cabina" label="ID Cabina" required></v-text-field>
          <v-autocomplete
            label="Cliente"
            v-model="citaClone.id_cliente"
            :items="clienteOptions"
            item-text="nombre_cliente"
            item-value="id_cliente"
            return-object
          ></v-autocomplete>
          <v-text-field v-model="citaClone.id_sesion" label="ID Sesión" required></v-text-field>

          <!--  

          <v-select
            :items="['Programado', 'Realizado', 'Adeudo', 'Cita perdida','Reagendado', 'Cancelado']"
            label="Estado"
            v-model="citaClone.estado"
            required
          ></v-select>
            -->

            <v-text-field
            label="Fecha y hora"
            v-model="citaClone.fecha"
            type="datetime-local"
            required
          ></v-text-field>
          
         

        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="blue darken-1" text @click="close">Cerrar</v-btn>
        <v-btn color="blue darken-1" text @click="save">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref, onMounted, watch, computed } from "vue";
import { utcToZonedTime, format } from "date-fns-tz";
import apiService from "@/services/apiServices";
import store from "@/store";

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    cita: {
      type: Object,
      default: () => ({}),
      required: true,
    },
  },
  setup(props, { emit }) {
    const form = ref(null);
    const valid = ref(true);
    const lazy = ref(false);
    const clientes = ref([]);
    const idSpa = store.getters.idSpa;
    const citaClone = ref(JSON.parse(JSON.stringify(props.cita)));

    const showEditDialog = computed({
      get: () => props.value,
      set: (value) => emit("input", value),
    });

    onMounted(async () => {
      clientes.value = await apiService.getClientes({
        idSpa: idSpa,
      });
    });

    // Transforma ID a valor legible
    const clienteOptions = computed(() => {
      return clientes.value.map(
        (cliente) =>
          `${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}`
      );
    });

    watch(
      () => props.cita,
      (val) => {
        citaClone.value = JSON.parse(JSON.stringify(val));
      },
      { deep: true, immediate: true }
    );

    watch(
      () => citaClone.value.fecha,
      (val) => {
        if (val) {
          const fechaUTC = new Date(val);
          const fechaLocal = utcToZonedTime(fechaUTC, "America/Mexico_City");
          citaClone.value.fecha = format(fechaLocal, "yyyy-MM-dd'T'HH:mm");
        }
      },
      { deep: true, immediate: true }
    );

    const close = () => {
      emit("closeDialog");
    };

    const save = () => {
      if (form.value.validate()) {
        const fechaUTC = new Date(citaClone.value.fecha);
        const fechaLocal = utcToZonedTime(fechaUTC, "America/Mexico_City");
        citaClone.value.fecha = format(fechaLocal, "yyyy-MM-dd'T'HH:mm:ss.SSS");

        emit("update", citaClone.value);
        emit("closeDialog");
      }
   
    };

return {
  form,
  valid,
  lazy,
  citaClone,
  clienteOptions,
  showEditDialog,
  close,
  save,
};
},
};
</script>
