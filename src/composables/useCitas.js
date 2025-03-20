import { ref } from 'vue';
import apiService from "@/services/apiServices";
//import helperServices from "@/services/helperServices.js";
import { getCurrentInstance } from 'vue';
import store from '@/store';

export default function useCitas() {
  const app = getCurrentInstance();

  // === ESTADOS REACTIVOS PRINCIPALES ===
  const citas = ref([]);
  const citasTodayTomorrow = ref([]);
  const valoraciones = ref([]);
  const citasCountByDate = ref(new Map()); 
  const estadoAgenda = ref(false);

  // Fecha de apertura obtenida desde backend
  const fechaApertura = ref(null);

  // ID del SPA actual
  const idSpa = store.getters.idSpa;

  // === OBTENER & ACTUALIZAR ESTADO AGENDA ===
  const fecthEstadoAgenda = async () => {
    try {
      const response = await apiService.getEstadoAgenda(idSpa);
      if (response && response.estado !== undefined) {
        estadoAgenda.value = response.estado === "true"; 
      } else {
        console.error("Respuesta inesperada al obtener el estado de la agenda:", response);
      }
    } catch (error) {
      console.error("Error al obtener el estado de la agenda:", error);
    }
  };

  const toggleAgendaEstado = async () => {
    try {
      const nuevoEstado = !estadoAgenda.value;
      const response = await apiService.updateEstadoAgenda(nuevoEstado, idSpa);
      if (response && response.message) {
        // Sincronizar con el backend
        await fecthEstadoAgenda();
        app.appContext.config.globalProperties.$showAlert(
          nuevoEstado
            ? "La agenda se ha reabierto"
            : "La agenda se ha cerrado temporalmente.",
          "info"
        );
      } else {
        console.error("Respuesta inesperada al actualizar el estado de la agenda:", response);
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la agenda:", error);
      app.appContext.config.globalProperties.$showAlert(
        "Error al actualizar el estado de la agenda.",
        "error"
      );
    }
  };

  // === OBTENER & ACTUALIZAR FECHA DE APERTURA ===
  const fetchFechaApertura = async () => {
    try {
      const response = await apiService.getFechaApertura(idSpa);
      if (response.fecha_apertura) {
        // Guardamos la fecha en formato YYYY-MM-DD
        fechaApertura.value = new Date(response.fecha_apertura).toISOString().split("T")[0];
      }
    } catch (error) {
      console.error("Error al obtener la fecha de apertura:", error);
    }
  };

  const updateFechaApertura = async (nuevaFecha) => {
    // Asegurarnos de formatear la fecha a YYYY-MM-DD para cumplir con el backend
    const fechaFormateada = nuevaFecha.toISOString().split("T")[0]; 
    console.log("Fecha formateada y idSpa:", fechaFormateada, idSpa);

    try {
      const response = await apiService.updateFechaApertura(fechaFormateada, idSpa);

      // Verificamos que el backend devuelva un objeto con `configuracion`
      if (response.configuracion) {
        fechaApertura.value = nuevaFecha;  // Actualizamos estado local
        app.appContext.config.globalProperties.$showAlert(
          "La fecha de apertura ha sido actualizada correctamente.",
          "success"
        );
      } else {
        console.error("Respuesta inesperada al actualizar la fecha de apertura:", response);
      }
    } catch (error) {
      console.error("Error al actualizar la fecha de apertura:", error);
      throw new Error("No se pudo actualizar la fecha de apertura.");
    }
  };

  // === OBTENER EL CONTEO DE CITAS POR FECHA ===
  const getCitasCountByDate = async (idSpa, startDate, endDate) => {
    try {
      const response = await apiService.getCitasCount({ idSpa, startDate, endDate });
      // Convertir la respuesta en un Map
      const countMap = new Map();
      response.forEach((item) => {
        countMap.set(item.fecha, item.count);
      });
      citasCountByDate.value = countMap;
    } catch (error) {
      console.error("Error fetching citas count by date:", error);
      throw new Error("Error al obtener el conteo de citas.");
    }
  };

    // === LÓGICA PARA CREAR/ACTUALIZAR/ELIMINAR CITAS ===
  const addCita = async (newCita) => {
    console.log("Nueva cita:", newCita);
    newCita.created_at = new Date().toISOString();
    const date = new Date(newCita.fecha);
    const minutos = date.getMinutes();
  
    try {
      // Validar si la agenda está cerrada
      if (!estadoAgenda.value) {
        app.appContext.config.globalProperties.$showAlert(
          "La agenda está cerrada temporalmente.",
          "error"
        );
        return;
      }
  
          // Fecha límite para agendar citas
    //const fechaLimite = new Date(2025, 1, 1, 23, 59, 59); // 27 de enero de 2025
  
    if (date > new Date(fechaApertura.value)) {
      app.appContext.config.globalProperties.$showAlert(
        " La agenda estará cerrada a partir del 1 de febrero de 2025. No se aceptarán nuevas citas después de esta fecha.",
        "error"
      );
      return;
    }
      // Validación de minutos (solo en intervalos de 30 minutos)
      if (minutos !== 0 && minutos !== 30) {
        app.appContext.config.globalProperties.$showAlert(
          "Las citas solo se pueden agendar en intervalos de media hora.",
          "error"
        );
        return;
      }
  
      /* Validación de límite de citas por día (64 máximo, excepto para cabina 4)
      if (
        newCita.numeroCabina !== 4 &&
        helperServices.citaHelper.countCitasForDate(date, citas, idSpa) >= 64
      ) {
        app.appContext.config.globalProperties.$showAlert(
          "Ya se han programado 64 citas para este día.",
          "error"
        );
        return;
      }
      */
  
      console.log("Citas antes del filtro:", citas.value);
  
      // Filtrar citas disponibles
      const citasFiltradas = citas.value.filter(
        (cita) => cita.estado !== "Reagendo cita"
      );
      console.log("Citas después del filtro:", citasFiltradas);
  
      // Validar si ya existe una cita en la misma cabina y fecha
      const citaExistente = citasFiltradas.some((cita) => {
        const citaDate = new Date(cita.fecha);
        return (
          cita.Cabina.numero_cabina === newCita.numeroCabina &&
          citaDate.getTime() === date.getTime()
        );
      });
  
      console.log("¿Existe ya una cita en la misma cabina y horario?:", citaExistente);
  
      if (citaExistente) {
        app.appContext.config.globalProperties.$showAlert(
          "Ya existe una cita agendada para esa fecha y número de cabina. Por favor, selecciona otra cabina y fecha.",
          "error"
        );
        return;
      }
  
      // Crear la nueva cita
      await apiService.addCita(newCita);

      // Definir el rango de una semana a partir de hoy
      const currentDate = new Date();
      const startDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      const endDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() + 15
      );
      const format = (date) => date.toISOString().split("T")[0];
      
      // Solicitar solo las citas dentro de ese rango
      citas.value = await apiService.getCitas({
        idSpa: idSpa,
        startDate: format(startDate),
        endDate: format(endDate)
      });
      
      app.appContext.config.globalProperties.$showAlert(
        "La cita se agendó correctamente.",
        "success"
      );
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message ===
          "Ya existe una cita agendada para esa fecha y número de cabina."
      ) {
        app.appContext.config.globalProperties.$showAlert(
          "Ya existe una cita agendada para esa fecha y número de cabina. Por favor, selecciona otra cabina y fecha.",
          "error"
        );
      } else {
        app.appContext.config.globalProperties.$showAlert(
          "Ha ocurrido un error al agregar la cita.",
          "error"
        );
      }
      console.error(error);
    }
  };  

  const updateCita = async (cita) => {
    try {
      await apiService.updateCita(cita);
 //     citas.value = await apiService.getCitas();
      app.appContext.config.globalProperties.$showAlert("La cita se actualizo correctamente.", "success");
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert("La actualizacion de cita salio mal.", "error");
    }
  };

  const deleteCita = async (cita) => {
    try {
      await apiService.deleteCita(cita.id_cita);
      // Eliminación parcial en el front-end
const index = citas.value.findIndex((c) => c.id_cita === cita.id_cita);
if (index !== -1) {
  citas.value.splice(index, 1);
}     
  //citas.value = await apiService.getCitas({idSpa: idSpa});
      app.appContext.config.globalProperties.$showAlert("La cita se eliminó correctamente.", "success");
    } catch (error) {
      console.error("Error deleting cita:", error);
      app.appContext.config.globalProperties.$showAlert("Algo salio mal al eliminar la cita.", "error");
    }
  };
  
 // === OTRAS UTILIDADES ===
const countCitasForDateColor = (dateString) => {
  return citas.value.filter((cita) => {
    const citaDate = new Date(cita.fecha);
    return (
      citaDate.toDateString() === new Date(dateString).toDateString()
    );
  }).length;
};

const changeEstado = async (cita) => {
  const estados = [
    'Por confirmar',
    'Cita programada',
    'Cita realizada',
    'Cita perdida',
    'Cita cancelada',
    'Reagendo cita',
    'Adeudo',
  ];
  const currentIndex = estados.indexOf(cita.estado);
  const newEstado = estados[(currentIndex + 1) % estados.length];
  cita.estado = newEstado;
  await updateCita(cita);
};

const getSundays = (start, end) => {
  let date = new Date(start);
  let sundays = [];

  // Avanza hasta el primer domingo
  while (date.getDay() !== 0) {
    date.setDate(date.getDate() + 1);
  }
  // Agrega todos los domingos hasta la fecha de finalización
  while (date <= end) {
    sundays.push(new Date(date));
    date.setDate(date.getDate() + 7);
  }
  return sundays;
};

const getHorasLibres = (citasDelDia, numeroCabina) => {
  // Cabina 4: 13:00 a 17:00
  let horasTrabajo;
  if (numeroCabina === 4) {
    horasTrabajo = [
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "15:00",
      "15:30",
      "16:00",
      "16:30",
      "17:00"
    ];
  } else {
    // Horarios estándar para otras cabinas
    horasTrabajo = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00"
    ];
  }
  // Filtrar citas que no sean "Reagendo cita"
  const horasOcupadas = citasDelDia
    .filter((cita) => cita.estado !== "Reagendo cita")
    .map((cita) => {
      const date = new Date(cita.fecha);
      return `${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    });

  return horasTrabajo.filter((hora) => !horasOcupadas.includes(hora));
};

// === DEVOLVEMOS LAS PROPIEDADES Y MÉTODOS QUE USARÁN TUS COMPONENTES ===
return {
  // Estados
  citas,
  citasTodayTomorrow,
  valoraciones,
  citasCountByDate,
  estadoAgenda,
  fechaApertura,

  // Métodos de Agenda
  fecthEstadoAgenda,
  toggleAgendaEstado,

  // Métodos de Fecha Apertura
  fetchFechaApertura,
  updateFechaApertura,

  // Métodos para Citas
  addCita,
  updateCita,
  deleteCita,

  // Funciones Auxiliares
  countCitasForDateColor,
  changeEstado,
  getSundays,
  getHorasLibres,
  getCitasCountByDate,
};
}