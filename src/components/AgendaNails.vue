<template>
  <div>
    <VCalendar 
      :citas="citas"
      :attributes="attrs"
      :rows="1"
      ref="calendar"
      expanded
      @dayclick="onDayClick"
      :disabled-dates="disabledDates"
    />
    <!-- Acá puedes agregar un diálogo o menú emergente que se active al hacer clic en un día -->
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import useUser from "@/composables/useUser";
import apiServices from "@/services/apiServices.js";
import useCitas from "@/composables/useCitas.js"; // Asume que este composable puede ser reutilizado aquí

export default {
  name: "AgendaNails",
  setup() {
    const calendar = ref(null);
    const citas = ref([]);
    const citasSeleccionadas = ref([]);
    const attrs = ref([]); // Asegúrate de que esta variable sea reactiva
    const disabledDates = ref([]);
    const { user, loadUser } = useUser();
    const { getSundays } = useCitas(); // O alguna función similar que necesites
    const startDate = new Date(2024, 0, 1); // Ajusta las fechas según necesites
    const endDate = new Date(2024, 11, 31);
    const format = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() devuelve un índice basado en 0
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


    // Calculando el primer y ultimo dia del mes actual
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    disabledDates.value = getSundays(startDate, endDate);

    onMounted(async () => {
      await loadUser();
      try {
    const formattedStartDate = format(firstDayOfMonth);
    const formattedEndDate = format(lastDayOfMonth);
    console.log("Fecha de inicio:", formattedStartDate);
    console.log("Fecha de fin:", formattedEndDate);
    
    citas.value = await apiServices.getCitas({
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

      if(calendar.value){
        await calendar.value.move(new Date());
      }
    });

    const getCitasDelDia = (fechaSeleccionada) => {
  return citas.value
    .filter(cita => new Date(cita.fecha).toDateString() === new Date(fechaSeleccionada).toDateString())
    .sort((a, b) => {
      if (a.id_cabina === b.id_cabina) {
        // Si la cabina es la misma, ordenamos por la hora de la fecha
        return new Date(a.fecha) - new Date(b.fecha);
      }
      // Orden básico por ID de cabina
      return a.id_cabina - b.id_cabina;
    });
};

const onDayClick = (day) => {
  console.log("Día seleccionado:", day.date.toISOString().split("T")[0]);
  citasSeleccionadas.value = getCitasDelDia(day.date);
  // Aquí, abre el modal o muestra la sección con las citasSeleccionadas
};

    return {
      user,
      citas,
      attrs,
      calendar,
      getCitasDelDia,
      onDayClick,
      disabledDates,
      // Asegúrate de retornar aquí cualquier otra propiedad reactiva o método que necesites
    };
  },
};

</script>

<style>

</style>