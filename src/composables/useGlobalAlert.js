// src/composables/useGlobalAlert.js
import { ref } from 'vue';

const showGlobalAlert = ref(false);
const globalAlertMessage = ref('');
const globalAlertType = ref('error');

const showAlert = (message, type = 'error') => {
  globalAlertMessage.value = message;
  globalAlertType.value = type;
  showGlobalAlert.value = true;

 // Si deseas ocultar la alerta automáticamente después de un tiempo, puedes agregar un temporizador aquí
 setTimeout(() => {
    showGlobalAlert.value = false;
  }, 5000); // Oculta la alerta después de 5 segundos

};

const hideAlert = () => {
  showGlobalAlert.value = false;
};

export default function useGlobalAlert() {
  return {
    showGlobalAlert,
    globalAlertMessage,
    globalAlertType,
    showAlert,
    hideAlert,
  };
}
