import { ref } from 'vue';
import apiService from "@/services/apiServices";
import helperServices from "@/services/helperServices.js";
import { getCurrentInstance } from 'vue';
import store from '@/store';


export default function useCitas() {
  const citas = ref([]);
  const citasTodayTomorrow = ref([]);
  const valoraciones = ref([]);
  const app = getCurrentInstance();
  const citasCountByDate = ref(new Map()); // Almacenar el conteo de citas por fecha
  const agendaCerrada = ref(true);

  const idSpa = store.getters.idSpa;
  
  const getCitasWithParams = async (param1, param2) => {
    try{
      const response = await apiService.getCitas(param1, param2);
      return response.data;
    }catch(error){
      console.error(error);
      throw new Error("Error al obtener citas");
    }
  };

  const toggleAgendaEstado = () => {
    agendaCerrada.value = !agendaCerrada.value;
    app.appContext.config.globalProperties.$showAlert(
      agendaCerrada.value
      ? "La agenda se ha cerrado temporalmente."
      : "La agenda se ha reabierto",
      "info"
    );
  };


  const getCitasCountByDate = async (idSpa, startDate, endDate) => {
    try {
      // Llamar al nuevo método getCitasCount del apiService
      const response = await apiService.getCitasCount({ idSpa, startDate, endDate });

      // Convertir la respuesta en un Map para acceso eficiente
      const countMap = new Map();
      response.forEach((item) => {
        countMap.set(item.fecha, item.count);
      });

      citasCountByDate.value = countMap; // Actualizar el estado
    } catch (error) {
      console.error("Error fetching citas count by date:", error);
      throw new Error("Error al obtener el conteo de citas.");
    }
  };
  
  

  const addCita = async (newCita) => {
    console.log("Nueva cita:", newCita);
    newCita.created_at = new Date().toISOString();
    const date = new Date(newCita.fecha);
    const minutos = date.getMinutes();
  
    // Fecha límite para agendar citas
    const fechaLimite = new Date(new Date().getFullYear() + 1, 0, 27, 23, 59, 59);
  
    if (date > fechaLimite) {
      app.appContext.config.globalProperties.$showAlert(
        "No se puede agendar citas hasta nuevo aviso",
        "error"
      );
      return;
    }
  
    if (minutos !== 0 && minutos !== 30) {
      app.appContext.config.globalProperties.$showAlert(
        "Las citas solo se pueden agendar en intervalos de media hora.",
        "error"
      );
      return;
    }
  
    if (newCita.numeroCabina !== 4 && helperServices.citaHelper.countCitasForDate(date, citas, idSpa) >= 64) {
      app.appContext.config.globalProperties.$showAlert(
        "Ya se han programado 64 citas para este día.",
        "error"
      );
      return;
    }

    console.log("Citas antes del filtro:", citas.value);
  
    // Filtrar citas disponibles
    const citasFiltradas = citas.value.filter(
      (cita) => cita.estado !== "Reagendo cita"
    );
    console.log("Citas después del filtro:", citasFiltradas);

  
    // Verifica si ya existe una cita en la misma cabina y fecha
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
        "Ya existe una cita agendada para esa fecha y número de cabina. Por favor, selecciona otra cabina y fecha 1.",
        "error"
      );
      return;
    }
  
    try {
      await apiService.addCita(newCita);
      console.log("Cita agregada correctamente.");
      citas.value = await apiService.getCitas({ idSpa: idSpa });
      app.appContext.config.globalProperties.$showAlert("La cita se agendó correctamente.", "success");
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data.message === "Ya existe una cita agendada para esa fecha y número de cabina 2."
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
      citas.value = await apiService.getCitas({idSpa: idSpa});
      app.appContext.config.globalProperties.$showAlert("La cita se eliminó correctamente.", "success");
    } catch (error) {
      console.error("Error deleting cita:", error);
      app.appContext.config.globalProperties.$showAlert("Algo salio mal al eliminar la cita.", "error");
    }
  };
  

  const countCitasForDateColor = (dateString) => {
    return citas.value.filter((cita) => {
      const citaDate = new Date(cita.fecha);
      return citaDate.toDateString() === new Date(dateString).toDateString();
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
    'Adeudo',];
    const currentIndex = estados.indexOf(cita.estado);
    const newEstado = estados[(currentIndex + 1) % estados.length];
    cita.estado = newEstado;
    await updateCita(cita);
  };

  const getSundays = (start, end) =>{
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
  }

    const getHorasLibres = (citasDelDia, numeroCabina) => {
    let horasTrabajo;

     // Si es la cabina 4, ajustamos las horas de trabajo de 13:00 a 17:00 (01:00 pm a 05:00 pm)
  if (numeroCabina === 4) {
    horasTrabajo = ["13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
  } else {
    // Horarios estándar para otras cabinas
    horasTrabajo = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
  }

  // Filtrar citas que no sean "Reagendo cita" para calcular horas ocupadas
  const horasOcupadas = citasDelDia
  .filter((cita) => cita.estado !== "Reagendo cita") // Excluir "Reagendo cita" de las horas ocupadas
  .map((cita) => {
    const date = new Date(cita.fecha);
    return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  });

// Retornar horas disponibles
return horasTrabajo.filter((hora) => !horasOcupadas.includes(hora));
  };
  
  


  return { citas, agendaCerrada, citasTodayTomorrow, valoraciones,  citasCountByDate, getCitasCountByDate, getCitasWithParams, toggleAgendaEstado, addCita, updateCita, deleteCita, countCitasForDateColor, changeEstado, getSundays, getHorasLibres };
}
