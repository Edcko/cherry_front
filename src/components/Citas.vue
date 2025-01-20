<template>
  <v-container v-if="user" fluid>
    <h1>Calendario de Citas</h1>
    <div v-if="user.tipo_empleado === 'Administrador'" class="d-flex justify-center mb-4">
      <v-btn
  color="teal"
  dark
  @click="toggleAgendaEstado"
>
  {{ estadoAgenda ? "Cerrar Agenda" : "Abrir Agenda" }}
</v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn color="primary" dark v-bind="attrs" v-on="on">
            Modificar Fecha Apertura
          </v-btn>
        </template>
        <v-date-picker v-model="fechaApertura" @input="updateFechaApertura" />
      </v-menu>
    </div>


    <div>
      <cita-calendar
        :citas="citas"
        :citasCount="citasCountByDate"
        @citaClicked="handleCitaClicked"
        @dayClicked="handleDayClicked"
      />

      <div class="d-flex justify-center mb-5 mt-5">
        <v-row justify="center">
          <v-dialog v-model="showDialog" persistent width="1024">
            <!--<template v-slot:activator="{ props }">
              <v-btn
                class="custom-button"
                elevation="8"
                rounded
                :large="true"
                v-bind="props"
              >
                Agendar Cita
              </v-btn>
            </template>-->
            <cita-dialog
              :showDialog="showDialog"
              :horaPreseleccionada="horaPreseleccionada"
              @close="showDialog = false"
              @addCita="addCita"
              @updateCita="updateCita"
            />
          </v-dialog>
        </v-row>
      </div>

      <cita-filter
        @searchChange="search = $event"
        @dateFilterChange="dateFilter = $event"
        @clientIdFilterChange="clientIdFilter = $event"
        @newDateFilterChange="newDateFilter = $event"
      />

      <v-row>
        <v-col
        cols="6"
        sm="6"
        md="4"
        lg="4"

        
          v-for="numeroCabina in cabinas"
          :key="'cabina-' + numeroCabina"
        >
          <v-divider :key="'divider-' + numeroCabina"></v-divider>
          <h3 class="text-center mt-4">
            {{ numeroCabina !== 4 ? "Cabina " + numeroCabina : "Depilación" }}
          </h3>
          <v-container v-if="user" fluid>
            <cita-card
              class="custom-card mt-2"
              v-for="cita in getCitasByCabina(numeroCabina)"
              :key="cita.id_cita"
              :cita="cita"
              @updateCita="updateCita"
              @deleteCita="handleDeleteCita"
              @updateEstado="updateCita"
            />
          </v-container>

          <v-container v-else fluid class="fill-height">
            <v-row align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="teal"
                size="70"
              ></v-progress-circular>
            </v-row>
          </v-container>

          <hora-libre-card
            v-for="hora in getHorasLibres(
              getCitasByCabina(numeroCabina),
              numeroCabina
            )"
            :key="hora"
            :hora="hora"
            @agendar="handleAgendarHoraLibre"
          />
        </v-col>
      </v-row>
    </div>
  </v-container>

  <v-container v-else fluid class="full-height">
    <v-row align="center" justify="center">
      <v-progress-circular
        indeterminate
        color="teal"
        size="70"
      ></v-progress-circular>
    </v-row>
  </v-container>
</template>

<script>
import { onMounted, ref } from "vue";
import apiService from "@/services/apiServices";
import CitaDialog from "@/components/CitaDialog.vue";
import CitaFilter from "./CitaFilter.vue";
import CitaCalendar from "./CitaCalendar.vue";
import useCitas from "@/composables/useCitas";
import useUser from "@/composables/useUser";
import { formatDate } from "@/utils/dateUtils";
import useCitasFilter from "@/composables/useCitasFilter";
import CitaCard from "./CitaCard.vue";
//import ValoracionCard from "./ValoracionCard.vue";
import HoraLibreCard from "./HoraLibreCard.vue";
import store from "@/store";
import { getCurrentInstance } from "vue";

export default {
  name: "CitasComponent",
  components: {
    CitaDialog,
    CitaFilter,
    CitaCalendar,
    CitaCard,
    //    ValoracionCard,
    HoraLibreCard,
  },
  setup() {
    const showDialog = ref(false);
    const showEditDialog = ref(false);
    const currentCita = ref({});
    const search = ref("");
    const dateFilter = ref(null);
    const clientIdFilter = ref("");
    const app = getCurrentInstance();
    const newDateFilter = ref(null);
    const selectedDate = ref(null);

    const horaPreseleccionada = ref(null);

    const idSpa = store.getters.idSpa;

    const {
      citas,
      citasTodayTomorrow,
      estadoAgenda,
      fechaApertura,
      fetchFechaApertura,
      fecthEstadoAgenda,
      citasCountByDate,
      addCita,
      updateCita,
      deleteCita,
      countCitasForDateColor,
      changeEstado,
      getHorasLibres,
      getCitasCountByDate,
      toggleAgendaEstado,
      updateFechaApertura,
    } = useCitas();

    const { filteredCitas, getCitasByCabina } = useCitasFilter(
      citas,
      search,
      dateFilter,
      clientIdFilter,
      newDateFilter,
    );

    const { user, loadUser } = useUser();

    // Definir las cabinas basadas en idSpa
    const cabinas = ref([]);
    if (idSpa === 1) {
      cabinas.value = [1, 2, 4];
    } else {
      cabinas.value = [1, 2, 4];
    }

  const loadCitasCountByDate = async () => {
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const format = (date) => date.toISOString().split("T")[0];

  try {
    // Lógica del conteo de citas por fecha
    await getCitasCountByDate(
      idSpa,
      format(firstDayOfMonth),
      format(lastDayOfMonth)
    );
    console.log("Conteo de citas cargado exitosamente.");
  } catch (error) {
    console.error("Error al cargar el conteo de citas:", error);
  }
};



onMounted(async () => {
  const currentDate = new Date();
  selectedDate.value = currentDate; // Asigna la fecha actual como la predeterminada

  // Definir las fechas necesarias
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const lastDayOfSecondNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0);
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const format = (date) => date.toISOString().split("T")[0];

  console.log("Fecha de hoy", format(today));
  console.log("Fecha de mañana", format(tomorrow));
  console.log("Fecha de inicio del mes", format(firstDayOfMonth));

  try {
    // Ejecutar las llamadas a la API en paralelo
    const [allCitas, todayTomorrowCitas] = await Promise.all([
      // Cargar todas las citas del rango extendido
      apiService.getCitas({
        idSpa: idSpa,
        startDate: format(firstDayOfMonth),
        endDate: format(lastDayOfSecondNextMonth),
      }),
      // Cargar las citas de hoy y mañana
      apiService.getCitas({
        idSpa: idSpa,
        startDate: format(today),
        endDate: format(tomorrow),
      }),
    ]);

    // Asignar las respuestas
    citas.value = allCitas;
    citasTodayTomorrow.value = todayTomorrowCitas;

    console.log("Citas", citas.value);
    console.log("Citas hoy y mañana", citasTodayTomorrow.value);

    // Ejecutar las tareas restantes en paralelo
    await Promise.all([
    fecthEstadoAgenda(), // Cargar el estado de la agenda
      fetchFechaApertura(), // Cargar la fecha de apertura
      loadCitasCountByDate(), // Cargar conteo de citas
      loadUser(), // Cargar el usuario
    ]);

    console.log("Carga completada exitosamente.");
    console.log("Estado inicial de la agenda:", estadoAgenda.value);
    console.log("Fecha inicial de apertura", fechaApertura.value);
console.log("Nuevo estado después de actualizar:", estadoAgenda.value);

  } catch (error) {
    console.error("Error en onMounted:", error);
    this.$showAlert(
      "Error al cargar las citas. Por favor, inténtalo de nuevo.",
      "error"
    );
  }
});


    const editCita = (cita) => {
      currentCita.value = cita;
      showEditDialog.value = true;
    };

    const updateCitaFromForm = async (cita) => {
      const index = citas.value.findIndex((c) => c.id_cita === cita.id_cita);
      if (index !== -1) {
        // Primero actualiza la cita en la lista de citas
        citas.value[index] = cita;

        try {
          await apiService.updateCita(cita);
        } catch (error) {
          app.appContext.config.globalProperties.$showAlert(
            "Ha ocurrido un error al actualizar la cita.",
            "error"
          );
          console.error(error);
        }
      }
    };

    const handleDeleteCita = async (cita) => {
      try {
        await deleteCita(cita);
        const index = citas.value.findIndex((c) => c.id_cita === cita.id_cita);
        if (index !== -1) {
          citas.value.splice(index, 1);
        }
      } catch (error) {
        this.$showAlert("Ha ocurrido un error al eliminar la cita.", "error");
        console.error(error);
      }
    };

    // eslint-disable-next-line
    const handleAgendarHoraLibre = (hora) => {

  if (selectedDate.value) {
    const [horas, minutos] = hora.split(':');
    const fechaConHora = new Date(selectedDate.value);
    fechaConHora.setHours(parseInt(horas, 10), parseInt(minutos, 10), 0);

    const fechaFormatoLocal = `${fechaConHora.getFullYear()}-${(fechaConHora.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${fechaConHora.getDate().toString().padStart(2, '0')}T${horas}:${minutos}`;
    
    horaPreseleccionada.value = fechaFormatoLocal;
    showDialog.value = true;
  } else {
    console.warn("No se ha seleccionado una fecha en el calendario.");
  }
};

    const changeEstadoWrapper = async (cita) => {
      try {
        await changeEstado(cita);
      } catch (error) {
        this.$showAlert(
          "Ha ocurrido un error al cambiar el estado de la cita.",
          "error"
        );
        console.error(error);
      }
    };

    const handleDayClicked = (day) => {
      console.log("Day received in Citas.vue:", day);
      selectedDate.value = day.date;
      newDateFilter.value = day.date;
    };

    return {
      citas,
      citasTodayTomorrow,
      showDialog,
      estadoAgenda,
      fechaApertura,
      horaPreseleccionada,
      showEditDialog,
      currentCita,
      search,
      dateFilter,
      clientIdFilter,
      filteredCitas,
      user,
      newDateFilter,
      addCita,
      deleteCita,
      updateCita,
      updateFechaApertura,
      formatDate,
      changeEstado: changeEstadoWrapper,
      editCita,
      updateCitaFromForm,
      countCitasForDateColor,
      handleDeleteCita,
      handleAgendarHoraLibre,
      toggleAgendaEstado,
      getCitasByCabina,
      getHorasLibres,
      cabinas, // agregar cabinas al return
      handleDayClicked,
      selectedDate,
      citasCountByDate
    };
  },
};
</script>

<style>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

h1 {
  text-align: center;
  margin-bottom: 1rem;
}

.custom-button {
  color: teal;
}
</style>