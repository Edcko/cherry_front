<template>
  <!--  <v-container v-if="user" fluid> -->
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
    <v-col cols="12" md="3" v-for="numeroCabina in 4" :key="'cabina-' + numeroCabina">
      <v-divider :key="'divider-' + numeroCabina"></v-divider>
      <h3 class="text-center mt-4">{{ numeroCabina !== 4 ? 'Cabina ' + numeroCabina : 'Depilación' }}</h3>
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
  v-for="hora in getHorasLibres(getCitasByCabina(numeroCabina), numeroCabina)"
  :key="hora"
  :hora="hora"
  @agendar="handleAgendarHoraLibre"
/>


    
    </v-col>
  </v-row>

   
  </div>
<!-- </v-container> -->

<!--
<v-container v-else fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="teal"
          size="70"
        ></v-progress-circular>
      </v-row>
    </v-container>

  -->

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
import { getCurrentInstance } from 'vue';

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


    const {
      citas,
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

    const {user, loadUser} = useUser();

    onMounted(async () => {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const lastDayOfSecondNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0);

    const format = (date) => date.toISOString().split('T')[0];


      try {

        citas.value = await apiService.getCitas({
            startDate: format(firstDayOfMonth),
            endDate: format(lastDayOfSecondNextMonth)
        });

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
  // Aquí puedes abrir el diálogo de agendar cita con la fecha y hora ya preseleccionadas
  // Por ejemplo:
  showDialog.value = true;
  // Asegúrate de pasar la fecha y hora al diálogo para que se preseleccione
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

    return {
      citas,
      addCita,
      deleteCita,
      updateCita,
      formatDate,
      showDialog,
      changeEstado: changeEstadoWrapper,
      editCita,
      showEditDialog,
      currentCita,
      updateCitaFromForm,
      search,
      dateFilter,
      clientIdFilter,
      filteredCitas,
      countCitasForDateColor,
      handleDeleteCita,
      handleAgendarHoraLibre,
      getCitasByCabina,
      user,
      newDateFilter,
      getHorasLibres,
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

.custom-button {
    background-color: white;
    color: teal;
}
</style>
