<template>
  <div>
    <v-calendar
      :rows="1"
      ref="calendar"
      expanded
      @dayclick="onDayClick"
      :disabled-dates="disabledDates"
      :day-format="customDayFormatter"
    />
  </div>
</template>

<script>
import useCitas from "@/composables/useCitas.js";
import { ref, onMounted } from "vue";

export default {
  name: "CitaCalendar",
  props: ["citas"], // Recibe las citas como propiedad
  setup(props, { emit }) {
    const calendar = ref(null);
    const disabledDates = ref([]);

    const { getSundays } = useCitas();
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 11, 31);

    disabledDates.value = getSundays(startDate, endDate);

    // Mover el calendario a la fecha actual al montarse
    onMounted(async () => {
      if (calendar.value) {
        await calendar.value.move(new Date());
      }
    });

    // Evento cuando se hace clic en un día del calendario
    const onDayClick = (day) => {
      console.log("Day clicked:", day);
      const dayDate = day.date;
      emit("dayClicked", { date: dayDate });
    };

    // Formateador personalizado para el calendario
    const customDayFormatter = (day) => {
      const dayDate = new Date(day.date).toDateString(); // Convertimos la fecha del día actual

      // Verificamos si hay citas en la fecha actual
      const hasCita = props.citas.some((cita) => {
        const citaDate = new Date(cita.fecha).toDateString(); // Convertimos la fecha de la cita
        return dayDate === citaDate; // Comparamos las fechas
      });

      // Si hay citas, aplicamos un color de fondo
      return hasCita
        ? { class: 'cita-day', content: day.day }
        : { content: day.day };
    };

    return {
      calendar,
      onDayClick,
      disabledDates,
      customDayFormatter,
    };
  },
};
</script>

<style scoped>
/* Estilo personalizado para los días con citas */
.cita-day {
  background-color: #e0f7fa; /* Tono bajo de teal */
  border-radius: 50%;
  color: #00695c;
}
</style>
