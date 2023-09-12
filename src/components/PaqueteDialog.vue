<template>
  <v-card class="mx-auto" style="width: 100%; max-width: 400px;">
    <v-toolbar color="teal" dark flat>
      <v-btn icon @click="$emit('close')" >
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-card-title class="text-h5 font-weight-regular justify-center">
        Agregar nuevo paquete
      </v-card-title>
    </v-toolbar>
    <v-form ref="form" v-model="isValid" class="pa-4 pt-6">
        <v-text-field
          label="Nombre del paquete"
          v-model="paquete.nombre_paquete"
          :rules="[rules.required]"
          variant="filled"
          color="teal"
          class="mb-4"
        ></v-text-field>
        <v-text-field
          label="Descripción"
          v-model="paquete.descripcion"
          :rules="[rules.required]"
          variant="filled"
          color="teal"
          class="mb-4"
        ></v-text-field>
        <v-text-field
          label="Precio"
          v-model="paquete.precio"
          :rules="[rules.required, rules.price]"
          variant="filled"
          color="teal"
          type="number"
          class="mb-4"
        ></v-text-field>
        <v-text-field
          label="Cantidad de citas"
          v-model="paquete.numero_visitas"
          variant="filled"
          color="teal"
          type="number"
          class="mb-4"
        ></v-text-field>
        <v-select
          label="Estado del paquete"
          v-model="paquete.estado_paquete"
          :rules="[rules.required]"
          :items="['Activo', 'Inactivo']"
          variant="filled"
          color="teal"
          class="mb-4"
        ></v-select>
        <v-text-field
          label="Fecha de inicio"
          v-model="paquete.fecha_inicio"
          :rules="[rules.required]"
          variant="filled"
          color="teal"
          type="date"
          class="mb-4"
        ></v-text-field>
        <v-text-field
          label="Fecha de fin"
          v-model="paquete.fecha_fin"
          :rules="[rules.required]"
          variant="filled"
          color="teal"
          type="date"
          class="mb-4"
        ></v-text-field>
      </v-form>
      <v-divider></v-divider>
    <v-card-actions class="px-4">
      <v-btn color="teal" text @click="clearFields">Limpiar campos</v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!isValid"
        color="teal"
        text
        @click="onSubmit"
      >
        Guardar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    props: ["showDialog"],
    setup(props, { emit }) {
      const paquete = ref({
        nombre_paquete: "",
        descripcion: "",
        precio: "",
        numero_visitas: 0,
        numero_zonas_cuerpo: 0,
        estado_paquete: "",
        fecha_inicio: "",
        fecha_fin: "",
        imagen_paquete: "/img/service1.png"
      });
  
      const isValid = ref(true);
  
      const rules = {
        required: (value) => !!value || "Campo requerido.",
        price: (value) => !isNaN(value) || "Ingrese un número válido",
      };
  
      const onSubmit = () => {
        emit("addPaquete", paquete.value);
        emit("close");
      };
  
      const clearFields = () => {
        paquete.value = {
          nombre_paquete: "",
          descripcion: "",
          precio: "",
          numero_visitas: "",
          estado_paquete: "",
          fecha_inicio: "",
          fecha_fin: "",
        };
      };
  
      return {
        paquete,
        isValid,
        onSubmit,
        clearFields,
        rules,
      };
    },
  };
  </script>
  