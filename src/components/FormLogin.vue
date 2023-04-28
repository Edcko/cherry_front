<!-- src/components/FormLogin.vue -->
<script>
import authService from '@/services/auth';

export default {
  name: 'formulario_login',

  props: {
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  setup() {
    const email = ref('');
    const password_empleado = ref('');
    const emailError = ref(false);
    const passwordError = ref(false);

    const formValid = computed(() => {
      return (
        !emailError.value &&
        !passwordError.value &&
        email.value &&
        password_empleado.value
      );
    });

    const validateEmail = () => {
      /* ... */
    };

    const validatePassword = () => {
      /* ... */
    };

    const handleSubmit = async () => {
      if (formValid.value) {
        const user = await authService.login(email.value, password_empleado.value);
        // Comunicar al componente padre (Login.vue) que el usuario se ha autenticado con éxito
        onSubmit(user);
      }
    };

    return {
      email,
      password_empleado,
      emailError,
      passwordError,
      formValid,
      validateEmail,
      validatePassword,
      handleSubmit,
    };
  },
};
</script>
