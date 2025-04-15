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
        <!-- Se pasa el arreglo combinado (eventosCombinados: citas + bloqueos) al calendario -->
        <cita-calendar
          :citas="eventosCombinados"
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

        <!-- Renderizado de eventos por cabina (citas y bloqueos combinados) -->
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
        :key="evento.tipoEvento === 'cita' ? `cita-${evento.id_cita}` : (evento.tipoEvento === 'bloqueo' ? `bloqueo-${evento.id_bloqueo}` : `libre-${evento.horaStr}`)"
      >
        <!-- Renderizado condicional según el tipo de evento -->
        <cita-card
          v-if="evento.tipoEvento === 'cita'"
          :cita="evento"
          class="custom-card mt-2"
          @updateCita="updateCita"
          @deleteCita="handleDeleteCita"
          @updateEstado="updateCita"
        />
        <hora-bloqueada-card
          v-else-if="evento.tipoEvento === 'bloqueo'"
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
    const { filteredCitas, getCitasByCabina } = useCitasFilter(
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

    // Computed para eventos combinados (citas y bloqueos)
    const eventosCombinados = computed(() => {
      const citasEventos = citas.value.map(cita => ({
        ...cita,
        fechaEvento: cita.fecha,
        tipo: "cita"
      }));
      const bloqueosEventos = bloqueos.value.map(bloqueo => ({
        ...bloqueo,
        fechaEvento: bloqueo.fecha_bloqueo,
        tipo: "bloqueo"
      }));
      return [...citasEventos, ...bloqueosEventos].sort(
        (a, b) => new Date(a.fechaEvento) - new Date(b.fechaEvento)
      );
    });

    // Función que retorna las horas libres para una cabina (excluyendo horas bloqueadas)
    const horasLibresPorCabina = (numeroCabina) => {
  let horasDisponibles = getHorasLibres(getCitasByCabina(numeroCabina), numeroCabina);
  
  const bloqueosCabina = bloqueos.value.filter(bloqueo => {
    const bloqueoDate = new Date(bloqueo.fecha_bloqueo);
    return bloqueo.Cabina.numero_cabina === numeroCabina &&
      bloqueoDate.toDateString() === selectedDate.value.toDateString();
  });
  
  bloqueosCabina.forEach(bloqueo => {
    const bloqueoDate = new Date(bloqueo.fecha_bloqueo);
    const horaBloqueo = bloqueoDate.getHours().toString().padStart(2, "0") + ":" +
      bloqueoDate.getMinutes().toString().padStart(2, "0");
    horasDisponibles = horasDisponibles.filter(hora => hora !== horaBloqueo);
  });

  return horasDisponibles;
};


    // Función que retorna los bloqueos para una cabina en el día seleccionado
    const bloqueosPorCabina = (numeroCabina) => {
  return bloqueos.value.filter(bloqueo => {
    const bloqueoDate = new Date(bloqueo.fecha_bloqueo);
    const selectedDateLocal = new Date(selectedDate.value);

    return (
      bloqueo.Cabina.numero_cabina === numeroCabina &&  // Aquí la corrección crucial
      bloqueoDate.getFullYear() === selectedDateLocal.getFullYear() &&
      bloqueoDate.getMonth() === selectedDateLocal.getMonth() &&
      bloqueoDate.getDate() === selectedDateLocal.getDate()
    );
  });
};

    // Función para formatear la hora (de un bloqueo) en "HH:MM"
    const formatHora = (fechaBloqueo) => {
  const date = new Date(fechaBloqueo);
  // Se muestra la hora usando las opciones locales (puedes personalizar la configuración)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

    onMounted(async () => {
      const currentDate = new Date();
      selectedDate.value = currentDate;
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const lastDayOfSecondNextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0);
      const today = currentDate;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formatDate = date => date.toISOString().split("T")[0];
      
      try {
        const [allCitas, todayTomorrowCitas] = await Promise.all([
          apiService.getCitas({
            idSpa: store.getters.idSpa,
            startDate: formatDate(firstDayOfMonth),
            endDate: formatDate(lastDayOfSecondNextMonth)
          }),
          apiService.getCitas({
            idSpa: store.getters.idSpa,
            startDate: formatDate(today),
            endDate: formatDate(tomorrow)
          })
        ]);
        citas.value = allCitas;
        citasTodayTomorrow.value = todayTomorrowCitas;
        // Cargar bloqueos del spa
       // En lugar de llamar a fetchBloqueos(), llamar a fetchBloqueosByDateRange con el rango deseado
    await fetchBloqueosByDateRange(formatDate(firstDayOfMonth), formatDate(lastDayOfSecondNextMonth));
    console.log('Bloqueos:', bloqueos.value);
        console.log('Bloqueos:', bloqueos.value);
        await Promise.all([
          fecthEstadoAgenda(),
          fetchFechaApertura(),
          getCitasCountByDate(
            store.getters.idSpa,
            formatDate(firstDayOfMonth),
            formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0))
          ),
          loadUser()
        ]);
        // Establecer una hora preseleccionada inicial (usar la hora actual)
        horaPreseleccionada.value = currentDate.toISOString().slice(0, 16);
      } catch (error) {
        console.error("Error en onMounted:", error);
        appContext.config.globalProperties.$showAlert(
          "Error al cargar las citas. Por favor, inténtalo de nuevo.",
          "error"
        );
      }
    });

    watch(citas, async () => {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const formatDate = date => date.toISOString().split("T")[0];
      await getCitasCountByDate(
        store.getters.idSpa,
        formatDate(firstDayOfMonth),
        formatDate(lastDayOfMonth)
      );
    }, { deep: true });

    const actualizarFechaApertura = async () => {
      if (!nuevaFechaApertura.value) {
        appContext.config.globalProperties.$showAlert("Por favor, selecciona una fecha válida.", "error");
        return;
      }
      try {
        await updateFechaApertura(nuevaFechaApertura.value);
        appContext.config.globalProperties.$showAlert("Fecha de apertura actualizada correctamente.", "success");
      } catch (error) {
        appContext.config.globalProperties.$showAlert("Error al actualizar la fecha de apertura.", "error");
        console.error(error);
      }
    };

    const handleDeleteCita = async (cita) => {
      try {
        await deleteCita(cita);
        const index = citas.value.findIndex(c => c.id_cita === cita.id_cita);
        if (index !== -1) {
          citas.value.splice(index, 1);
        }
      } catch (error) {
        appContext.config.globalProperties.$showAlert("Ha ocurrido un error al eliminar la cita.", "error");
        console.error(error);
      }
    };

    const handleAgendarHoraLibre = (hora) => {
      if (selectedDate.value) {
        const [hrs, mins] = hora.split(":");
        const fechaConHora = new Date(selectedDate.value);
        fechaConHora.setHours(parseInt(hrs, 10), parseInt(mins, 10), 0);
        const fechaFormatoLocal = `${fechaConHora.getFullYear()}-${(fechaConHora.getMonth() + 1).toString().padStart(2, "0")}-${fechaConHora.getDate().toString().padStart(2, "0")}T${hrs}:${mins}`;
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
        appContext.config.globalProperties.$showAlert("Ha ocurrido un error al cambiar el estado de la cita.", "error");
        console.error(error);
      }
    };

    const handleDayClicked = (day) => {
      selectedDate.value = day.date;
      newDateFilter.value = day.date;
    };

    // Funciones para cerrar cabina
    const handleCerrarCabina = (hora) => {
      // Actualiza la hora preseleccionada para el cierre usando el día seleccionado y la hora recibida
      horaPreseleccionada.value = selectedDate.value.toISOString().slice(0, 10) + "T" + hora;
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

    // Refrescar bloqueos tras agregar uno nuevo
    await fetchBloqueos();

    // Opcional (si es necesario forzar una actualización visual inmediata)
    selectedDate.value = new Date(selectedDate.value);

    appContext.config.globalProperties.$showAlert("La cabina se cerró correctamente.", "success");
  } catch (error) {
    console.error("Error al cerrar la cabina:", error);
    appContext.config.globalProperties.$showAlert("Error al cerrar la cabina.", "error");
  }
};

const getEventosPorCabina = (numeroCabina) => {
  // Obtener citas de la cabina y asignarles tipo "cita"
  const citasCabina = getCitasByCabina(numeroCabina).map(cita => ({
    ...cita,
    tipoEvento: "cita",            // Identificador para citas
    hora: new Date(cita.fecha)      // Se usa la hora de la cita
  }));
  
  // Obtener bloqueos de la cabina y asignarles tipo "bloqueo"
  const bloqueosCabina = bloqueos.value
    .filter(bloqueo => {
      const bloqueoDate = new Date(bloqueo.fecha_bloqueo);
      const selectedDateLocal = new Date(selectedDate.value);
      return (
        bloqueo.Cabina.numero_cabina === numeroCabina &&
        bloqueoDate.getFullYear() === selectedDateLocal.getFullYear() &&
        bloqueoDate.getMonth() === selectedDateLocal.getMonth() &&
        bloqueoDate.getDate() === selectedDateLocal.getDate()
      );
    })
    .map(bloqueo => ({
      ...bloqueo,
      tipoEvento: "bloqueo",           // Identificador para bloqueos
      hora: new Date(bloqueo.fecha_bloqueo)
    }));
  
  // Obtener las horas libres para la cabina y transformarlas en objetos de evento
  const horasLibres = horasLibresPorCabina(numeroCabina).map(horaStr => {
    // Convertir la cadena "HH:MM" en un objeto Date basado en selectedDate
    const [hrs, mins] = horaStr.split(":");
    const freeDate = new Date(selectedDate.value);
    freeDate.setHours(parseInt(hrs, 10), parseInt(mins, 10), 0, 0);
    return {
      tipoEvento: "libre",   // Identificador para horas libres
      hora: freeDate,
      horaStr              // Almacenamos la cadena original por si se requiere
    };
  });

  // Combina todos los eventos
  const eventos = [...citasCabina, ...bloqueosCabina, ...horasLibres];
  // Ordena los eventos de forma ascendente según la propiedad "hora"
  eventos.sort((a, b) => a.hora - b.hora);
  return eventos;
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
      changeEstado: changeEstadoWrapper,
      getCitasByCabina,
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
      // Horas libres para agendar (excluyendo bloqueos)
      horasLibresPorCabina,
      // Bloqueos para una cabina en el día seleccionado
      bloqueosPorCabina,
      // Función para formatear hora
      formatHora,
      // Eventos combinados (citas y bloqueos)
      eventosCombinados,
      // Variables y métodos para cerrar cabina:
      showCerrarCabinaDialog,
      cabinaParaCerrar,
      handleCerrarCabina,
      cerrarCabina,
      getEventosPorCabina
    };
  }
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
