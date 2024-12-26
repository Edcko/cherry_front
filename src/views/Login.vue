<template>
  <v-app>
    <div :class="['shape-container', $vuetify.theme.current.dark ? 'dark-theme' : 'light-theme']">
      <v-main>
        <v-container class="fill-height" fluid>
          <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4" lg="3">
              <v-card class="pa-8 pb-6" elevation="8" max-width="448" rounded="lg">
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
                    class="mb-6"
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

                <!--<v-card-text class="text-center mt-6">
                  <a
                    class="text-blue text-decoration-none"
                    href="#"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Registrarse ahora <v-icon icon="mdi-chevron-right"></v-icon>
                  </a>
                </v-card-text> -->
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </div>
  </v-app>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { getCurrentInstance } from 'vue';


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

      // Obtener el nombre completo desde el store
      const nombreCompleto = store.getters.nombreCompleto;
      const nombreSpa = store.getters.nombreSpa;

      // Mostrar notificación de bienvenida
      app.appContext.config.globalProperties.$showAlert(`¡Bienvenido, ${nombreCompleto}! A ${nombreSpa}!`, "info");

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
      submit,
    };
  },
};
</script>

<style>
.shape-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.light-theme {
  background-color: #f5f5f5;
}

.dark-theme {
  background-color: #121212;
}
</style>
