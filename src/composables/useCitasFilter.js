//import { computed } from "vue";
//import { formatDate } from "@/utils/dateUtils";
//import { compareAsc } from "date-fns";
import { ref, watch } from "vue";

export default function useCitasFilter(citas, search, dateFilter, clientIdFilter) {
  const filteredCitas = ref([]);

  watch(
    [citas, search, dateFilter, clientIdFilter],
    () => {
      let result = citas.value;
  
      if (search.value) {
        result = result.filter((cita) =>
          cita.id_cita.toString().includes(search.value.toString())
        );
      }
  
      if (dateFilter.value) {
        result = result.filter(
          (cita) =>
            new Date(cita.fecha).toDateString() ===
            new Date(dateFilter.value).toDateString()
        );
      }
  
      if (clientIdFilter.value) {
        result = result.filter((cita) =>
          cita.id_cliente.toString().includes(clientIdFilter.value.toString())
        );
      }
  
      // Agrega esta línea para ordenar las citas antes de asignarlas a filteredCitas
      result = sortCitas(result, 'fecha');
  
      filteredCitas.value = result;
    },
    { immediate: true }
  );


const getCitasByCabina = (cabinaId) => {
  return filteredCitas.value.filter(cita => cita.id_cabina === cabinaId);
};

return { filteredCitas, getCitasByCabina };

}


const sortCitas = (citas, sortBy) => {
  if (!sortBy) {
    return citas;
  }

  return citas.slice().sort((a, b) => {
    if (sortBy === 'id_cita') {
      return a.id_cita - b.id_cita;
    } else if (sortBy === 'fecha') {
      return new Date(a.fecha) - new Date(b.fecha);
    }
    return 0;
  });
};

