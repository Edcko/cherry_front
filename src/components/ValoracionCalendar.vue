<template>
    <div>
      <h1>Calendario de Evaluaciones</h1>
      <v-calendar
        :rows="1"
        ref="calendar"
        expanded
        :attributes="calendarAttributes"
        :disabled-dates="disabledDates"
        :is-dark="isDarkTheme"
      />
    </div>
  </template>
  
  <script>
  import { computed, ref, onMounted } from "vue";
  import { format } from "date-fns";
  import { es } from "date-fns/locale";
  import { useTheme } from "vuetify";
  import useValoraciones from "@/composables/useValoraciones";
  
  export default {
    name: "ValoracionCalendar",
    props: ["valoraciones"],
    setup(props) {
      const calendar = ref(null);
      const disabledDates = ref([]);
  
      const { getSundays } = useValoraciones();
      const startDate = new Date(2024, 0, 1);
      const endDate = new Date(2025, 11, 31);
  
      disabledDates.value = getSundays(startDate, endDate);
  
      const theme = useTheme();
      const isDarkTheme = computed(() => theme.global.name.value === "dark");
  
      // Generar atributos del calendario con orden explícito
      const calendarAttributes = computed(() => {
        // Ordenar las valoraciones por fecha_valoracion antes de procesarlas
        const sortedValoraciones = [...props.valoraciones].sort((a, b) => {
          return new Date(a.fecha_valoracion) - new Date(b.fecha_valoracion);
        });
  
        // Generar atributos preservando el orden
        return sortedValoraciones.map((valoracion) => {
          const fechaFormateada = format(new Date(valoracion.fecha_valoracion), "h:mm aa", {
            locale: es,
          });
  
          const valoracionesCount = countValoracionesForDate(new Date(valoracion.fecha_valoracion));
  
          return {
            key: valoracion.id_valoracion,
            dates: valoracion.fecha_valoracion,
            dot: {
              color: valoracionesCount >= 39 ? "red" : "teal",
            },
            popover: {
              label: `Valoración: ${fechaFormateada} || Cliente: ${valoracion.Cliente?.nombre_cliente ?? "Desconocido"} ${
                valoracion.Cliente?.apellido_paterno ?? ""
              } ${valoracion.Cliente?.apellido_materno ?? ""}`,
              slots: [
                {
                  content: `Empleado: ${valoracion.id_empleado}<br>Cliente: ${valoracion.Cliente?.nombre_cliente ?? "Desconocido"} ${
                    valoracion.Cliente?.apellido_paterno ?? ""
                  } ${valoracion.Cliente?.apellido_materno ?? ""} | Estado de compra: ${valoracion.estado}`,
                },
              ],
            },
          };
        });
      });
  
      const countValoracionesForDate = (date) => {
        return props.valoraciones.filter((valoracion) => {
          const valoracionDate = new Date(valoracion.fecha_valoracion);
          return valoracionDate.toDateString() === date.toDateString();
        }).length;
      };
  
      onMounted(async () => {
        if (calendar.value) {
          await calendar.value.move(new Date());
        }
      });
  
      return {
        calendar,
        calendarAttributes,
        disabledDates,
        isDarkTheme,
      };
    },
  };
  </script>
  
  <style scoped>
  h1 {
    text-align: center;
    margin-bottom: 1rem;
  }
  </style>
  