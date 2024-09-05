<template>
  <v-container v-if="user" fluid>
    <h1>Calendario de Citas</h1>
    <div>
      <cita-calendar
        :citas="citas"
        @citaClicked="handleCitaClicked"
        @dayClicked="handleDayClicked"
      />

      <div class="d-flex justify-center mb-5 mt-5">
        <v-row justify="center">
          <v-dialog v-model="showDialog" persistent width="1024">
            <template v-slot:activator="{ props }">
              <v-btn
                class="custom-button"
                elevation="8"
                rounded
                :large="true"
                v-bind="props"
              >
                Agendar Cita
              </v-btn>
            </template>
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
      addCita,
      updateCita,
      deleteCita,
      countCitasForDateColor,
      changeEstado,
      getHorasLibres,
    } = useCitas();

    const { filteredCitas, getCitasByCabina } = useCitasFilter(
      citas,
      search,
      dateFilter,
      clientIdFilter,
      newDateFilter
    );

    const { user, loadUser } = useUser();

    // Definir las cabinas basadas en idSpa
    const cabinas = ref([]);
    if (idSpa === 1) {
      cabinas.value = [1, 2, 4];
    } else {
      cabinas.value = [1, 2, 4];
    }

    onMounted(async () => {
      const currentDate = new Date();
      selectedDate.value = currentDate; // Asigna la fecha actual como la predeterminada
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
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const format = (date) => date.toISOString().split("T")[0];

      console.log("Fecha de hoy", format(today));
      console.log("Fecha de maniana", format(tomorrow));
      console.log("Fecha de inicio del mes", format(firstDayOfMonth));

      try {
        citas.value = await apiService.getCitas({
          idSpa: idSpa,
          startDate: format(firstDayOfMonth),
          endDate: format(lastDayOfSecondNextMonth),
        });

        console.log("Citas", citas.value);

        citasTodayTomorrow.value = await apiService.getCitas({
          idSpa: idSpa,
          startDate: format(today),
          endDate: format(tomorrow),
        });

        console.log("Citas hoy y maniana", citasTodayTomorrow.value);

        await loadUser();
      } catch (error) {
        console.error(error);
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
      formatDate,
      changeEstado: changeEstadoWrapper,
      editCita,
      updateCitaFromForm,
      countCitasForDateColor,
      handleDeleteCita,
      handleAgendarHoraLibre,
      getCitasByCabina,
      getHorasLibres,
      cabinas, // agregar cabinas al return
      handleDayClicked,
      selectedDate,
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
  background-color: white;
  color: teal;
}
</style>