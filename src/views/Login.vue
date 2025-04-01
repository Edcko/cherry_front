<template>
  <div class="shape-container">
    <!-- Video de fondo -->
    <video autoplay muted loop playsinline id="bg-video">
      <source :src="videoBackground" type="video/mp4" />
    </video>

    <!-- Contenedor personalizado para el login -->
    <div class="login-content">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4" lg="3">
            <v-card class="pa-8 pb-6 transparent-card" elevation="8" max-width="448" rounded="lg">
              <v-img
                class="mx-auto my-4"
                max-width="150"
                src="@/assets/logo.png"
              ></v-img>
              <div class="text-subtitle-1 text-medium-emphasis mb-4">Iniciar sesión</div>

              <v-form ref="form">
                <v-text-field
                  v-model="email"
                  :rules="emailRules"
                  label="Correo electrónico"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  density="compact"
                  class="mb-4"
                ></v-text-field>

                <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between mb-1">
                  Contraseña
                  <a
                    class="text-caption text-decoration-none text-blue"
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>

                <v-text-field
                  v-model="password_empleado"
                  :rules="passwordRules"
                  :type="passwordVisible ? 'text' : 'password'"
                  label="Ingresa tu contraseña"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                  variant="outlined"
                  density="compact"
                  @click:append-inner="passwordVisible = !passwordVisible"
                  class="mb-4"
                ></v-text-field>

                <v-card
                  class="mb-6 transparent-card"
                  color="surface-variant"
                  variant="tonal"
                >
                  <v-card-text class="text-medium-emphasis text-caption">
                    Nota: Después de 3 intentos fallidos consecutivos, tu cuenta se bloqueará temporalmente durante 3 horas.
                  </v-card-text>
                </v-card>

                <v-btn
                  color="blue"
                  size="large"
                  variant="tonal"
                  block
                  @click="submit"
                >
                  INGRESAR
                </v-btn>
              </v-form>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getCurrentInstance } from "vue";
import videoBackground from '@/assets/video_background.mp4';

export default {
  name: "Login_view",
  setup() {
    const form = ref(null);
    const email = ref("");
    const password_empleado = ref("");
    const passwordVisible = ref(false);
    const store = useStore();
    const router = useRouter();
    const app = getCurrentInstance();

    const emailRules = [
      (v) => !!v || "El correo del usuario es requerido",
    ];

    const passwordRules = [
      (v) => !!v || "La contraseña es requerida",
    ];

    const submit = async () => {
      if (form.value.validate()) {
        try {
          await store.dispatch("login", {
            email: email.value,
            password_empleado: password_empleado.value,
          });

          const nombreCompleto = store.getters.nombreCompleto;
          const nombreSpa = store.getters.nombreSpa;

          app.appContext.config.globalProperties.$showAlert(
            `¡Bienvenido, ${nombreCompleto}! A ${nombreSpa}!`,
            "info"
          );

          router.push("/agenda");
        } catch (error) {
          console.log("Error en el inicio de sesión", error);
          app.appContext.config.globalProperties.$showAlert(
            "Error al iniciar sesión. Por favor, verifica tus credenciales.",
            "error"
          );
        }
      }
    };

    return {
      form,
      email,
      password_empleado,
      passwordVisible,
      emailRules,
      passwordRules,
      videoBackground,
      submit,
    };
  },
};
</script>

<style>
.shape-container {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

/* Estilos para el video de fondo */
#bg-video {
  position: absolute;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  object-fit: cover;
  z-index: 0;
}

/* Contenedor del contenido de login para centrarlo */
.login-content {
  position: relative;
  z-index: 1;
}

/* Asegura que los contenedores de Vuetify sean transparentes */
.v-main,
.fill-height {
  background: transparent !important;
}

/* Tarjeta y contenedores con transparencia */
.transparent-card {
  background-color: rgba(255, 255, 255, 0.5) !important;
  backdrop-filter: blur(10px);
}

.dark-theme .transparent-card {
  background-color: rgba(18, 18, 18, 0.8) !important;
}
</style>
