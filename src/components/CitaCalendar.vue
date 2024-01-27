<template>
  <div>
    <v-calendar 
      :rows="1"
      ref="calendar"
      expanded
      @dayclick="onDayClick"
      :disabled-dates="disabledDates"
    />
  </div>
</template>

<script>
import useCitas from "@/composables/useCitas.js";
import { ref, onMounted } from "vue";

export default {
  name: "CitaCalendar",
  props: ["citas"],
  setup(props) {
    const calendar = ref(null);
    const disabledDates = ref([]);

    const { getSundays } = useCitas();
    const startDate = new Date(2023, 0, 1);
    const endDate = new Date(2023, 11, 31);

    disabledDates.value = getSundays(startDate, endDate);

    onMounted(async () => {
      if(calendar.value){
        await calendar.value.move(new Date())
      }
    });

    /*
`calendarAttributes` es una propiedad computada que genera los atributos de cada día en el calendario basándose en las citas.
 Para cada cita, se crea un objeto que contiene el ID de la cita, la fecha de la cita y el color de resaltado para el día en el calendario.
  El color del resaltado depende del número de citas para esa fecha.
    */
    



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


/*
`countCitasForDate` es una función que cuenta el número de citas para una fecha específica que no han sido canceladas ni perdidas.
*/
 //   const countCitasForDate = (date) => {
//    console.log("Fecha de la cita en counCitasForDate:", date);
//  return props.citas.filter((cita) => new Date(cita.fecha).toDateString() === date.toDateString() && cita.estado !== "Cita cancelada" && cita.estado !== "Cita perdida").length;
//};

/*
    const countCitasForDate = (date) => {
      return props.citas.filter((cita) => {
        const citaDate = new Date(cita.fecha);
        return (
          citaDate.toDateString() === date.toDateString() &&
          cita.estado !== "Cita cancelada" && 
          cita.estado !== "Cita perdida" &&
          cita.Cabina.numero_cabina !== 4
        );
      }).length;
    };
*/

    return {
      calendar,
      onDayClick,
      disabledDates,
    };
  },
};
</script>
