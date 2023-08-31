<template>
<v-card>
  <v-card-title>
    <span class="text-h5">Dar de alta cliente</span>
  </v-card-title>
  <v-card-text>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Nombre"
            v-model="cliente.nombre_cliente"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Apellido paterno"
            v-model="cliente.apellido_paterno"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Apellido materno"
            v-model="cliente.apellido_materno"
            :rules="[rules.required]"
          ></v-text-field>
        </v-col>

        
        <v-col cols="12" sm="6">
          <v-autocomplete
            label="Spa"
            v-model="cliente.id_spa"
            :items="spaOptions"
            :rules="[rules.required]"
          ></v-autocomplete>
        </v-col>
      
        <!--
        <v-col cols="12" sm="6">
          <v-select
            :items="[
              'Nuevo',
              'Normal',
              'VIP'
            ]"
            label="Tipo cliente"
            v-model="cliente.tipo_cliente"
            :rules="[rules.required]"
          ></v-select>
        </v-col>

        -->
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Teléfono"
            v-model="cliente.telefono_cliente"
            :rules="[rules.required, rules.phone]"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            label="Email"
            v-model="cliente.email"
            :rules="[rules.required, rules.email]"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <v-select
            :items="generos"
            label="Genero"
            v-model="cliente.sexo"
            :rules="[rules.required]"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field 
            label="Fecha de nacimiento" 
            v-model="cliente.fecha_nacimiento" 
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
  import { ref, onMounted, computed } from "vue";
  import apiService from "@/services/apiServices"

  export default {
    props: ["showDialog"],
    setup(props, { emit }) {
      const cliente = ref({
        nombre_cliente: "",
        apellido_paterno: "",
        apellido_materno: "",
        tipo_cliente: "Normal",
        email: "",
        telefono_cliente: "",
        fecha_nacimiento: "",
        sexo: "",
        id_spa: "",
      });

      const spas = ref([]);

    function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}


      onMounted(async () => {
        spas.value = await apiService.getSpas();
        console.log("Spas:", spas.value);
      });

      const spaOptions = computed(() => {
        return spas.value.map(
        (spa) =>
          `${spa.nombre_spa} ${spa.ciudad}`
        );
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
  cliente.value.nombre_cliente = toTitleCase(cliente.value.nombre_cliente);
  cliente.value.apellido_paterno = toTitleCase(cliente.value.apellido_paterno);
  cliente.value.apellido_materno = toTitleCase(cliente.value.apellido_materno);

  const spaSeleccionado = spas.value.find(spa => `${spa.nombre_spa} ${spa.ciudad}` === cliente.value.id_spa);
  console.log("Spa seleccionado:", spaSeleccionado);

  cliente.value.id_spa = spaSeleccionado ? spaSeleccionado.id_spa : "";

  emit("addCliente", cliente.value);
  emit("close");
};

      return {
        cliente,
        spaOptions,
        onSubmit,
        generos,
        rules
      };
    },
  };
  </script>
  