import { ref } from 'vue';
import authService from '@/services/authService.js';

export default function useUser() {
    const user = ref(null);

    const loadUser = async () => {
        try{
        user.value = await authService.getUsuario();
        } catch (error) {
            console.error("Error al obtener el usuario", error);
        }
    }


    return { user, loadUser };
}
