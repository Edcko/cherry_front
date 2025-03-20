// src/composables/useEmpezarEvaluacionWizard.js
import { ref, computed, getCurrentInstance } from "vue";
import apiService from "@/services/apiServices";

export default function useEmpezarEvaluacionWizard({ clientes }) {
  if (!clientes) {
    console.error("La lista de clientes no fue pasada a useEmpezarEvaluacionWizard");
  }

  const app = getCurrentInstance();

  // Estados del wizard de evaluación
  const openStartEvaluationDialog = ref(false);
  const currentStartStep = ref(0);
  // Nuevo array de pasos con el paso de seleccionar cliente
  const evaluationSteps = [
    {
      title: "Seleccionar Cliente",
      description: "Seleccione el cliente para empezar la evaluación.",
      isSelectClient: true,
    },
    {
      title: "Medidas y Evaluación",
      description: "Ingresa la información adicional para evaluar al cliente.",
      isEvaluationForm: true,
    },
//    {
//      title: "Paquete y Cita",
//      description: "Selecciona el paquete y agenda la cita inicial.",
//    },
    {
      title: "Confirmación",
      description:
        "Revisa la información y presiona 'Comenzar Evaluación' para finalizar.",
    },
  ];

  const currentStartStepObject = computed(
    () => evaluationSteps[currentStartStep.value]
  );
  const isLastStartStep = computed(
    () => currentStartStep.value === evaluationSteps.length - 1
  );
  const progressStartValue = computed(
    () => ((currentStartStep.value + 1) / evaluationSteps.length) * 100
  );

  // Datos para la evaluación (se incluye el id_cliente)
  const evaluationData = ref({
    id_cliente: "", // Se asignará en el paso de seleccionar cliente
    motivo_bajar: "",
    cantidad_bajar: "",
    peso_actual: "",
    estatura: "",
    cintura: "",
    cadera: "",
  });

  const evaluationFormRef = ref(null);
  const formEvaluationIsValid = ref(false);

  // Función para avanzar de paso
  const handleNextStartStep = async () => {
    // Si estamos en el paso de seleccionar cliente, verificamos que se haya seleccionado un cliente
    if (currentStartStep.value === 0) {
      if (!evaluationData.value.id_cliente) {
        console.error("Seleccione un cliente");
        return;
      }
    }
    // Si estamos en el paso del formulario de evaluación, validamos el formulario
    if (currentStartStep.value === 1 && evaluationFormRef.value) {
      const valid = await evaluationFormRef.value.validate();
      if (!valid) return;
    }
    if (currentStartStep.value < evaluationSteps.length - 1) {
      currentStartStep.value++;
    }
  };

  // Retroceder de paso
  const handlePreviousStartStep = () => {
    if (currentStartStep.value > 0) {
      currentStartStep.value--;
    }
  };

  // Finalizar el proceso de evaluación y actualizar los datos del cliente
  const handleFinishStartEvaluation = async () => {
    if (evaluationFormRef.value) {
      const valid = await evaluationFormRef.value.validate();
      if (!valid) return;
    }

    // Convertimos el nombre seleccionado en el ID real
    console.log(evaluationData.value.id_cliente)
    const clienteSeleccionado = clientes.value.find(
      (c) =>
        `${c.nombre_cliente} ${c.apellido_paterno} ${c.apellido_materno}`.trim() ===
        evaluationData.value.id_cliente
    );
    evaluationData.value.id_cliente = clienteSeleccionado
      ? clienteSeleccionado.id_cliente
      : null;

    if (!evaluationData.value.id_cliente) {
      console.error("No se encontró un cliente válido.");
      return;
    }

    try {
      // Se asume que updateCliente recibe (id, data)
      await apiService.updateCliente(evaluationData.value);
      app.appContext.config.globalProperties.$showAlert(
        "La evaluación se actualizó correctamente.",
        "success"
      );
    } catch (error) {
      console.error("Error al actualizar datos de evaluación:", error);
      app.appContext.config.globalProperties.$showAlert(
        "Hubo un error al actualizar la evaluación.",
        "error"
      );
    }
    
    // Reiniciar el wizard y limpiar datos
    openStartEvaluationDialog.value = false;
    currentStartStep.value = 0;
    evaluationData.value = {
      id_cliente: "",
      motivo_bajar: "",
      cantidad_bajar: "",
      peso_actual: "",
      estatura: "",
      cintura: "",
      cadera: ""
    };
  };

  return {
    openStartEvaluationDialog,
    currentStartStep,
    evaluationSteps,
    currentStartStepObject,
    isLastStartStep,
    progressStartValue,
    evaluationData,
    evaluationFormRef,
    formEvaluationIsValid,
    handleNextStartStep,
    handlePreviousStartStep,
    handleFinishStartEvaluation,
  };
}
