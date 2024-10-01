<template>
  <div>
    <v-calendar 
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

export default {
  name: "CitaCalendar",
  props: ["citas"],
  setup(props, {emit}) {
    const calendar = ref(null);
    const disabledDates = ref([]);

    const { getSundays } = useCitas();
    const startDate = new Date(2024, 0, 1);
    const endDate = new Date(2024, 11, 31);

    // Deshabilitar los domingos
    disabledDates.value = getSundays(startDate, endDate);

 // Crear un mapa de fechas con el número de citas
 const citasCountByDate = ref(new Map());

// Preprocesar las citas para obtener el conteo por fecha
const precomputeCitasCount = () => {
  const countMap = new Map();
  
  props.citas.forEach((cita) => {
    const citaDate = new Date(cita.fecha).toDateString(); // Convertir la fecha a string para ser usada como clave
    if (!countMap.has(citaDate)) {
      countMap.set(citaDate, 0);
    }
    countMap.set(citaDate, countMap.get(citaDate) + 1);
  });

  citasCountByDate.value = countMap;
};

// Calcular los atributos del calendario basados en el número de citas
const calendarAttributes = computed(() => {
  const attributes = [];
  citasCountByDate.value.forEach((count, dateString) => {
    const color = count >= 26 ? "red" : count >= 10 ? "orange" : "teal"; // Cambiar el color basado en el número de citas

    attributes.push({
      key: dateString,
      dates: new Date(dateString), // Convertir el string de nuevo a Date
      highlight: {
        color: color,
        fillMode: "light",
      },
    });
  });
  return attributes;
});

onMounted(() => {
  precomputeCitasCount(); // Precomputar el número de citas por fecha al montar el componente
  if (calendar.value) {
    calendar.value.move(new Date());
  }
});

    const onDayClick = (day) => {
      console.log("Day clicked:", day);
      const dayDate = day.date;
      emit("dayClicked", { date: dayDate });
    };

    return {
      calendar,
      onDayClick,
      disabledDates,
      calendarAttributes, // Devolver los atributos del calendario
    };
  },
};
</script>
