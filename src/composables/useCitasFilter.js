import { ref, watch } from "vue";
import { adjustDateForTimezone } from "@/utils/dateUtils";

const initialDate = new Date();
export default function useCitasFilter(citas, search, dateFilter, clientIdFilter, newDateFilter) {
  const filteredCitas = ref([]);

  // Si newDateFilter no tiene valor cuando se inicializa, le asignamos la fecha actual
  if (!newDateFilter.value) {
    newDateFilter.value = initialDate;
  }

  watch(
    [citas, search, dateFilter, clientIdFilter, newDateFilter],
    () => {
      let result = citas.value;
  
      if (search.value) {
        result = result.filter((cita) =>
          cita.Cabina.numero_cabina.toString().includes(search.value.toString())
        );
      }
  
      if (dateFilter.value) {
        result = result.filter(
          (cita) =>
            new Date(cita.fecha).getTime() ===
            new Date(dateFilter.value).getTime()
        );
      }
  
      // Utilizamos newDateFilter para filtrar las citas
      if (newDateFilter.value) {
        result = result.filter((cita) => {
            const citaDate = new Date(cita.fecha);
            const filterDate = adjustDateForTimezone(newDateFilter.value);
            return citaDate.getFullYear() === filterDate.getFullYear() &&
                   citaDate.getMonth() === filterDate.getMonth() &&
                   citaDate.getDate() === filterDate.getDate();
        });
      }

      if (clientIdFilter.value) {
        result = result.filter((cita) =>
          `${cita.Cliente.nombre_cliente} ${cita.Cliente.apellido_paterno} ${cita.Cliente.apellido_materno}`.toLowerCase().includes(clientIdFilter.value.toLowerCase())
        );
      }

      // Ordenamos las citas antes de asignarlas a filteredCitas
      result = sortCitas(result, 'fecha');
  
      filteredCitas.value = result;
    },
    { immediate: true }
  );

  const getCitasByCabina = (numeroCabina) => {
    return filteredCitas.value.filter(cita => cita.Cabina.numero_cabina === numeroCabina);
  };
  

  return { filteredCitas, getCitasByCabina };
}

const sortCitas = (citas, sortBy) => {
  if (!sortBy) {
    return citas;
  }

  const today = new Date();

  return citas.slice().sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);

    if (dateA.getTime() === today.getTime() && dateB.getTime() !== today.getTime()) {
      return -1;
    } else if (dateA.getTime() !== today.getTime() && dateB.getTime() === today.getTime()) {
      return 1;
    }

    if (sortBy === 'id_cita') {
      return a.id_cita - b.id_cita;
    } else if (sortBy === 'fecha') {
      // Sólo queremos considerar citas futuras, así que si alguna cita es de una fecha pasada,
      // la ponemos al final.
      if(dateA < today) {
        return 1;
      }
      if(dateB < today) {
        return -1;
      }

      // Para las citas futuras, hacemos una comparación normal para obtener un orden ascendente.
      return dateA - dateB;
    }

    return 0;
  });
};
