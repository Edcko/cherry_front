<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent width="1024">
      <template v-slot:activator="{// eslint-disable-next-line  
      props }">
        <v-btn color="primary" dark @click="openDialog">
          Registrar Cliente
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Registro de Cliente</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Nombre"
                  v-model="cliente.nombre_cliente"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Apellido Paterno"
                  v-model="cliente.apellido_paterno"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field
                  label="Apellido Materno"
                  v-model="cliente.apellido_materno"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Email"
                  v-model="cliente.email"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  label="Telefono"
                  v-model="cliente.telefono_cliente"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="cliente.fecha_nacimiento"
                      label="Fecha de Nacimiento"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-text-field
                    label="Fecha de nacimiento"
                    v-model="cliente.fecha_nacimiento"
                    type="datetime-local"
                  ></v-text-field>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="['M', 'F']"
                  label="Sexo"
                  v-model="cliente.sexo"
                  required
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
            Close
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveCliente">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import useClientes from "@/composables/useClientes";

export default {
  setup() {

    
    const { dialog, cliente, openDialog, closeDialog, addCliente } =
      useClientes();
    return {
      dialog,
      cliente,
      openDialog,
      closeDialog,
      addCliente,
    };
  },

};
</script>
