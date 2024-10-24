<template>
  <div>
    <!-- Componente VCalendar que ahora está sincronizado con el tema global -->
    <v-calendar
      :is-dark="isDarkTheme"
      :rows="1"
      ref="calendar"
      expanded
      :attributes="calendarAttributes"
      @dayclick="onDayClick"
      :disabled-dates="disabledDates"
    />
  </div>
</template>

<script>
import useCitas from "@/composables/useCitas.js";
import { ref, onMounted, computed } from "vue";
import { useTheme } from 'vuetify'; // Importar useTheme para acceder al tema global

export default {
  name: "CitaCalendar",
  props: ["citas"],
  setup(props, { emit }) {
    const calendar = ref(null);
    const disabledDates = ref([]);
    
     // Acceso al tema global de Vuetify
const theme = useTheme();

// Computed para verificar si el tema es oscuro
const isDarkTheme = computed(() => theme.global.name.value === 'dark');


    const { getSundays } = useCitas();
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 11, 31);

    // Deshabilitar los domingos
    disabledDates.value = getSundays(startDate, endDate);

    // Crear un mapa de fechas con el número de citas para el mes presente
    const citasCountByDate = ref(new Map());

    const getCurrentMonthRange = () => {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      return { firstDayOfMonth, lastDayOfMonth };
    };

    const precomputeCitasCount = () => {
      const countMap = new Map();
      const { firstDayOfMonth, lastDayOfMonth } = getCurrentMonthRange();

      props.citas.forEach((cita) => {
        const citaDate = new Date(cita.fecha);
        if (citaDate >= firstDayOfMonth && citaDate <= lastDayOfMonth) {
          const dateString = citaDate.toDateString();
          if (!countMap.has(dateString)) {
            countMap.set(dateString, 0);
          }
          countMap.set(dateString, countMap.get(dateString) + 1);
        }
      });

      citasCountByDate.value = countMap;
    };

    const calendarAttributes = computed(() => {
      const attributes = [];
      citasCountByDate.value.forEach((count, dateString) => {
        const color = count >= 26 ? "red" : count >= 10 ? "orange" : "teal";

        attributes.push({
          key: dateString,
          dates: new Date(dateString),
          highlight: {
            color: color,
            fillMode: "light",
          },
        });
      });
      return attributes;
    });

    onMounted(() => {
      precomputeCitasCount();
      if (calendar.value) {
        calendar.value.move(new Date());
      }
    });

    const onDayClick = (day) => {
      const dayDate = day.date;
      emit("dayClicked", { date: dayDate });
    };

    return {
      calendar,
      onDayClick,
      disabledDates,
      calendarAttributes,
      isDarkTheme, // Retorna el estado de tema global
    };
  },
};
</script>
