<template>
  <v-card class="mx-auto" style="max-width: 800px;">
    <v-toolbar color="teal" dark flat>
      <v-btn icon @click="$emit('close')">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-card-title class="text-h5 font-weight-regular justify-center">
        Agendar Cita
      </v-card-title>
    </v-toolbar>
    <v-form ref="form" v-model="isValid" class="pa-4 pt-6">
      <v-text-field
        label="Fecha y hora"
        v-model="cita.fecha"
        :rules="[rules.required]"
        variant="filled"
        color="teal"
        type="datetime-local"
        class="mb-4"
      ></v-text-field>
      <v-autocomplete
        label="Cliente"
        v-model="cita.id_cliente"
        :rules="[rules.required]"
        :items="clienteOptions"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-autocomplete>
      <v-autocomplete
        label="Cabina"
        v-model="cita.id_cabina"
        :rules="[rules.required]"
        :items="cabinaOptions"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-autocomplete>
      <v-autocomplete
        label="Paquete"
        v-model="cita.id_paquete"
        :rules="[rules.required]"
        :items="paqueteOptions"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-autocomplete>

      <v-select
        label="Estado"
        v-model="cita.estado"
        :rules="[rules.required]"
        :items="[
          'Cita programada',
          'Cita realizada',
          'Cita perdida',
          'Cita cancelada',
       // 'Reagendo cita',
          'Adeudo',
        ]"
        variant="filled"
        color="teal"
        class="mb-4"
      ></v-select>
    </v-form>
    <v-divider></v-divider>
    <v-card-actions class="px-4">
      <v-btn color="teal" text @click="clearFields">Limpiar campos</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        color="teal"
        text
        @click="onSubmit"
      >
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { utcToZonedTime, format } from "date-fns-tz";
import apiService from "@/services/apiServices";
import store from "@/store";

export default {
  props: ["showDialog"],
  setup(props, { emit }) {
    const cita = ref({
      id_empleado: store.getters.idEmpleado,
      id_cliente: "",
      id_cabina: "",
      id_sesion: 1,
      fecha: "",
      estado: "Cita programada",
      id_paquete: "",
    });

  //const empleados = ref([]);
    const cabinas = ref([]);
    const clientes = ref([]);
    const paquetes = ref([]);

//    watch(() => store.getters.idEmpleado, (newIdEmpleado) => {
//      cita.value.id_empleado = newIdEmpleado;
//    });

    const rules = {
      required: (value) => !!value || "Este campo es requerido",
    };

    const isValid = ref(true);

     onMounted(async () => {
//     empleados.value = await apiService.getEmpleados();
//      console.log("Empleados:", empleados.value);
      clientes.value = await apiService.getClientes();
      console.log("Clientes:", clientes.value);
      cabinas.value = await apiService.getCabinas();
      console.log("Cabinas:", cabinas.value);
      paquetes.value = await apiService.getPaquetes();
      console.log("Paquetes:", paquetes.value);
    });
/*
    const empleadoOptions = computed(() => {
      return empleados.value.map(
        (empleado) =>
          `${empleado.nombre_empleado} ${empleado.apellido_paterno} ${empleado.apellido_materno}`
      );
    });
*/
    const clienteOptions = computed(() => {
      return clientes.value.map(
        (cliente) =>
          `${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}`
      );
    });

    const cabinaOptions = computed(() => {
      return cabinas.value.map(
        (cabina) => `${cabina.numero_cabina} - Turno ${cabina.turno} - ${cabina.Empleado.nombre_empleado} ${cabina.Empleado.apellido_paterno} ${cabina.Empleado.apellido_materno}`
      );
    });

    const paqueteOptions = computed(() => {
      return paquetes.value.map((paquete) => `${paquete.nombre_paquete}`);
    });

    const onSubmit = () => {
    /*
      const empleadoSeleccionado = empleados.value.find(
        (e) =>
          `${e.nombre_empleado} ${e.apellido_paterno} ${e.apellido_materno}` ===
          cita.value.id_empleado
      );
      console.log("empleadoSeleccionado:", empleadoSeleccionado);
      cita.value.id_empleado = empleadoSeleccionado
        ? empleadoSeleccionado.id_empleado
        : "";
      console.log("cita.value.id_empleado:", cita.value.id_empleado);
*/
    
        const clienteSeleccionado = clientes.value.find(
        (c) =>
          `${c.nombre_cliente} ${c.apellido_paterno} ${c.apellido_materno}` ===
          cita.value.id_cliente
      );
      console.log("clienteSeleccionado:", clienteSeleccionado);
      cita.value.id_cliente = clienteSeleccionado
        ? clienteSeleccionado.id_cliente
        : "";

      const cabinaSeleccionada = cabinas.value.find(
        (c) => `${c.numero_cabina} - Turno ${c.turno} - ${c.Empleado.nombre_empleado} ${c.Empleado.apellido_paterno} ${c.Empleado.apellido_materno}` === cita.value.id_cabina
      );
      console.log("cabinaSeleccionada:", cabinaSeleccionada);
      cita.value.id_cabina = cabinaSeleccionada
        ? cabinaSeleccionada.id_cabina
        : "";
      console.log("cita.value.id_cabina:", cita.value.id_cabina);

      const paqueteSeleccionado = paquetes.value.find(
        (p) => `${p.nombre_paquete}` === cita.value.id_paquete
      );
      console.log("paqueteSeleccionado:", paqueteSeleccionado);
      cita.value.id_paquete = paqueteSeleccionado
        ? paqueteSeleccionado.id_paquete
        : "";

      // Convierte la fecha y la hora de la zona horaria de México a la hora local
      const fechaUTC = new Date(cita.value.fecha);
      console.log("fechaUTC:", fechaUTC);
      const fechaLocal = utcToZonedTime(fechaUTC, "America/Mexico_City");
      console.log("fechaLocal:", fechaLocal);

      // Formatea la fecha y la hora a ISO y las guarda en la cita
      cita.value.fecha = format(fechaLocal, "yyyy-MM-dd'T'HH:mm:ss.SSS");

      emit("addCita", cita.value);
      emit("close");
      console.log("Fecha enviada:", cita.value.fecha);
      
    };

    const clearFields = () => {
      cita.value = {
        id_cliente: "",
        id_cabina: "",
        fecha: "",
        estado: "Cita programada",
        id_paquete: "",
      };
    };

    return {
      cita,
//      empleados,
      cabinas,
      onSubmit,
//    empleadoOptions,
      clienteOptions,
      cabinaOptions,
      paqueteOptions,
      rules,
      isValid,
      clearFields,
    };
  },
};
</script>

<style>
.dialog {
  /* Estilos para el diálogo de creación de citas */
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
