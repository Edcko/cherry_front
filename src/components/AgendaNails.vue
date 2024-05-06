<template>
  <div>
    <h1>Calendario de Citas para Uñas</h1>
    <VCalendar 
    :citas="citas" 
    :attributes="attrs" 
    :rows="1" ref="calendar" 
    expanded 
    @dayclick="onDayClick"
    :disabled-dates="disabledDates" />
    <!-- Acá puedes agregar un diálogo o menú emergente que se active al hacer clic en un día -->
    <div class="estaciones-container" v-if="citasSeleccionadas.length >= 0">
      <div class="estacion" v-for="estacion in [1, 2]" :key="'estacion-' + estacion">
        <h3>Estación {{ estacion }}</h3>
        
          <v-container v-if="user" fluid>
            <cita-card 
            v-for="cita in filtrarCitasPorEstacion(estacion)" 
            :key="cita.id_cita"
            :cita="cita"
            @deleteCita="handleDeleteCita"          
            />
          </v-container>
        <div class="horas-libres">
          <h4>Horas Libres</h4>
          <v-btn v-for="horaLibre in horasLibres[estacion === 1 ? 5 : 6]" :key="horaLibre"
            @click="agregarCita(horaLibre, estacion === 1 ? 5 : 6)">
            {{ horaLibre }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Agrega el diálogo para agregar una nueva cita -->

    <div class="d-flex justify-center mb-5 mt-5">
      <v-row justify="center">
        <v-dialog v-model="showDialog" persistent width="1024">
          <template v-slot:activator="{ props }">
            <template v-if="showDialogButton">
              <v-btn class="custom-button" elevation="8" rounded :large="true" v-bind="props">
                Agendar Cita
              </v-btn>
            </template>
          </template>
          <cita-dialog 
          :showDialog="showDialog" 
          :citaPreseleccionada="citaPreseleccionada" 
          @addCita="addCita"
          @close="showDialog = false" />
        </v-dialog>
      </v-row>
    </div>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";
// eslint-disable-next-line
import { format, startOfDay, addHours } from "date-fns";
import useUser from "@/composables/useUser";
import apiServices from "@/services/apiServices.js";
import useCitas from "@/composables/useCitas.js";
import CitaCard from "@/components/CitaCard.vue";
import CitaDialog from "@/components/CitaDialog.vue";
import store from "@/store";

export default {
  name: "AgendaNails",
  components: {
    CitaCard,
    CitaDialog,
  },
  setup() {
    const calendar = ref(null);
    const idSpa = store.getters.idSpa;
   // const citas = ref([]);
    const citasSeleccionadas = ref([]);
    const horasLibres = ref({
      5: [],
      6: [], //Horas libres para la cabina 6
    });
    const diaSeleccionado = ref(null); // Almacena el día actualmente seleccionado
    const attrs = ref([]); // Asegúrate de que esta variable sea reactiva
    const disabledDates = ref([]);
    const showDialog = ref(false);
    const showDialogButton = ref(false);
    const citaPreseleccionada = ref({
      fecha: '',
    });
    const { user, loadUser } = useUser();
    const { citas, getSundays, addCita, deleteCita } = useCitas(); // O alguna función similar que necesites
    const startDate = new Date(2024, 0, 1); // Ajusta las fechas según necesites
    const endDate = new Date(2024, 11, 31);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() devuelve un índice basado en 0
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const actualizarEstadoPorDiaSeleccionado = () => {
  if (!diaSeleccionado.value) return;

  citasSeleccionadas.value = getCitasDelDia(diaSeleccionado.value);
  
  generarHorasLibres(diaSeleccionado.value, 5);
  generarHorasLibres(diaSeleccionado.value, 6);
};

    // Calculando el primer y ultimo dia del mes actual
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    disabledDates.value = getSundays(startDate, endDate);

    onMounted(async () => {
      await loadUser();
      try {
        const formattedStartDate = formatDate(firstDayOfMonth);
        const formattedEndDate = formatDate(lastDayOfMonth);
        console.log("Fecha de inicio:", formattedStartDate);
        console.log("Fecha de fin:", formattedEndDate);

        citas.value = await apiServices.getCitas({
          id_spa: idSpa,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
        });
        console.log("Citas del mes actual:", citas.value);
      } catch (error) {
        console.error("Error al cargar las citas: ", error);
      }

      // Convertir cada cita a un atributo para el calendario
      attrs.value = citas.value.map(cita => ({
        key: cita.id, // O cualquier identificador único de la cita
        highlight: {
          // Puedes personalizar cómo se destacan las citas aquí
          color: 'teal', // El color de resaltado para la cita
        },
        // Asegúrate de que las fechas se formatean correctamente para VCalendar
        dates: new Date(cita.fecha), // Asume que `cita.fecha` es una fecha válida para el constructor de Date
        // Puedes agregar más propiedades según lo que necesites mostrar o cómo quieras que se vean las citas
      }));

      if (calendar.value) {
        await calendar.value.move(new Date());
      }
    });

    const getCitasDelDia = (fechaSeleccionada) => {
      return citas.value
        .filter(cita =>
          new Date(cita.fecha).toDateString() === new Date(fechaSeleccionada).toDateString() &&
          cita.tipo_cita.toLowerCase() === "uñas" &&
          (cita.Cabina.numero_cabina === 5 || cita.Cabina.numero_cabina === 6))
        .sort((a, b) => {
          // Utiliza la fecha completa para ordenar, ya que incluye la hora
          return new Date(a.fecha) - new Date(b.fecha);
        });
    };

    const generarHorasLibres = (fechaSeleccionada, numeroCabina) => {
      let horasLibresTemp = [];
      const inicioDia = startOfDay(new Date(fechaSeleccionada));

      for (let i = 0; i < 12; i++) {
        const horaCandidata = addHours(inicioDia, 8 + i);
        const horaFormateada = format(horaCandidata, 'HH:mm');

        // Asegúrate de usar numero_cabina para la comprobación
        const esHoraOcupada = citasSeleccionadas.value.some(cita =>
          cita.Cabina.numero_cabina === numeroCabina &&
          format(new Date(cita.fecha), 'HH:mm') === horaFormateada &&
          new Date(cita.fecha).toDateString() === new Date(fechaSeleccionada).toDateString()
        );

        if (!esHoraOcupada) {
          horasLibresTemp.push(horaFormateada);
        }
      }

      // Asegúrate de que el objeto horasLibres está correctamente inicializado para usar numero_cabina como clave
      horasLibres.value[numeroCabina] = horasLibresTemp;
    };

    const filtrarCitasPorEstacion = (estacion) => {
      const numeroCabina = estacion === 1 ? 5 : 6;
      return citasSeleccionadas.value.filter(cita => cita.Cabina.numero_cabina === numeroCabina);
    };


    const onDayClick = (day) => {
      console.log("Día seleccionado:", day.date.toISOString().split("T")[0]);
      citaPreseleccionada.value.fecha = day.date.toISOString().split("T")[0]; // Guarda solo la fecha sin la hora
      citasSeleccionadas.value = getCitasDelDia(day.date);

      // Generamos horas libres para cada cabina al seleccionar un dia
      generarHorasLibres(day.date, 5);
      generarHorasLibres(day.date, 6);
    };

    const agregarCita = (horaLibre, estacion) => {

      // Extrae solo la fecha de citaPreseleccionada.value.fecha, sin la hora
      const fechaSinHora = citaPreseleccionada.value.fecha.split("T")[0];

      // Construye una nueva cadena de fecha y hora usando la fecha existente y la nueva hora libre seleccionada
      const nuevaFechaHoraCita = `${fechaSinHora}T${horaLibre}`;

      // Identifica correctamente el número de cabina basado en la estación seleccionada
      const numeroCabinaSeleccionada = estacion === 1 ? 5 : 6;

      // Actualiza citaPreseleccionada con la nueva fecha y hora, y otros valores necesarios
      citaPreseleccionada.value = {
        ...citaPreseleccionada.value, // Conserva otros valores previos si es necesario
        fecha: nuevaFechaHoraCita,
        id_cabina: numeroCabinaSeleccionada,
        tipo_cita: "Uñas",
      };
      showDialog.value = true;

      // Despues de agregar la cita, regeneramos las horas libres SOLO para la cabina afectada
      generarHorasLibres(citaPreseleccionada.value.fecha, estacion);
      console.log("Horas libres metodo:", generarHorasLibres(citaPreseleccionada.value.fecha, numeroCabinaSeleccionada));

      actualizarEstadoPorDiaSeleccionado();

    };

    const handleDeleteCita = async (cita) => {
      try {
        await deleteCita(cita);
        citas.value = citas.value.filter(c => c.id_cita !== cita.id_cita);
        actualizarEstadoPorDiaSeleccionado();
      } catch (error) {
        this.$showAlert("Ha ocurrido un error al eliminar la cita.", "error");
        console.error(error);
      }
    };

    //const handleAddCita = (cita) => {


    //}

    return {
      showDialog,
      showDialogButton,
      citaPreseleccionada,
      user,
      citas,
      citasSeleccionadas,
      horasLibres,
      attrs,
      calendar,
      addCita,
      deleteCita,
      handleDeleteCita,
      getCitasDelDia,
      generarHorasLibres,
      filtrarCitasPorEstacion,
      onDayClick,
      agregarCita,
      disabledDates,
      // Asegúrate de retornar aquí cualquier otra propiedad reactiva o método que necesites
    };
  },
};

</script>

<style>
.estaciones-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;

  .estacion {
    flex: 1;
    margin: 0 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* Centrar los elementos de la estación */
  }

  .estacion h3,
  .horas-libres h4 {
    text-align: center;
    /* Centrar títulos */
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: 100%;
    /* Asegurar que la lista ocupe todo el ancho disponible */
  }

  .horas-libres {
    margin-top: 20px;
    /* Añadir espacio entre las citas y las horas libres */
    width: 100%;
    /* Asegurar que las horas libres ocupen todo el ancho disponible */
  }

  .horas-libres button {
    margin: 5px;
    /* Añadir espacio alrededor de cada botón */
  }
}
</style>