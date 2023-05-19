import { format, utcToZonedTime } from "date-fns-tz";

export const formatDate = (dateString) => {
  if (!dateString) return "";
  const dateUTC = new Date(dateString);
  const dateLocal = utcToZonedTime(dateUTC, "America/Mexico_City");
  return format(dateLocal, "dd/MM/yyyy HH:mm");
};
