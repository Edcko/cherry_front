import { ref, watch } from "vue";
import { adjustDateForTimezone } from "@/utils/dateUtils";

const initialDate = new Date();

export default function useCitasFilter(citas, search, dateFilter, clientIdFilter, newDateFilter) {
  const filteredCitas = ref([]);

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
      if(dateA < today) {
        return 1;
      }
      if(dateB < today) {
        return -1;
      }

      return dateA - dateB;
    }

    return 0;
  });
};