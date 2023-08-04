<template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Dar de alta empleado</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Nombre"
                v-model="empleado.nombre_empleado"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Apellido paterno"
                v-model="empleado.apellido_paterno"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Apellido materno"
                v-model="empleado.apellido_materno"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Puesto del empleado"
                v-model="empleado.tipo_empleado"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Teléfono"
                v-model="empleado.telefono_empleado"
                :rules="[rules.required, rules.phone]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Email"
                v-model="empleado.email"
                :rules="[rules.required, rules.email]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                :items="generos"
                label="Genero"
                v-model="empleado.sexo"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">

              <v-text-field
        label="Contraseña"
        v-model="empleado.password_empleado"
        :rules="[rules.required]"
        type="password"
        required
      ></v-text-field>

            </v-col>
          </v-row>
          <v-row>
    <v-col cols="12" sm="6">
      <v-text-field
        label="Fecha de contratación"
        v-model="empleado.fecha_contratacion"
        :rules="[rules.required]"
        type="date"
        required
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="6">
      
      <v-text-field 
                label="Fecha de nacimiento" 
                v-model="empleado.fecha_nacimiento" 
                :rules="[rules.required]"
                type="date" 
                required>
              </v-text-field>

    </v-col>
  </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">Cerrar</v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="onSubmit">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    props: ["showDialog"],
    setup(props, { emit }) {
      const empleado = ref({
        nombre_empleado: "",
        apellido_paterno: "",
        apellido_materno: "",
        tipo_empleado: "",
        email: "",
        telefono_empleado: "",
        fecha_nacimiento: "",
        sexo: "",
        password_empleado: "",
        fecha_contratacion: ""
      });

    
  
      const generos = ['M', 'F', 'O'];
      
      const rules = {
        required: value => !!value || 'Campo requerido.',
        phone: value => {
          const pattern = /^\d{10}$/;
          return pattern.test(value) || 'Número de teléfono no válido.'
        },
        email: value => {
          const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
          return pattern.test(value) || 'E-mail no válido.'
        }
      };
  
      const onSubmit = () => {
        emit("addEmpleado", empleado.value);
        emit("close");
      };
      return {
        empleado,
        onSubmit,
        generos,
        rules
      };
    },
  };
  </script>
  