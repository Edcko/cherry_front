<template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Agregar nuevo paquete</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Nombre del paquete"
                v-model="paquete.nombre_paquete"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Descripción"
                v-model="paquete.descripcion"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Precio"
                v-model="paquete.precio"
                :rules="[rules.required, rules.price]"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Estado del paquete"
                v-model="paquete.estado_paquete"
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Fecha de inicio"
                v-model="paquete.fecha_inicio"
                :rules="[rules.required]"
                type="date"
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                label="Fecha de fin"
                v-model="paquete.fecha_fin"
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
        <v-btn color="blue-darken-1" variant="text" @click="onSubmit">Guardar</v-btn>
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
        fecha_inicio: "",
        fecha_fin: "",
      });

    
  
//     const generos = ['M', 'F', 'O'];
      
      const rules = {
        required: value => !!value || 'Campo requerido.',
        price: value => !isNaN(value) || 'Ingrese un número válido',
      };
  
      const onSubmit = () => {
        emit("addPaquete", paquete.value);
        emit("close");
      };
      return {
        paquete,
        onSubmit,
//        generos,
        rules
      };
    },
  };
  </script>
  