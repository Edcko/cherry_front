<template>
  <v-container fluid>
    <!-- Si el usuario ya se cargó -->
    <template v-if="user">
      <h1 class="text-center mb-4">Calendario de Citas</h1>

      <div v-if="isDeveloper" class="d-flex justify-center mb-4">
        <v-btn color="teal" dark @click="toggleAgendaEstado">
          {{ estadoAgenda ? "Cerrar Agenda" : "Abrir Agenda" }}
        </v-btn>
      </div>

      <div v-if="isDeveloper" class="d-flex flex-column align-center mb-4">
        <v-date-picker
          v-model="nuevaFechaApertura"
          label="Selecciona la nueva fecha de apertura"
          :min="minDate"
        />
        <v-btn color="primary" class="mt-2" @click="actualizarFechaApertura">
          Actualizar Fecha de Apertura
        </v-btn>
      </div>

      <div>
        <cita-calendar
          :citas="citas"
          :citasCount="citasCountByDate"
          @citaClicked="handleCitaClicked"
          @dayClicked="handleDayClicked"
        />

        <!-- Diálogo para agregar/editar citas -->
        <div class="d-flex justify-center my-5">
          <v-row justify="center">
            <v-dialog v-model="showDialog" persistent width="1024">
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

        <!-- Filtros -->
        <cita-filter
          @searchChange="search = $event"
          @dateFilterChange="dateFilter = $event"
          @clientIdFilterChange="clientIdFilter = $event"
          @newDateFilterChange="newDateFilter = $event"
        />

        <!-- Renderizado de citas por cabina -->
        <v-row>
          <v-col
            v-for="numeroCabina in cabinas"
            :key="'cabina-' + numeroCabina"
            cols="6"
            sm="6"
            md="4"
            lg="4"
          >
            <v-divider :key="'divider-' + numeroCabina" />
            <h3 class="text-center mt-4">
              {{ numeroCabina !== 4 ? "Cabina " + numeroCabina : "Depilación" }}
            </h3>
            <v-container fluid>
              <cita-card
                v-for="cita in getCitasByCabina(numeroCabina)"
                :key="cita.id_cita"
                class="custom-card mt-2"
                :cita="cita"
                @updateCita="updateCita"
                @deleteCita="handleDeleteCita"
                @updateEstado="updateCita"
              />
            </v-container>
            <hora-libre-card
              v-for="hora in getHorasLibres(getCitasByCabina(numeroCabina), numeroCabina)"
              :key="hora"
              :hora="hora"
              @agendar="handleAgendarHoraLibre"
            />
          </v-col>
        </v-row>
      </div>
    </template>

    <!-- Estado de carga -->
    <v-container v-else fluid class="full-height">
      <v-row align="center" justify="center">
        <v-progress-circular indeterminate color="teal" size="70" />
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { onMounted, ref, computed, getCurrentInstance, watch } from "vue";
import apiService from "@/services/apiServices";
import CitaDialog from "@/components/CitaDialog.vue";
import CitaFilter from "./CitaFilter.vue";
import CitaCalendar from "./CitaCalendar.vue";
import useCitas from "@/composables/useCitas";
import useUser from "@/composables/useUser";
import { formatDate } from "@/utils/dateUtils";
import useCitasFilter from "@/composables/useCitasFilter";
import CitaCard from "./CitaCard.vue";
import HoraLibreCard from "./HoraLibreCard.vue";
import store from "@/store";

export default {
  name: "CitasComponent",
  components: {
    CitaDialog,
    CitaFilter,
    CitaCalendar,
    CitaCard,
    HoraLibreCard,
  },
  setup() {
    const { appContext } = getCurrentInstance();

    // Estados y refs
    const showDialog = ref(false);
    const search = ref("");
    const dateFilter = ref(null);
    const clientIdFilter = ref("");
    const newDateFilter = ref(null);
    const selectedDate = ref(new Date());
    const nuevaFechaApertura = ref(null);
    const horaPreseleccionada = ref(null);

    // Configuración de cabinas
    const cabinas = ref([1, 2, 4]);

    // Composables
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
      changeEstado,
      getHorasLibres,
      getCitasCountByDate,
      toggleAgendaEstado,
      updateFechaApertura,
    } = useCitas();

    // Utilizamos el composable de filtrado
    const { filteredCitas, getCitasByCabina: getCitasByCabinaFilter } = useCitasFilter(
      citas,
      search,
      dateFilter,
      clientIdFilter,
      newDateFilter
    );

    const { user, loadUser } = useUser();

    // Rol de desarrollador
    const isDeveloper = computed(
      () => user.value && user.value.tipo_empleado === "Desarrollador"
    );

    const minDate = new Date().toISOString().split("T")[0];

    // Función para cargar el conteo de citas por fecha
    const loadCitasCountByDate = async () => {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      const format = (date) => date.toISOString().split("T")[0];

      try {
        await getCitasCountByDate(
          store.getters.idSpa,
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
      selectedDate.value = currentDate;

      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      );
      const lastDayOfSecondNextMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 3,
        0
      );
      const today = currentDate;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const format = (date) => date.toISOString().split("T")[0];

      try {
        const [allCitas, todayTomorrowCitas] = await Promise.all([
          apiService.getCitas({
            idSpa: store.getters.idSpa,
            startDate: format(firstDayOfMonth),
            endDate: format(lastDayOfSecondNextMonth),
          }),
          apiService.getCitas({
            idSpa: store.getters.idSpa,
            startDate: format(today),
            endDate: format(tomorrow),
          }),
        ]);

        citas.value = allCitas;
        citasTodayTomorrow.value = todayTomorrowCitas;

        await Promise.all([
          fecthEstadoAgenda(),
          fetchFechaApertura(),
          loadCitasCountByDate(),
          loadUser(),
        ]);
      } catch (error) {
        console.error("Error en onMounted:", error);
        appContext.config.globalProperties.$showAlert(
          "Error al cargar las citas. Por favor, inténtalo de nuevo.",
          "error"
        );
      }
    });

    // Watcher para actualizar el conteo de citas cuando cambie el arreglo de citas
    watch(
      citas,
      async () => {
        await loadCitasCountByDate();
      },
      { deep: true }
    );

    const actualizarFechaApertura = async () => {
      if (!nuevaFechaApertura.value) {
        appContext.config.globalProperties.$showAlert(
          "Por favor, selecciona una fecha válida.",
          "error"
        );
        return;
      }

      try {
        await updateFechaApertura(nuevaFechaApertura.value);
        appContext.config.globalProperties.$showAlert(
          "Fecha de apertura actualizada correctamente.",
          "success"
        );
      } catch (error) {
        appContext.config.globalProperties.$showAlert(
          "Error al actualizar la fecha de apertura.",
          "error"
        );
        console.error(error);
      }
    };

    const handleDeleteCita = async (cita) => {
      try {
        await deleteCita(cita);
        const index = citas.value.findIndex(
          (c) => c.id_cita === cita.id_cita
        );
        if (index !== -1) {
          citas.value.splice(index, 1);
        }
      } catch (error) {
        appContext.config.globalProperties.$showAlert(
          "Ha ocurrido un error al eliminar la cita.",
          "error"
        );
        console.error(error);
      }
    };

    const handleAgendarHoraLibre = (hora) => {
      if (selectedDate.value) {
        const [horas, minutos] = hora.split(":");
        const fechaConHora = new Date(selectedDate.value);
        fechaConHora.setHours(parseInt(horas, 10), parseInt(minutos, 10), 0);

        const fechaFormatoLocal = `${fechaConHora.getFullYear()}-${(fechaConHora.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${fechaConHora
          .getDate()
          .toString()
          .padStart(2, "0")}T${horas}:${minutos}`;

        horaPreseleccionada.value = fechaFormatoLocal;
        showDialog.value = true;
      } else {
        console.warn("No se ha seleccionado una fecha en el calendario.");
      }
    };

    const changeEstadoWrapper = async (cita) => {
      const estadoPrevio = cita.estado;
      cita.estado = !estadoPrevio;
      try {
        await changeEstado(cita);
      } catch (error) {
        cita.estado = estadoPrevio;
        appContext.config.globalProperties.$showAlert(
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
      getCitasByCabina: getCitasByCabinaFilter,
      getHorasLibres,
      cabinas,
      handleDeleteCita,
      handleAgendarHoraLibre,
      toggleAgendaEstado,
      handleDayClicked,
      selectedDate,
      citasCountByDate,
      actualizarFechaApertura,
      nuevaFechaApertura,
      isDeveloper,
      minDate,
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
