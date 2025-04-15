import { computed } from "vue";
import { adjustDateForTimezone } from "@/utils/dateUtils";

export default function useCitasFilter(citas, search, dateFilter, clientIdFilter, newDateFilter) {
  // Si no hay fecha definida, se asigna la fecha actual.
  if (!newDateFilter.value) {
    newDateFilter.value = new Date();
  }

  // Computed que filtra las citas según los filtros activos.
  const filteredCitas = computed(() => {
    let result = citas.value;

    // Filtro por búsqueda en número de cabina
    if (search.value) {
      result = result.filter((cita) =>
        cita.Cabina.numero_cabina.toString().includes(search.value.toString())
      );
    }

    // Filtro por fecha exacta (solo si no hay filtro de cliente)
    if (dateFilter.value && !clientIdFilter.value) {
      result = result.filter(
        (cita) =>
          new Date(cita.fecha).getTime() === new Date(dateFilter.value).getTime()
      );
    }

    // Filtro por fecha específica (sin filtro de cliente)
    if (newDateFilter.value && !clientIdFilter.value) {
      result = result.filter((cita) => {
        const citaDate = new Date(cita.fecha);
        const filterDate = adjustDateForTimezone(newDateFilter.value);
        return (
          citaDate.getFullYear() === filterDate.getFullYear() &&
          citaDate.getMonth() === filterDate.getMonth() &&
          citaDate.getDate() === filterDate.getDate()
        );
      });
    }

    // Filtro por cliente (con rango de fechas: mes anterior, actual y siguiente)
    if (clientIdFilter.value) {
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);

      result = result.filter((cita) => {
        const citaDate = new Date(cita.fecha);
        const fullClientName = `${cita.Cliente.nombre_cliente} ${cita.Cliente.apellido_paterno} ${cita.Cliente.apellido_materno}`.toLowerCase();
        return (
          fullClientName.includes(clientIdFilter.value.toLowerCase()) &&
          citaDate >= startDate &&
          citaDate <= endDate
        );
      });
    }

    // Ordenar las citas según 'fecha'
    result = sortCitas(result, 'fecha');
    return result;
  });

  // Agrupar las citas filtradas por el número de cabina (memoización)
  const citasPorCabina = computed(() => {
    const grouped = {};
    filteredCitas.value.forEach((cita) => {
      const numero = cita.Cabina.numero_cabina;
      if (!grouped[numero]) {
        grouped[numero] = [];
      }
      grouped[numero].push(cita);
    });7
    return grouped;
  });

  // Función que retorna las citas de una cabina (ya agrupadas)
  const getCitasByCabina = (numeroCabina) => {
    return citasPorCabina.value[numeroCabina] || [];
  };

  return { filteredCitas, getCitasByCabina };
}

// Función para ordenar citas
const sortCitas = (citas, sortBy) => {
  if (!sortBy) return citas;
  
  // Ordenamos las citas ascendentemente según su fecha (hora incluida)
  return citas.slice().sort((a, b) => {
    const dateA = new Date(a.fecha);
    const dateB = new Date(b.fecha);
    return dateA - dateB;  // Orden ascendente: la cita con fecha menor (más temprana) aparece primero.
  });
};
