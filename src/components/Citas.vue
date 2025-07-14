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
              {{ numeroCabina === 4 ? "Depilación" : "Cabina " + numeroCabina }}
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
                  :changeEstado="handleChangeEstado"
                />
                <hora-bloqueada-card
                  v-else-if="evento.tipo === 'bloqueo'"
                  :idBloqueo="evento.id_bloqueo"
                  :hora="formatHora(evento.hora)"
                  :motivoBloqueo="evento.motivo"
                  :canLiberar="isPrivilegedRole"
                  @liberar="liberarHora"
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
import { onMounted, ref, computed, getCurrentInstance, markRaw } from "vue";
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

    // Cargar cabinas disponibles
    const cabinasDisponibles = ref([]);
    const cargarCabinasDisponibles = async () => {
      try {
        const todasLasCabinas = await apiService.getCabinas({ idSpa: store.getters.idSpa });
        // Filtrar solo las cabinas disponibles
        cabinasDisponibles.value = todasLasCabinas
          .filter(cabina => cabina.estado_cabina === 'Disponible')
          .map(cabina => cabina.numero_cabina)
          .sort((a, b) => a - b);
        console.log('Cabinas disponibles:', cabinasDisponibles.value);
      } catch (error) {
        console.error('Error al cargar cabinas:', error);
        // Fallback a las cabinas por defecto si hay error
        cabinasDisponibles.value = [1, 2, 4]; // Excluir cabina 3 por defecto
      }
    };

    // Formateo de hora
    const formatHora = (fechaBloqueo) => {
      const date = new Date(fechaBloqueo);
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    const getCitasByCabina = (numeroCabina) => {
      const result = getCitasByCabinaFilter(numeroCabina) || [];
      console.log(`getCitasByCabina(${numeroCabina}): ${result.length} citas`);
      return result;
    };

    // COMBINACIÓN DE EVENTOS: excluye horas bloqueadas de las libres
    const getEventosPorCabina = (numeroCabina) => {
      try {
        const now = new Date();

        // Validar que selectedDate existe
        if (!selectedDate.value) {
          return [];
        }

        // Debug: verificar citas por cabina
        const citasRaw = getCitasByCabina(numeroCabina) || [];
        console.log(`Cabina ${numeroCabina}: ${citasRaw.length} citas encontradas`);

        // 1) Si filtro por cliente, SOLO muestro citas y aplico future→past
        if (clientIdFilter.value) {
          // Primeras las futuras, de más cercanas a más lejanas
          const futuras = citasRaw
            .filter(cita => cita && cita.fecha && new Date(cita.fecha) >= now)
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            .map(cita => {
              const evento = {
                ...cita,
                tipo: 'cita',
                fechaEvento: cita.fecha,
                hora: new Date(cita.fecha)
              };
              return markRaw(evento);
            });

          // Luego las pasadas, de más recientes a más antiguas
          const pasadas = citasRaw
            .filter(cita => cita && cita.fecha && new Date(cita.fecha) < now)
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .map(cita => {
              const evento = {
                ...cita,
                tipo: 'cita',
                fechaEvento: cita.fecha,
                hora: new Date(cita.fecha)
              };
              return markRaw(evento);
            });

          return [...futuras, ...pasadas];
        }

        // 2) Si NO filtro por cliente, uso tu lógica original combinando citas, bloqueos y horas libres
        const citasCabina = citasRaw.map(cita => {
          if (!cita || !cita.fecha) return null;
          const evento = {
            ...cita,
            tipo: 'cita',
            fechaEvento: cita.fecha,
            hora: new Date(cita.fecha)
          };
          return markRaw(evento);
        }).filter(Boolean);

        const bloqueosCabina = (bloqueos.value || [])
          .filter(b => {
            if (!b || !b.fecha_bloqueo || !b.Cabina) return false;
            const d   = new Date(b.fecha_bloqueo);
            const sel = new Date(selectedDate.value);
            return (
              b.Cabina.numero_cabina === numeroCabina &&
              d.getFullYear() === sel.getFullYear() &&
              d.getMonth()    === sel.getMonth()    &&
              d.getDate()     === sel.getDate()
            );
          })
          .map(b => {
            const evento = {
              ...b,
              tipo: 'bloqueo',
              fechaEvento: b.fecha_bloqueo,
              hora: new Date(b.fecha_bloqueo)
            };
            return markRaw(evento);
          });

        const todasHorasLibres = getHorasLibres(citasRaw, numeroCabina);
        const bloqueadasStr = bloqueosCabina.map(b => {
          if (!b || !b.hora) return '';
          const h = b.hora.getHours().toString().padStart(2, '0');
          const m = b.hora.getMinutes().toString().padStart(2, '0');
          return `${h}:${m}`;
        }).filter(Boolean);
        
        const horasLibres = todasHorasLibres
          .filter(hs => !bloqueadasStr.includes(hs))
          .map(hs => {
            const [h, m] = hs.split(':');
            const d = new Date(selectedDate.value);
            d.setHours(+h, +m, 0, 0);
            const evento = { 
              tipo: 'libre', 
              hora: d, 
              horaStr: hs 
            };
            return markRaw(evento);
          });

        const eventos = [...citasCabina, ...bloqueosCabina, ...horasLibres];
        eventos.sort((a, b) => {
          if (!a || !b || !a.hora || !b.hora) return 0;
          return a.hora - b.hora;
        });
        
        // console.log(`Cabina ${numeroCabina}: ${citasCabina.length} citas, ${bloqueosCabina.length} bloqueos, ${horasLibres.length} horas libres`);
        console.log(`Cabina ${numeroCabina}: ${citasCabina.length} citas, ${bloqueosCabina.length} bloqueos, ${horasLibres.length} horas libres, total eventos: ${eventos.length}`);
        return eventos;
      } catch (error) {
        console.error('Error en getEventosPorCabina:', error);
        return [];
      }
    };

    // Para el calendario: eventos de la primera cabina
    const eventosCombinadosLocal = computed(() => {
      try {
        if (!cabinas.value || !cabinas.value[0]) return [];
        return getEventosPorCabina(cabinas.value[0]) || [];
      } catch (error) {
        console.error('Error en eventosCombinadosLocal:', error);
        return [];
      }
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
      try {
        const now = new Date();
        selectedDate.value = now;
        const f = (d) => d.toISOString().split("T")[0];
        
        console.log('Iniciando carga de datos...');
        
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
        
        console.log('Citas cargadas:', allC.length);
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
          cargarCabinasDisponibles(),
        ]);
        
        horaPreseleccionada.value = now.toISOString().slice(0, 16);
        console.log('Carga completada exitosamente');
      } catch (err) {
        console.error('Error en onMounted:', err);
        appContext.config.globalProperties.$showAlert("Error al cargar las citas.", "error");
      }
    });

    // Comentado temporalmente para debugging
    // watch(citas, loadCitasCountByDate, { deep: true });

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

    // Función wrapper para cambiar estado que actualiza el estado local
    const handleChangeEstado = async (cita) => {
      try {
        await changeEstado(cita);
        // Forzar la reactividad actualizando el array de citas
        const index = citas.value.findIndex(c => c.id_cita === cita.id_cita);
        if (index !== -1) {
          // Crear un nuevo array para forzar la reactividad
          citas.value = [...citas.value];
        }
      } catch (error) {
        console.error('Error al cambiar estado:', error);
        appContext.config.globalProperties.$showAlert("Error al cambiar el estado de la cita.", "error");
      }
    };



    const handleCitaClicked = (cita) => {
      console.log("Cita clickeada:", cita);
    };

    const handleDayClicked = async (day) => {
      console.log('Día clickeado:', day);
      
      // Evitar actualizaciones innecesarias si es la misma fecha
      const newDate = new Date(day.date);
      if (selectedDate.value && selectedDate.value.getTime() === newDate.getTime()) {
        return;
      }
      
      // Actualizar newDateFilter primero
      newDateFilter.value = day.date;
      
      // Actualizar selectedDate inmediatamente para evitar re-renders
      selectedDate.value = newDate;
      
      // Cargar bloqueos para la fecha seleccionada en segundo plano
      try {
        const start = new Date(day.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(day.date);
        end.setHours(23, 59, 59, 999);
        
        // Usar setTimeout para evitar bloqueos en el render
        setTimeout(async () => {
          try {
            await fetchBloqueosByDateRange(
              start.toISOString(),
              end.toISOString()
            );
            console.log('Bloqueos cargados para la fecha:', day.date);
          } catch (error) {
            console.error("Error al cargar bloqueos para la fecha:", error);
          }
        }, 0);
        
      } catch (error) {
        console.error("Error al procesar fecha:", error);
      }
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
        
        // Recargar bloqueos en segundo plano
        setTimeout(async () => {
          try {
            const dia = new Date(selectedDate.value);
            await fetchBloqueosByDateRange(
              new Date(dia.setHours(0,0,0,0)).toISOString(),
              new Date(dia.setHours(23,59,59,999)).toISOString()
            );
          } catch (error) {
            console.error("Error al recargar bloqueos:", error);
          }
        }, 0);
        
        appContext.config.globalProperties.$showAlert("Cabina cerrada.", "success");
      } catch (err) {
        console.error(err);
        appContext.config.globalProperties.$showAlert("Error al cerrar cabina.", "error");
      }
    };

    const liberarHora = async (idBloqueo) => {
      try {
        // Llamada a tu API para eliminar el bloqueo
        await apiService.deleteBloqueo(idBloqueo);

        // Recargar bloqueos en segundo plano
        setTimeout(async () => {
          try {
            await fetchBloqueos();
          } catch (error) {
            console.error("Error al recargar bloqueos:", error);
          }
        }, 0);

        appContext.config.globalProperties.$showAlert(
          "Hora liberada correctamente.",
          "success"
        );
      } catch (error) {
        console.error("Error al liberar hora:", error);
        appContext.config.globalProperties.$showAlert(
          "No se pudo liberar la hora.",
          "error"
        );
      }
    };

    const isPrivilegedRole = computed(() =>
  ["Administrador", "Desarrollador", "Gerente", "Generente", "Manager"]
    .includes(user.value?.tipo_empleado)
);

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
      changeEstado,
      handleChangeEstado,
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
      liberarHora,
      isPrivilegedRole,
      cabinasDisponibles,
      cargarCabinasDisponibles,
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
