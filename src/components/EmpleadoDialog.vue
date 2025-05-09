<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ empleadoEdit ? "Editar Empleado" : "Dar de alta empleado" }}</span>
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
              v-if="!empleadoEdit"
              label="Contraseña"
              v-model="empleado.password_empleado"
              :rules="[rules.required]"
              type="password"
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
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="Fecha de nacimiento"
              v-model="empleado.fecha_nacimiento"
              :rules="[rules.required]"
              type="date"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="blue-darken-1" variant="text" @click="$emit('close')">Cerrar</v-btn>
      <v-btn color="blue-darken-1" variant="text" @click="onSubmit">
        {{ empleadoEdit ? "Actualizar" : "Guardar" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { ref, watch } from "vue";

export default {
  props: {
    showDialog: Boolean,
    empleadoEdit: Object, // Recibe el empleado para editar
  },
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
      fecha_contratacion: "",
    });

    const generos = ["M", "F", "O"];

    const rules = {
      required: (value) => !!value || "Campo requerido.",
      phone: (value) => {
        const pattern = /^\d{10}$/;
        return pattern.test(value) || "Número de teléfono no válido.";
      },
      email: (value) => {
        const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(value) || "E-mail no válido.";
      },
    };

    function toTitleCase(str) {
      return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
    }

    // Rellenar los datos cuando se pasa un empleado para edición
    watch(
      () => props.empleadoEdit,
      (newEmpleado) => {
        if (newEmpleado) {
          empleado.value = { ...newEmpleado }; // Clonar los datos del empleado
        }
      },
      { immediate: true }
    );

    const onSubmit = () => {
      empleado.value.nombre_empleado = toTitleCase(empleado.value.nombre_empleado);
      empleado.value.apellido_paterno = toTitleCase(empleado.value.apellido_paterno);
      empleado.value.apellido_materno = toTitleCase(empleado.value.apellido_materno);

      if (props.empleadoEdit) {
        console.log("Actualizando empleado:", empleado.value);
        emit("updateEmpleado", empleado.value); // Emite la actualización
      } else {
        emit("addEmpleado", empleado.value); // Emite la creación
      }

      emit("close");
    };

    return {
      empleado,
      onSubmit,
      generos,
      rules,
    };
  },
};
</script>
