import { ref, watch } from "vue";
import useValoraciones from "@/composables/useValoraciones";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default function useValoracionesManagement() {
  // Estados para dialogs y edición
  const showDialog = ref(false);
  const deleteDialog = ref(false);
  const valoracionToDelete = ref(null);
  const valoracionAEditar = ref(null);

  // Importamos el composable de valoraciones
  const {
    valoraciones,
    filteredValoraciones,
    searchQuery,
    addValoracion,
    updateValoracion,
    deleteValoracion,
    fetchValoraciones,
  } = useValoraciones();

  // Filtrado de valoraciones según searchQuery

const searchValoraciones = () => {
  if (searchQuery.value === "") {
    filteredValoraciones.value = valoraciones.value;
  } else {
    const query = searchQuery.value.toLowerCase();
    filteredValoraciones.value = valoraciones.value.filter((val) => {
      // Buscar en el nombre del valorador
      const empleadoMatch = val.Empleado.nombre_empleado
        .toLowerCase()
        .includes(query);

      // Buscar en el nombre del cliente (nombres y apellidos)
      const clienteNombre = (val.Cliente.nombre_cliente || "").toLowerCase();
      const clienteApellidoPaterno = (val.Cliente.apellido_paterno || "").toLowerCase();
      const clienteApellidoMaterno = (val.Cliente.apellido_materno || "").toLowerCase();
      const clienteMatch =
        clienteNombre.includes(query) ||
        clienteApellidoPaterno.includes(query) ||
        clienteApellidoMaterno.includes(query);

      // Formatear la fecha para que sea "dd/MMM/yyyy" (ej. "17/feb/2025")
      let formattedDate = "";
      try {
        formattedDate = format(new Date(val.fecha_valoracion), "dd/MMM/yyyy", { locale: es }).toLowerCase();
      } catch (error) {
        console.error("Error al formatear la fecha:", error);
      }
      const fechaMatch = formattedDate.includes(query);

      return empleadoMatch || clienteMatch || fechaMatch;
    });
  }
};

  watch(searchQuery, searchValoraciones);

  // Métodos para abrir y cerrar diálogos
  const openAddDialog = () => {
    valoracionAEditar.value = null;
    showDialog.value = true;
  };

  const openDeleteDialog = (valoracion) => {
    valoracionToDelete.value = valoracion;
    deleteDialog.value = true;
  };

  const confirmDelete = () => {
    if (valoracionToDelete.value) {
      deleteValoracion(valoracionToDelete.value);
      valoracionToDelete.value = null;
    }
    deleteDialog.value = false;
  };

  const openEditDialog = (valoracion) => {
    valoracionAEditar.value = { ...valoracion };
    showDialog.value = true;
  };

  return {
    // Estados y métodos para la lista de valoraciones
    showDialog,
    deleteDialog,
    valoracionToDelete,
    valoracionAEditar,
    valoraciones,
    filteredValoraciones,
    searchQuery,
    addValoracion,
    updateValoracion,
    deleteValoracion,
    fetchValoraciones,
    searchValoraciones,
    openAddDialog,
    openDeleteDialog,
    confirmDelete,
    openEditDialog,
  };
}
