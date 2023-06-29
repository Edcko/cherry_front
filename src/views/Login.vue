<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="10" md="6" lg="5">
            <v-card class="elevation-12">
              <v-toolbar color="teal" dark flat>
                <v-toolbar-title>Iniciar sesión</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    v-model="email"
                    :rules="emailRules"
                    label="Email del usuario" 
                    name="email"
                    prepend-icon="mdi-account"
                    type="email"
                  ></v-text-field>
                  <v-text-field
                    v-model="password_empleado"
                    :rules="passwordRules"
                    label="Contraseña"
                    name="password_empleado"
                    prepend-icon="mdi-lock"
                    type="password"
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="teal" @click="submit">Ingresar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
//import authService from "../services/authService.js";

export default {
  name: "Login_view",
  setup() {
    const form = ref(null);
    const email = ref("");
    const password_empleado = ref("");
    const store = useStore();
    const router = useRouter();

    const emailRules = [
      (v) => !!v || 'El correo del usuario es requerido',
    ];

    const passwordRules = [
      (v) => !!v || 'La contraseña es requerida',
    ];
    
    const submit = async () => {
      if (form.value.validate()) {
      console.log('Email del usuario:', email.value);
      console.log('Contraseña:', password_empleado.value);

        try{
        await store.dispatch("login", {email: email.value, password_empleado: password_empleado.value});
        router.push('/');
        }catch(error){
          console.log('Error en el inicio de sesion', error);
        }
       
      }
    };

    const logout = () => {
      store.dispatch("logout");
      console.log('Cierre de sesion exitoso');
    };

    return {
      form,
      email,
      password_empleado,
      emailRules,
      passwordRules,
      submit,
      logout,
    };
  },
};
</script>
