import { computed } from "vue";
// import { adjustDateForTimezone } from "@/utils/dateUtils";  // ya no lo necesitamos

export default function useCitasFilter(citas, search, dateFilter, clientIdFilter, newDateFilter) {
  // 1) Inicializar newDateFilter a medianoche de hoy solo una vez
  if (newDateFilter && !newDateFilter.value) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    newDateFilter.value = today;
  }

  const filteredCitas = computed(() => {
    // Validar que citas.value existe y es un array
    if (!citas.value || !Array.isArray(citas.value)) {
      return [];
    }
    
    let result = citas.value.slice();
    console.log(`useCitasFilter: Total citas iniciales: ${result.length}`);

    // 2) filtro por número de cabina
    if (search.value) {
      result = result.filter(c =>
        c && c.Cabina && c.Cabina.numero_cabina && 
        c.Cabina.numero_cabina.toString().includes(search.value)
      );
      console.log(`useCitasFilter: Después de filtro por búsqueda: ${result.length}`);
    }

   // 3) filtro unificado por fecha (solo si no buscás por cliente)
   if (!clientIdFilter.value && newDateFilter && newDateFilter.value) {
     // normalizamos a medianoche
     const filterDate = new Date(newDateFilter.value);
     filterDate.setHours(0, 0, 0, 0);
     console.log(`useCitasFilter: Filtrando por fecha: ${filterDate.toISOString()}`);
     
     result = result.filter(cita => {
       if (!cita || !cita.fecha) return false;
       const cd = new Date(cita.fecha);
       const matches = (
         cd.getFullYear() === filterDate.getFullYear() &&
         cd.getMonth()    === filterDate.getMonth()    &&
         cd.getDate()     === filterDate.getDate()
       );
       return matches;
     });
     console.log(`useCitasFilter: Después de filtro por fecha: ${result.length}`);
   }

    // 4) filtro por cliente (si aplica)
    if (clientIdFilter.value) {
      const now       = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endDate   = new Date(now.getFullYear(), now.getMonth() + 2, 0);

      result = result.filter(cita => {
        if (!cita || !cita.fecha || !cita.Cliente) return false;
        const cd = new Date(cita.fecha);
        const fullName = `${cita.Cliente.nombre_cliente || ''} ${cita.Cliente.apellido_paterno || ''} ${cita.Cliente.apellido_materno || ''}`.toLowerCase();
        return (
          fullName.includes(clientIdFilter.value.toLowerCase()) &&
          cd >= startDate &&
          cd <= endDate
        );
      });
    }

    // 5) ordenar ascendente
    return result.slice().sort((a, b) => {
      if (!a || !b || !a.fecha || !b.fecha) return 0;
      return new Date(a.fecha) - new Date(b.fecha);
    });
  });

  const citasPorCabina = computed(() => {
    const grouped = {};
    if (!filteredCitas.value || !Array.isArray(filteredCitas.value)) {
      return grouped;
    }
    
    // Reducir los console.log para mejorar el rendimiento
    // console.log(`useCitasFilter: Total citas filtradas: ${filteredCitas.value.length}`);
    
    filteredCitas.value.forEach(cita => {
      if (!cita || !cita.Cabina || !cita.Cabina.numero_cabina) {
        // console.log('Cita sin cabina válida:', cita);
        return;
      }
      const numero = cita.Cabina.numero_cabina;
      // console.log(`Agrupando cita ${cita.id_cita} en cabina ${numero}`);
      if (!grouped[numero]) grouped[numero] = [];
      grouped[numero].push(cita);
    });
    
    // console.log('Citas agrupadas por cabina:', Object.keys(grouped).map(k => `${k}: ${grouped[k].length}`));
    return grouped;
  });

  const getCitasByCabina = numeroCabina => {
    const result = citasPorCabina.value[numeroCabina] || [];
    // console.log(`useCitasFilter: getCitasByCabina(${numeroCabina}) = ${result.length} citas`);
    return result;
  };

  return { filteredCitas, getCitasByCabina };
}
