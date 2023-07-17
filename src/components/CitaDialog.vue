<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">Agendar Cita</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-autocomplete
              label="Empleado"
              v-model="cita.id_empleado"
              :items="empleadoOptions"
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-autocomplete
              label="Cliente"
              v-model="cita.id_cliente"
              :items="clienteOptions"
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-autocomplete
              label="Cabina"
              v-model="cita.id_cabina"
              :items="cabinaOptions"
              required
            ></v-autocomplete>
          </v-col>
  <!--        <v-col cols="12" sm="6" md="4">
            <v-text-field
              label="Sesión"
              v-model="cita.id_sesion"
              required
            ></v-text-field>
          </v-col>

 -->         
          <v-col cols="12" sm="6" md="4">
            <v-select
              :items="[
                'Programado',
                'Realizado',
                'Adeudo',
                'Cita perdida',
                'Reagendado',
                'Cancelado',
              ]"
              label="Estado"
              v-model="cita.estado"
              required
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-autocomplete
              label="Paquete"
              v-model="cita.id_paquete"
              :items="paqueteOptions"
              required
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Fecha y hora"
              v-model="cita.fecha"
              type="datetime-local"
              required
            ></v-text-field>
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
import { utcToZonedTime, format } from "date-fns-tz";
import apiService from "@/services/apiServices";

export default {
  props: ["showDialog"],
  setup(props, { emit }) {
    const cita = ref({
      id_empleado: "",
      id_cliente: "",
      id_cabina: "",
      id_sesion: "1",
      fecha: "",
      estado: "Programado",
      id_paquete: "",
    });

    const empleados = ref([]);
    const cabinas = ref([]);
    const clientes = ref([]);
    const paquetes = ref([]);

    onMounted(async () => {
      empleados.value = await apiService.getEmpleados();
      console.log("Empleados:", empleados.value);
      clientes.value = await apiService.getClientes();
      console.log("Clientes:", clientes.value);
      cabinas.value = await apiService.getCabinas();
      console.log("Cabinas:", cabinas.value);
      paquetes.value = await apiService.getPaquetes();
      console.log("Paquetes:", paquetes.value);
    });

    const empleadoOptions = computed(() => {
      return empleados.value.map(
        (empleado) =>
          `${empleado.nombre_empleado} ${empleado.apellido_paterno} ${empleado.apellido_materno}`
      );
    });

    const clienteOptions = computed(() => {
      return clientes.value.map(
        (cliente) =>
          `${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}`
      );
    });

    const cabinaOptions = computed(() => {
      return cabinas.value.map(
        (cabina) => `${cabina.numero_cabina} ${cabina.turno}`
      );
    });

    const paqueteOptions = computed(() => {
      return paquetes.value.map((paquete) => `${paquete.nombre_paquete}`);
    });

    const onSubmit = () => {
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
        (c) => `${c.numero_cabina} ${c.turno}` === cita.value.id_cabina
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

    return {
      cita,
      empleados,
      cabinas,
      onSubmit,
      empleadoOptions,
      clienteOptions,
      cabinaOptions,
      paqueteOptions,
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
