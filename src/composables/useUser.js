import { ref } from 'vue';
import authService from '@/services/authService.js';

export default function useUser() {
    const user = ref(null);

    const loadUser = async () => {
        console.log('Loading user...');
        try{
            user.value = await authService.getUsuario();
            console.log('User loaded:', user.value);
        } catch (error) {
            console.error("Error al obtener el usuario", error);
        }
    }


    return { user, loadUser };
}
