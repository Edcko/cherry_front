import { format, utcToZonedTime } from "date-fns-tz";

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const dateUTC = new Date(dateString);
  const dateLocal = utcToZonedTime(dateUTC, "America/Mexico_City");
  return format(dateLocal, "dd/MM/yyyy HH:mm");
};

//función de formatearFecha 
export const formatearFecha = (fechaNacimiento) => {
  let fecha = new Date(`${fechaNacimiento}T00:00`);
  let dia = String(fecha.getDate()).padStart(2, '0');
  let mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
  let ano = fecha.getFullYear();
  return `${dia}/${mes}/${ano}`;
};