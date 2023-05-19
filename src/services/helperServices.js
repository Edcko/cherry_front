const citaHelper = {

     countCitasForDate: (date, citas) => {
        return citas.value.filter(cita => {
          const citaDate = new Date(cita.fecha);
          return citaDate.toDateString() === date.toDateString() && cita.estado !== 'Cancelado';
        }).length;
      },

};


export default citaHelper