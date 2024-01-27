<template>
    <v-card>
      <v-card-title>
        <span class="text-h5">Dar de alta posible cliente</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <!-- Información Personal -->
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
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Apellido materno"
                v-model="cliente.apellido_materno"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Teléfono"
                v-model="cliente.telefono_cliente"
                :rules="[rules.required, rules.phone]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                label="Genero"
                v-model="cliente.sexo"
                :items="generos"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-autocomplete
                label="Spa"
                v-model="cliente.id_spa"
                :items="spaOptions"
                :rules="[rules.required]"
              ></v-autocomplete>
            </v-col>
          </v-row>
  
          <!-- Información Adicional -->
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                label="¿Cómo se enteró?"
                v-model="cliente.como_se_entero"
                :items="opcionesComoSeEntero"
                :rules="[rules.required]"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-select
                label="Tipo de valoración"
                v-model="cliente.tipo_valoracion"
                :items="opcionesTipoValoracion"
                :rules="[rules.required]"
              ></v-select>
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
            telefono_cliente: "",
            sexo: "",
            id_spa: "",
            como_se_entero: "",
            tipo_valoracion: "",
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

          const opcionesComoSeEntero = ref([
            "Facebook",
            "Instagram",
            "Recomendación",
            "Otro",
          ]);

            const opcionesTipoValoracion = ref([
                "Aparatología",
                "Faciales",
                "Depilación",
                "Uñas",
            ]);

      
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
            opcionesComoSeEntero,
            opcionesTipoValoracion,
            onSubmit,
            generos,
            rules
          };
        },
      };
      </script>
      