import { format } from "date-fns";
import { es } from "date-fns/locale";

export function formatDateToDayMonthYear(dateString) {
  const date = new Date(dateString);
  return format(date, "EEEE, dd/MMM/yyyy h:mm aa", { locale: es });
}
