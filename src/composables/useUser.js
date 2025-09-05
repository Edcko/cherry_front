import { ref, onMounted } from 'vue';
import authService from '@/services/authService.js';
import store from '@/store/index.js';
import router from '@/router/index.js';
import useGlobalAlert from '@/composables/useGlobalAlert.js';

export default function useUser() {
    const user = ref(null);
    const isLoading = ref(false);
    const { showAlert } = useGlobalAlert();

    const loadUser = async () => {
        console.log('Loading user...');
        isLoading.value = true;
        
        try {
            // Verificar si hay un token en localStorage
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                console.log('No hay usuario almacenado');
                user.value = null;
                return;
            }

            const parsedUser = JSON.parse(storedUser);
            
            // Validar el token llamando a la API
            try {
                const apiUser = await authService.getUsuario();
                user.value = apiUser;
                console.log('User updated from API:', user.value);
            } catch (apiError) {
                console.error("Error al validar token:", apiError);
                
                // Si el token es inválido (401), limpiar localStorage y redirigir
                if (apiError.response && apiError.response.status === 401) {
                    console.log('Token expirado, limpiando sesión...');
                    localStorage.removeItem('user');
                    user.value = null;
                    store.dispatch('logout');
                    router.push('/login');
                    showAlert('Tu sesión ha expirado. Por favor, inicia sesión de nuevo.', 'error');
                    return;
                }
                
                // Para otros errores, usar los datos del localStorage como fallback
                user.value = parsedUser;
                console.log('Using localStorage data as fallback:', user.value);
            }
        } catch (error) {
            console.error("Error al cargar usuario:", error);
            user.value = null;
        } finally {
            isLoading.value = false;
        }
    }

    // Cargar usuario automáticamente al crear el composable
    onMounted(() => {
        loadUser();
    });

    return { user, loadUser, isLoading };
}
