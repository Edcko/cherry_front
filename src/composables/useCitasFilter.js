import { ref, watch } from "vue";

export default function useCitasFilter(citas, search, dateFilter, clientIdFilter) {
  const filteredCitas = ref([]);

  watch(
    [citas, search, dateFilter, clientIdFilter],
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
  
      if (clientIdFilter.value) {
        result = result.filter((cita) =>
        `${cita.Cliente.nombre_cliente} ${cita.Cliente.apellido_paterno} ${cita.Cliente.apellido_materno}`.toLowerCase().includes(clientIdFilter.value.toLowerCase())
        );
      }
  
      // Agrega esta línea para ordenar las citas antes de asignarlas a filteredCitas
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

const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

const sortCitas = (citas, sortBy) => {
  if (!sortBy) {
    return citas;
  }

  const today = new Date();

  return citas.slice().sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);

    if (isToday(dateA) && !isToday(dateB)) {
      return -1;
    } else if (!isToday(dateA) && isToday(dateB)) {
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
