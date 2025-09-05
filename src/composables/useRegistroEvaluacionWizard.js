// src/composables/useRegistroEvaluacionWizard.js
import { ref, computed, onMounted } from "vue";
import apiService from "@/services/apiServices";
import store from "@/store";
import useClientes from "@/composables/useClientes";

export default function useRegistroEvaluacionWizard({ addValoracion }) {
  // Estados del wizard
  const openMultiStepDialog = ref(false);
  const currentStep = ref(0);
  const valoracion = ref({
    fecha_valoracion: "",
    id_cliente: "",
    id_empleado: "",
    estado: "Por confirmar",
    id_spa: store.getters.idSpa,
  });
  const clientes = ref([]);
  const empleados = ref([]);
  const rules = { required: (v) => !!v || "Este campo es requerido" };
  const valoracionFormRef = ref(null);
  const formValoracionIsValid = ref(false);
  const posibleClienteForm = ref(null);

  // Opciones para selects de clientes y empleados
  const clienteOptions = computed(() =>
    clientes.value.map((c) => {
      const nombre = c.nombre_cliente || "";
      const aPat = c.apellido_paterno || "";
      const aMat = c.apellido_materno || "";
      return `${nombre} ${aPat} ${aMat}`.trim();
    })
  );
  const empleadoOptions = computed(() =>
    empleados.value.map((e) => {
      const nombre = e.nombre_empleado || "";
      const aPat = e.apellido_paterno || "";
      const aMat = e.apellido_materno || "";
      return `${nombre} ${aPat} ${aMat}`.trim();
    })
  );

  // Cargar clientes y empleados al montar el componente
  onMounted(async () => {
    try {
      clientes.value = await apiService.getClientes({ idSpa: store.getters.idSpa });
      empleados.value = await apiService.getEmpleadosByCurrentSpa();
    } catch (error) {
      console.error("Error al cargar clientes/empleados:", error);
    }
  });

  // Definición de los pasos del wizard
  const steps = [
    {
      title: "Bienvenido al agendamiento de evaluación",
      description:
        "Por favor, lea atentamente las instrucciones para registrar al posible cliente y agendar la evaluación.",
    },
    {
      title: "Alta de posible cliente",
      description:
        "Si el paciente no está registrado, ingrese sus datos a continuación. Si ya está en el sistema, presione 'Registrar Posible Cliente'.",
      isPosibleClienteStep: true,
    },
    {
      title: "Agendar Evaluación",
      description: "Complete los campos requeridos para agendar la evaluación.",
      isValoracionForm: true,
    },
    {
      title: "Confirmación",
      description:
        "Ha completado el proceso. Presione 'Registrar Evaluación' para finalizar el agendamiento.",
    },
  ];

  const currentStepObject = computed(() => steps[currentStep.value]);
  const isLastStep = computed(() => currentStep.value === steps.length - 1);
  const progressValue = computed(
    () => ((currentStep.value + 1) / steps.length) * 100
  );

  const { addCliente } = useClientes();

  // Avanzar al siguiente paso
  const handleNextStep = async () => {
    if (currentStepObject.value.isValoracionForm) {
      const formEl = valoracionFormRef.value;
      if (formEl) {
        const valid = await formEl.validate();
        if (!valid) return;
      }
    }
    if (currentStep.value < steps.length - 1) {
      currentStep.value++;
    }
  };

  // Retroceder al paso anterior
  const handlePrevious = () => {
    if (currentStep.value > 0) currentStep.value--;
  };

  // Manejo del alta del posible cliente
  const handleAddPosibleCliente = async (nuevoCliente) => {
    await addCliente(nuevoCliente);
    try {
      clientes.value = await apiService.getClientes({ idSpa: store.getters.idSpa });
    } catch (error) {
      console.error("Error al actualizar lista de clientes:", error);
    }
  };

  const handleClosePosibleCliente = () => { };

  const handleSavePosibleCliente = async () => {
    if (posibleClienteForm.value && posibleClienteForm.value.saveCliente) {
      const nuevoCliente = await posibleClienteForm.value.saveCliente();
      if (nuevoCliente) {
        await handleAddPosibleCliente(nuevoCliente);
        currentStep.value++;
      }
    } else {
      console.error(
        "El componente PosibleClienteDialog no expone el método saveCliente."
      );
    }
  };

  // Finalizar el wizard: registrar evaluación
  const handleFinish = () => {
    const clienteSeleccionado = clientes.value.find(
      (c) =>
        `${c.nombre_cliente} ${c.apellido_paterno} ${c.apellido_materno}`.trim() ===
        valoracion.value.id_cliente
    );
    valoracion.value.id_cliente = clienteSeleccionado
      ? clienteSeleccionado.id_cliente
      : null;
    const empleadoSeleccionado = empleados.value.find(
      (e) =>
        `${e.nombre_empleado} ${e.apellido_paterno} ${e.apellido_materno}`.trim() ===
        valoracion.value.id_empleado
    );
    valoracion.value.id_empleado = empleadoSeleccionado
      ? empleadoSeleccionado.id_empleado
      : null;
    // Usamos la función inyectada
    addValoracion(valoracion.value);
    openMultiStepDialog.value = false;
    currentStep.value = 0;
    valoracion.value = {
      fecha_valoracion: "",
      id_cliente: "",
      id_empleado: "",
      estado: "Por confirmar",
      id_spa: store.getters.idSpa,
    };
  };

  return {
    openMultiStepDialog,
    currentStep,
    steps,
    currentStepObject,
    isLastStep,
    progressValue,
    valoracion,
    valoracionFormRef,
    formValoracionIsValid,
    rules,
    clientes,
    empleados,
    clienteOptions,
    empleadoOptions,
    posibleClienteForm,
    handleNextStep,
    handlePrevious,
    handleAddPosibleCliente,
    handleClosePosibleCliente,
    handleSavePosibleCliente,
    handleFinish,
  };
}
