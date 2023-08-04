const citaHelper = {

     countCitasForDate: (date, citas) => {
        return citas.value.filter(cita => {
          const citaDate = new Date(cita.fecha);
          return citaDate.toDateString() === date.toDateString() && cita.estado !== 'Cancelado';
        }).length;
      },

};

const clienteHelper = {

  formatearFecha: (fechaNacimiento) => {
    let fecha = new Date(`${fechaNacimiento}T00:00`);
    let dia = String(fecha.getDate()).padStart(2, '0');
    let mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    let ano = fecha.getFullYear();
    return `${dia}/${mes}/${ano}`;

},

};

const empleadoHelper = {

  formatearFecha: (fechaNacimiento) => {
    let fecha = new Date(`${fechaNacimiento}T00:00`);
    let dia = String(fecha.getDate()).padStart(2, '0');
    let mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    let ano = fecha.getFullYear();
    return `${dia}/${mes}/${ano}`;
  },
};

const paqueteHelper = {
  
  formatearFecha: (fechaNacimiento) => {
    let fecha = new Date(`${fechaNacimiento}T00:00`);
    let dia = String(fecha.getDate()).padStart(2, '0');
    let mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
    let ano = fecha.getFullYear();
    return `${dia}/${mes}/${ano}`;
  },

}


export default{
  citaHelper,
  clienteHelper,
  empleadoHelper,
  paqueteHelper,
};