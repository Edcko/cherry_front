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
  
      // Filtro por cabina (sin cambios)
      if (search.value) {
        result = result.filter((cita) =>
          cita.Cabina.numero_cabina.toString().includes(search.value.toString())
        );
      }
  
      // Filtro por fecha exacta (solo si no hay filtro de cliente activo)
      if (dateFilter.value && !clientIdFilter.value) {
        result = result.filter(
          (cita) =>
            new Date(cita.fecha).getTime() ===
            new Date(dateFilter.value).getTime()
        );
      }
  
      // Filtro por fecha específica (mantener si no hay filtro de cliente)
      if (newDateFilter.value && !clientIdFilter.value) {
        result = result.filter((cita) => {
            const citaDate = new Date(cita.fecha);
            const filterDate = adjustDateForTimezone(newDateFilter.value);
            return citaDate.getFullYear() === filterDate.getFullYear() &&
                    citaDate.getMonth() === filterDate.getMonth() &&
                    citaDate.getDate() === filterDate.getDate();
        });
      }

      // Filtro por cliente con rango de fechas (mes anterior, actual y siguiente)
      if (clientIdFilter.value) {
        const now = new Date();
        
        // Calcular el primer día del mes anterior
        const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        
        // Calcular el último día del mes siguiente
        const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0);

        result = result.filter((cita) => {
          const citaDate = new Date(cita.fecha);
          const fullClientName = `${cita.Cliente.nombre_cliente} ${cita.Cliente.apellido_paterno} ${cita.Cliente.apellido_materno}`.toLowerCase();
          
          // Filtro por cliente y por rango de fechas (mes anterior, actual y posterior)
          return fullClientName.includes(clientIdFilter.value.toLowerCase()) &&
                citaDate >= startDate && citaDate <= endDate;
        });
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

// Función para ordenar citas (sin cambios)
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
