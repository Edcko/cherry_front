<template>
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
              color="white"
              elevation="8"
              rounded
              :large="true"
              class="mx-auto"
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
    />

    <v-row>
  <v-col cols="12" md="3" v-for="numeroCabina in 4" :key="'cabina-' + numeroCabina">
    <v-divider :key="'divider-' + numeroCabina"></v-divider>
    <h3 class="text-center">Cabina {{ numeroCabina }}</h3>
    <cita-card
      class="custom-card"
      v-for="cita in getCitasByCabina(numeroCabina)"
      :key="cita.id_cita"
      :cita="cita"
      @updateCita="updateCita"
      @deleteCita="handleDeleteCita"
      @updateEstado="updateCita"
    />
  </v-col>
</v-row>

  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import apiService from "@/services/apiServices";
import CitaDialog from "@/components/CitaDialog.vue";
import CitaFilter from "./CitaFilter.vue";
import CitaCalendar from "./CitaCalendar.vue";
import useCitas from "@/composables/useCitas";
import { formatDate } from "@/utils/dateUtils";
import useCitasFilter from "@/composables/useCitasFilter";
import CitaCard from "./CitaCard.vue";
import { getCurrentInstance } from 'vue';

export default {
  name: "CitasComponent",
  components: {
    CitaDialog,
    CitaFilter,
    CitaCalendar,
    CitaCard,
  },
  setup() {
    const showDialog = ref(false);
    const showEditDialog = ref(false);
    const currentCita = ref({});
    const search = ref("");
    const dateFilter = ref(null);
    const clientIdFilter = ref("");
    const app = getCurrentInstance();


    const {
      citas,
      addCita,
      updateCita,
      deleteCita,
      countCitasForDateColor,
      changeEstado,
    } = useCitas();

    const { filteredCitas, getCitasByCabina } = useCitasFilter(
      citas,
      search,
      dateFilter,
      clientIdFilter
    );

    onMounted(async () => {
      try {
        citas.value = await apiService.getCitas();
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
      getCitasByCabina,
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
</style>
