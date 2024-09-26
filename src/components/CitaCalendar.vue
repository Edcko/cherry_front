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

    // Definir los atributos del calendario para colorear los días con citas
    const calendarAttributes = computed(() => {
      return props.citas.map((cita) => {
        return {
          key: cita.id_cita,
          dates: cita.fecha, // La fecha de la cita
          highlight: {
            color: "blue", // Color teal para los días con citas
            fillMode: "light", // El modo de llenado
          },
        };
      });
    });

    onMounted(async () => {
      if (calendar.value) {
        await calendar.value.move(new Date());
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
