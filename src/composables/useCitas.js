import { ref } from 'vue';
import apiService from "@/services/apiServices";
import citaHelper from "@/services/helperServices";
import { getCurrentInstance } from 'vue';

export default function useCitas() {
  const citas = ref([]);
  const app = getCurrentInstance();

  const addCita = async (newCita) => {
    newCita.created_at = new Date().toISOString();
    const date = new Date(newCita.fecha);
    if (citaHelper.countCitasForDate(date, citas) >= 38) {
      app.appContext.config.globalProperties.$showAlert("Ya se han programado 38 citas para este día.", "error");
      return;
    }
    try {
      await apiService.addCita(newCita);
      citas.value = await apiService.getCitas();
      app.appContext.config.globalProperties.$showAlert("La cita se agendó correctamente.", "success");
    } catch (error) {
      console.error(error);
      app.appContext.config.globalProperties.$showAlert("Hubo un error al crear la cita.", "error");
    }
  };

  const updateCita = async (cita) => {
    try {
      await apiService.updateCita(cita);
      citas.value = await apiService.getCitas();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteCita = async (cita) => {
    try {
      await apiService.deleteCita(cita.id_cita);
      app.appContext.config.globalProperties.$showAlert("La cita se eliminó correctamente.", "success");
    } catch (error) {
      console.error("Error deleting cita:", error);
    }
    
    try {
      citas.value = await apiService.getCitas();
    } catch (error) {
      console.error("Error getting citas:", error);
    }
  };
  

  const countCitasForDateColor = (dateString) => {
    return citas.value.filter((cita) => {
      const citaDate = new Date(cita.fecha);
      return citaDate.toDateString() === new Date(dateString).toDateString();
    }).length;
  };

  

  const changeEstado = async (cita) => {
    const estados = ["Programado", "Realizado", "Adeudo", "Cita perdida", "Reagendo", "Cancelado"];
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
  


  return { citas, addCita, updateCita, deleteCita, countCitasForDateColor, changeEstado, getSundays };
}
