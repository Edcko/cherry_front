<template>
  <div>
    <v-calendar :rows="2"
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
import { computed, ref, onMounted } from "vue";

export default {
  name: "CitaCalendar",
  props: ["citas"],
  setup(props) {

    const calendar = ref(null);
    const disabledDates = ref([]);

    const { getSundays } = useCitas();

    // Asegúrate de ajustar estas fechas para que cubran el rango de fechas que te interesa
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date(2023, 11, 31);

    disabledDates.value = getSundays(startDate, endDate);


    const calendarAttributes = computed(() => {
      return props.citas.map((cita) => {
        const citasCount = countCitasForDate(new Date(cita.fecha));
        return {
          key: cita.id_cita,
          dates: cita.fecha,
          highlight: {
            color: citasCount >= 42 ? "red" : "blue",
            fillMode: "light",
          },
          content: "•",
          popovers: {
            label: `Cita: ${cita.id_cita}`,
            slots: [
              {
                content: `Empleado: ${cita.id_empleado}<br>Cliente: ${cita.id_cliente}`,
              },
            ],
          },
        };
      });
    });

    const onDayClick = (day) => {
      const dayDateString = day.date.toISOString().split("T")[0];
      const clickedCita = props.citas.find((cita) => {
        const citaDateString = new Date(cita.fecha).toISOString().split("T")[0];
        return citaDateString === dayDateString;
      });
      if (clickedCita) {
        // Emite el evento con la cita clickeada
        console.log(`Cita: ${clickedCita.id_cita}`);
        console.log(`Empleado: ${clickedCita.id_empleado}`);
        console.log(`Cliente: ${clickedCita.id_cliente}`);
        //      this.$emit('citaClicked', clickedCita);
      } else {
        //    this.$emit('dayClicked', day);
        console.log("Selected day: ");
      }
    };

    const countCitasForDate = (date) => {
      return props.citas.filter((cita) => {
        const citaDate = new Date(cita.fecha);
        return (
          citaDate.toDateString() === date.toDateString() &&
          cita.estado !== "Cancelado"
        );
      }).length;
    };

    onMounted(async () => {
      if(calendar.value){
        await calendar.value.move(new Date())
      }
    });

    return {
      calendar,
      calendarAttributes,
      onDayClick,
      disabledDates,
    };
  },
};
</script>
