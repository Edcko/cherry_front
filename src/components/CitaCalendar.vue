<template>
  <div>
    <!-- Componente VCalendar sincronizado con el tema global -->
    <vcal-calendar
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

<script setup>
/* eslint-disable */
import { ref, computed, onMounted } from "vue";
import { useTheme } from "vuetify";
import useCitas from "@/composables/useCitas.js";

// Definición de props y emits
const props = defineProps({
  citas: Array,
  citasCount: {
    type: Object, // Se espera un Map, por ejemplo
    required: true,
  },
});
const emit = defineEmits(["dayClicked"]);

// Referencia al componente calendario y fechas deshabilitadas
const calendar = ref(null);
const disabledDates = ref([]);

// Acceso al tema global de Vuetify
const theme = useTheme();
const isDarkTheme = computed(() => theme.global.name.value === "dark");

// Uso del composable para obtener los domingos
const { getSundays } = useCitas();
const startDate = new Date(2025, 0, 1);
const endDate = new Date(2025, 11, 31);
disabledDates.value = getSundays(startDate, endDate);

// Computed que genera los atributos del calendario basado en citasCount (fuente única de verdad)
const calendarAttributes = computed(() => {
  const attributes = [];
  props.citasCount.forEach((count, dateString) => {
    // Convertir la fecha a formato local a las 00:00
    const date = new Date(dateString + "T00:00:00");
    const color = count >= 26 ? "red" : count >= 10 ? "orange" : "teal";

    attributes.push({
      key: dateString,
      dates: date,
      highlight: {
        color,
        fillMode: "light",
      },
    });
  });
  return attributes;
});

// Mover el calendario a la fecha actual al montarse
onMounted(() => {
  if (calendar.value) {
    calendar.value.move(new Date());
  }
});

// Manejo del clic en un día
const onDayClick = (day) => {
  emit("dayClicked", { date: day.date });
};
</script>
