<template>
  <div>
    <h1>Calendario de Valoraciones</h1>
    <v-calendar
    :rows="1"
    ref="calendar"
    expanded
    :attributes="calendarAttributes"
    :disabled-dates="disabledDates"
    />
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import useValoraciones from '@/composables/useValoraciones';

export default {
    name: "ValoracionCalendar",
    props: ["valoraciones"],
    setup(props){
        const calendar = ref(null);
        const disabledDates = ref([]);

        const { getSundays } = useValoraciones();
        const startDate = new Date(2023, 0, 1);
        const endDate = new Date(2023, 11, 31);

        disabledDates.value = getSundays(startDate, endDate);

        const calendarAttributes = computed(() => {
            return props.valoraciones.map((valoracion) => {
                const fechaFormateada = format(new Date(valoracion.fecha_valoracion), 'h:mm aa', { locale: es });
                const valoracionesCount = countValoracionesForDate(new Date(valoracion.fecha));
                return {
                    key: valoracion.id_valoracion,
                    dates: valoracion.fecha_valoracion,
                    highlight: {
                        color: valoracionesCount >= 39 ? "red" : "teal",
                        fillMode: "light",
                    },
                    dot: {
                        color: valoracionesCount >= 39 ? "red" : "teal",
                    },
                    popover: {
                        label: `Valoracion: ${fechaFormateada} || Empleado: ${valoracion.id_empleado} || Cliente: ${valoracion.id_cliente}`,
                        slots: [
                            {
                                content: `Empleado: ${valoracion.id_empleado}<br>Cliente: ${valoracion.Cliente?.nombre_cliente ?? 'Desconocido'} ${valoracion.Cliente?.apellido_paterno ?? ''} ${valoracion.Cliente?.apellido_materno ?? ''} | Estado de compra: ${valoracion.estado}`,
                            },
                        ],
                    },
                };
            });
        });

        const onDayClick = (day) => {
            const dayDateString = day.date.toISOString().split("T")[0];
            const clickedValoracion = props.valoraciones.find((valoracion) => {
                const valoracionDateString = new Date(valoracion.fecha).toISOString().split("T")[0];
                return valoracionDateString === dayDateString;
            });
            if (clickedValoracion) {
                alert(`Valoracion: ${clickedValoracion.id_valoracion}\nEmpleado: ${clickedValoracion.id_empleado}\nCliente: ${clickedValoracion.id_cliente}`);
            }
        };

        const countValoracionesForDate = (date) => {
  return props.valoraciones.filter((valoracion) => {
    const valoracionDate = new Date(valoracion.fecha_valoracion);
    return valoracionDate.toDateString() === date.toDateString();
    // Aquí puedes añadir más condiciones si es necesario, 
    // similar a cómo lo haces en countCitasForDate.
  }).length;
};

        onMounted(async () => {
            if(calendar.value){
                await calendar.value.move(new Date());
            }
        });

        return {
            calendar,
            calendarAttributes,
            disabledDates,
            onDayClick,
        }

    }

}
 
</script>

<style scoped>

</style>
