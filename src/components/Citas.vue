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
        <!-- Se pasa el arreglo combinado (eventos de citas, bloqueos y horas libres) al calendario -->
        <cita-calendar
          :citas="eventosCombinadosLocal"
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

        <!-- Diálogo para cerrar cabina -->
        <v-dialog v-model="showCerrarCabinaDialog" persistent width="400">
          <cerrar-cabina-dialog
            :cabina="cabinaParaCerrar"
            :showDialog="showCerrarCabinaDialog"
            :horaPreseleccionada="horaPreseleccionada"
            @cerrarCabina="cerrarCabina"
            @close="showCerrarCabinaDialog = false"
          />
        </v-dialog>

        <!-- Filtros -->
        <cita-filter
          @searchChange="search = $event"
          @dateFilterChange="dateFilter = $event"
          @clientIdFilterChange="clientIdFilter = $event"
          @newDateFilterChange="newDateFilter = $event"
        />

        <!-- Renderizado de eventos por cabina (citas, bloqueos y horas libres combinados) -->
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
              <div
                v-for="evento in getEventosPorCabina(numeroCabina)"
                :key="evento.tipo === 'cita'
                  ? `cita-${evento.id_cita}`
                  : evento.tipo === 'bloqueo'
                    ? `bloqueo-${evento.id_bloqueo}`
                    : `libre-${evento.horaStr}`"
              >
                <cita-card
                  v-if="evento.tipo === 'cita'"
                  :cita="evento"
                  class="custom-card mt-2"
                  @updateCita="updateCita"
                  @deleteCita="handleDeleteCita"
                  @updateEstado="updateCita"
                />
                <hora-bloqueada-card
                  v-else-if="evento.tipo === 'bloqueo'"
                  :hora="formatHora(evento.hora)"
                  :motivoBloqueo="evento.motivo"
                />
                <hora-libre-card
                  v-else
                  :hora="evento.horaStr"
                  @agendar="handleAgendarHoraLibre"
                  @cerrarCabina="handleCerrarCabina"
                />
              </div>
            </v-container>
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
import CitaDialog from "@/components/CitaDialog.vue";
import CitaFilter from "./CitaFilter.vue";
import CitaCalendar from "./CitaCalendar.vue";
import useCitas from "@/composables/useCitas";
import useUser from "@/composables/useUser";
import useCitasFilter from "@/composables/useCitasFilter";
import CitaCard from "./CitaCard.vue";
import HoraLibreCard from "./HoraLibreCard.vue";
import HoraBloqueadaCard from "./HoraBloqueadaCard.vue";
import useBloqueoCabina from "@/composables/useBloqueoCabina";
import CerrarCabinaDialog from "@/components/CerrarCabinaDialog.vue";
import apiService from "@/services/apiServices";
import store from "@/store";

export default {
  name: "CitasComponent",
  components: {
    CitaDialog,
    CitaFilter,
    CitaCalendar,
    CitaCard,
    HoraLibreCard,
    HoraBloqueadaCard,
    CerrarCabinaDialog,
  },
  setup() {
    const { appContext } = getCurrentInstance();
    const showDialog = ref(false);
    const showCerrarCabinaDialog = ref(false);
    const search = ref("");
    const dateFilter = ref(null);
    const clientIdFilter = ref("");
    const newDateFilter = ref(null);
    const selectedDate = ref(new Date());
    const nuevaFechaApertura = ref(null);
    const horaPreseleccionada = ref(null);
    const cabinas = ref([1, 2, 4]);

    // Composables de citas y usuario
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

    // Composable de filtrado
    const { filteredCitas, getCitasByCabina: getCitasByCabinaFilter } = useCitasFilter(
      citas,
      search,
      dateFilter,
      clientIdFilter,
      newDateFilter
    );

    const { user, loadUser } = useUser();
    const isDeveloper = computed(
      () => user.value && user.value.tipo_empleado === "Desarrollador"
    );
    const minDate = new Date().toISOString().split("T")[0];

    // Composable de bloqueos
    const { bloqueos, fetchBloqueos, fetchBloqueosByDateRange } = useBloqueoCabina();

    // Ref para la cabina a cerrar
    const cabinaParaCerrar = ref(null);

    // Formateo de hora
    const formatHora = (fechaBloqueo) => {
      const date = new Date(fechaBloqueo);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const getCitasByCabina = (numeroCabina) => {
      return getCitasByCabinaFilter(numeroCabina) || [];
    };

    // COMBINACIÓN DE EVENTOS: excluye horas bloqueadas de las libres
    const getEventosPorCabina = (numeroCabina) => {
      // 1) Citas: mutar en sitio para reactividad
      const citasCabina = getCitasByCabina(numeroCabina).map((cita) => {
        if (cita.tipo !== "cita") {
          cita.tipo = "cita";
          cita.fechaEvento = cita.fecha;
          cita.hora = new Date(cita.fecha);
        }
        return cita;
      });

      // 2) Bloqueos: mutar en sitio
      const bloqueosCabina = bloqueos.value
        .filter((bloqueo) => {
          const d = new Date(bloqueo.fecha_bloqueo);
          const sel = new Date(selectedDate.value);
          return (
            bloqueo.Cabina.numero_cabina === numeroCabina &&
            d.getFullYear() === sel.getFullYear() &&
            d.getMonth() === sel.getMonth() &&
            d.getDate() === sel.getDate()
          );
        })
        .map((bloqueo) => {
          if (bloqueo.tipo !== "bloqueo") {
            bloqueo.tipo = "bloqueo";
            bloqueo.fechaEvento = bloqueo.fecha_bloqueo;
            bloqueo.hora = new Date(bloqueo.fecha_bloqueo);
          }
          return bloqueo;
        });

      // 3) Calcular horas libres excluyendo bloqueos:
      const todasHorasLibres = getHorasLibres(getCitasByCabina(numeroCabina), numeroCabina);
      // obtener strings bloqueados "HH:MM"
      const bloqueadasStr = bloqueosCabina.map(b => {
        const hrs = String(b.hora.getHours()).padStart(2, "0");
        const mins = String(b.hora.getMinutes()).padStart(2, "0");
        return `${hrs}:${mins}`;
      });
      const horasLibres = todasHorasLibres
        .filter(hs => !bloqueadasStr.includes(hs))
        .map((horaStr) => {
          const [hrs, mins] = horaStr.split(":");
          const freeDate = new Date(selectedDate.value);
          freeDate.setHours(parseInt(hrs, 10), parseInt(mins, 10), 0, 0);
          return { tipo: "libre", hora: freeDate, horaStr };
        });

      // 4) Combinar y ordenar por Date
      const eventos = [...citasCabina, ...bloqueosCabina, ...horasLibres];
      eventos.sort((a, b) => a.hora - b.hora);
      return eventos;
    };

    // Para el calendario: eventos de la primera cabina
    const eventosCombinadosLocal = computed(() => {
      return getEventosPorCabina(cabinas.value[0]) || [];
    });

    const loadCitasCountByDate = async () => {
      const now = new Date();
      const f = (d) => d.toISOString().split("T")[0];
      await getCitasCountByDate(
        store.getters.idSpa,
        f(new Date(now.getFullYear(), now.getMonth(), 1)),
        f(new Date(now.getFullYear(), now.getMonth() + 1, 0))
      );
    };

    onMounted(async () => {
      const now = new Date();
      selectedDate.value = now;
      const f = (d) => d.toISOString().split("T")[0];
      try {
        const [allC, todayT] = await Promise.all([
          apiService.getCitas({
            idSpa: store.getters.idSpa,
            startDate: f(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
            endDate: f(new Date(now.getFullYear(), now.getMonth() + 3, 0)),
          }),
          apiService.getCitas({
            idSpa: store.getters.idSpa,
            startDate: f(now),
            endDate: f(new Date(now.getTime() + 86400000)),
          }),
        ]);
        citas.value = allC;
        citasTodayTomorrow.value = todayT;
        await fetchBloqueosByDateRange(
          f(new Date(now.getFullYear(), now.getMonth() - 1, 1)),
          f(new Date(now.getFullYear(), now.getMonth() + 3, 0))
        );
        await Promise.all([
          fecthEstadoAgenda(),
          fetchFechaApertura(),
          loadCitasCountByDate(),
          loadUser(),
        ]);
        horaPreseleccionada.value = now.toISOString().slice(0, 16);
      } catch (err) {
        console.error(err);
        appContext.config.globalProperties.$showAlert("Error al cargar las citas.", "error");
      }
    });

    watch(citas, loadCitasCountByDate, { deep: true });

    const actualizarFechaApertura = async () => {
      if (!nuevaFechaApertura.value) {
        return appContext.config.globalProperties.$showAlert("Selecciona una fecha válida.", "error");
      }
      try {
        await updateFechaApertura(nuevaFechaApertura.value);
        appContext.config.globalProperties.$showAlert("Fecha actualizada.", "success");
      } catch (err) {
        console.error(err);
        appContext.config.globalProperties.$showAlert("Error al actualizar fecha.", "error");
      }
    };

    const handleDeleteCita = async (cita) => {
      try {
        await deleteCita(cita);
        const idx = citas.value.findIndex(c => c.id_cita === cita.id_cita);
        if (idx !== -1) citas.value.splice(idx, 1);
      } catch (err) {
        console.error(err);
        appContext.config.globalProperties.$showAlert("Error al eliminar cita.", "error");
      }
    };

    const handleAgendarHoraLibre = (hora) => {
      if (!selectedDate.value) return;
      const [hrs, mins] = hora.split(":");
      const dt = new Date(selectedDate.value);
      dt.setHours(+hrs, +mins, 0);
      const pad = (n) => n.toString().padStart(2, "0");
      horaPreseleccionada.value = `${dt.getFullYear()}-${pad(dt.getMonth()+1)}-${pad(dt.getDate())}T${hrs}:${mins}`;
      showDialog.value = true;
    };

    const changeEstadoWrapper = async (cita) => {
      const prev = cita.estado;
      cita.estado = !prev;
      try {
        await changeEstado(cita);
      } catch (err) {
        cita.estado = prev;
        console.error(err);
        appContext.config.globalProperties.$showAlert("Error al cambiar estado.", "error");
      }
    };

    const handleCitaClicked = (cita) => {
      console.log("Cita clickeada:", cita);
    };

    const handleDayClicked = (day) => {
      selectedDate.value = new Date(day.date);
      newDateFilter.value = day.date;
    };

    const handleCerrarCabina = (hora) => {
      const d = new Date(selectedDate.value);
      const pad = (n) => n.toString().padStart(2, "0");
      horaPreseleccionada.value = `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${hora}`;
      showCerrarCabinaDialog.value = true;
    };

    const cerrarCabina = async (formData) => {
      try {
        await apiService.addBloqueo({
          id_cabina: formData.id_cabina,
          id_spa: store.getters.idSpa,
          fecha_bloqueo: formData.fecha,
          motivo: formData.motivo,
        });
        await fetchBloqueos();
        // refrezcar selectedDate para reactivar cálculo
        selectedDate.value = new Date(selectedDate.value);
        appContext.config.globalProperties.$showAlert("Cabina cerrada.", "success");
      } catch (err) {
        console.error(err);
        appContext.config.globalProperties.$showAlert("Error al cerrar cabina.", "error");
      }
    };

    return {
      citas,
      citasTodayTomorrow,
      showDialog,
      showCerrarCabinaDialog,
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
      updateCita,
      deleteCita,
      updateFechaApertura,
      changeEstado: changeEstadoWrapper,
      getCitasByCabina,
      getHorasLibres,
      cabinas,
      handleDeleteCita,
      handleAgendarHoraLibre,
      toggleAgendaEstado,
      handleCitaClicked,
      handleDayClicked,
      selectedDate,
      citasCountByDate,
      actualizarFechaApertura,
      nuevaFechaApertura,
      isDeveloper,
      minDate,
      cabinaParaCerrar,
      handleCerrarCabina,
      cerrarCabina,
      formatHora,
      getEventosPorCabina,
      eventosCombinadosLocal,
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
