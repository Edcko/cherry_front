<template>
    <v-container v-if="user" fluid>
      <v-row>
        <v-col md="12">
          <v-card>
            <v-img
              height="300px"
              cover
              src="../assets/img/fondoPer.jpg"
            >
             
  
              <v-avatar
                color="grey"
                size="150"
                absolute
                bottom
                left
                class="mt-10 ml-5"
              >
                <v-img cover src="../assets/img/login.png"></v-img>
              </v-avatar>

              <v-btn
                icon
                large
                absolute
                top
                right
                class="mt-10 ml-3"
                color="transparent"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
  
              <v-list-item
                class="text-white"
              >
                <v-list-item-content>
                  <v-list-item-title class="headline">{{ user.nombre_empleado }} {{ user.apellido_paterno }} {{ user.apellido_materno }}</v-list-item-title>
                  <v-list-item-subtitle>{{ user.tipo_empleado }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-img>
            
            <v-card-text>
              <v-row dense>
                <v-col cols="6" sm="4" md="3">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-email</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Email</v-list-item-title>
                      <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
  
                <v-col cols="6" sm="4" md="3">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-phone</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Teléfono</v-list-item-title>
                      <v-list-item-subtitle>{{ user.telefono_empleado }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
  
                <v-col cols="6" sm="4" md="3">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-calendar</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Fecha de Nacimiento</v-list-item-title>
                      <v-list-item-subtitle>{{ user.fecha_nacimiento }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
  
               
  
                <v-col cols="6" sm="4" md="3">
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>mdi-calendar-check</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>Fecha de Contratación</v-list-item-title>
                      <v-list-item-subtitle>{{ user.fecha_contratacion }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-col>
  
                <!-- Aqui van los demás datos del usuario -->
                <!-- ... -->
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  
    <v-container v-else fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="teal"
          size="70"
        ></v-progress-circular>
      </v-row>
    </v-container>
  </template>
  
  <script>
    // eslint-disable-next-line
    import { ref, onMounted } from 'vue';
    import useUser from "@/composables/useUser";
  
    export default {
      name: "Perfil_view",
      setup() {
        const { user, loadUser } = useUser();
        onMounted(loadUser);
        return {
          user,
        };
      },
    };
  </script>