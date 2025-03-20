<template>
    <v-card class="mx-auto" style="width: 100%; max-width: 500px;">
      <v-toolbar color="teal" dark flat>
        <v-btn icon @click="$emit('close')">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-card-title class="text-h5 font-weight-regular justify-center">
          Registrar Compra
        </v-card-title>
      </v-toolbar>
      <v-form ref="form" v-model="isValid" class="pa-4 pt-6">
        <v-text-field
          label="Fecha de Compra"
          v-model="compra.fecha_compra"
          :rules="[rules.required]"
          variant="filled"
          color="teal"
          type="date"
          class="mb-4"
        ></v-text-field>
        <v-autocomplete
          label="Cliente"
          v-model="compra.id_cliente"
          :rules="[rules.required]"
          :items="clienteOptions"
          variant="filled"
          color="teal"
          class="mb-4"
        ></v-autocomplete>
        <v-autocomplete
          label="Paquete"
          v-model="compra.id_paquete"
          :rules="[rules.required]"
          :items="paqueteOptions"
          variant="filled"
          color="teal"
          class="mb-4"
        ></v-autocomplete>
        <v-text-field
          label="Monto Pagado"
          v-model="compra.monto_pagado"
          :rules="[rules.numeric]"
          variant="filled"
          color="teal"
          type="number"
          class="mb-4"
        ></v-text-field>
        <v-select
          label="Estado de la Compra"
          v-model="compra.estado_compra"
          :rules="[rules.required]"
          :items="['Completado','Adeudo']"
          variant="filled"
          color="teal"
          class="mb-4"
        ></v-select>
      </v-form>
      <v-divider></v-divider>
      <v-card-actions class="px-4">
        <v-btn color="teal" text @click="clearFields">Limpiar campos</v-btn>
        <v-spacer></v-spacer>
        <v-btn
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
  //import { format, utcToZonedTime } from "date-fns-tz";
  import { ref, onMounted, computed } from "vue";
  import apiService from "@/services/apiServices";
  import store from "@/store";
  
  export default {
    props: ["showDialog"],
    setup(props, { emit }) {
      const compra = ref({
        id_cliente: "",
        id_paquete: "",
        fecha_compra: new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substr(0, 10), // Fecha actual por defecto
        monto_original: 0,
        monto_pagado: "",
        monto_adeudado: 0,
        estado_compra: ""
      });
  
      const clientes = ref([]);
      const paquetes = ref([]);
      
      const idSpa = store.getters.idSpa;

      const rules = {
        required: (value) => !!value || "Este campo es requerido",
        numeric: (value) => !isNaN(parseFloat(value)) && isFinite(value) || "Debe ser un número"
      };
  
      const isValid = ref(true);
  
      onMounted(async () => {
        clientes.value = await apiService.getClientes({idSpa: idSpa});
        paquetes.value = await apiService.getPaquetes({idSpa: idSpa});
      });
  
      const clienteOptions = computed(() => {
        return clientes.value.map(
          (cliente) =>
            `${cliente.nombre_cliente} ${cliente.apellido_paterno} ${cliente.apellido_materno}`
        );
      });
  
      const paqueteOptions = computed(() => {
        return paquetes.value.map((paquete) => `${paquete.nombre_paquete} - $${paquete.precio}`);
      });
  
      const onSubmit = () => {
        // Aquí debes agregar la lógica para procesar la compra y enviarla al backend
        console.log("Compra registrada:", compra.value);
        // Calcula el monto adeudado

        const clienteSeleccionado = clientes.value.find(
          (c) =>
            `${c.nombre_cliente} ${c.apellido_paterno} ${c.apellido_materno}` ===
            compra.value.id_cliente
        );
        compra.value.id_cliente = clienteSeleccionado
        ? clienteSeleccionado.id_cliente
        : "";

        const paqueteSeleccionado = paquetes.value.find(
          (p) => `${p.nombre_paquete} - $${p.precio}` === compra.value.id_paquete
        );
        compra.value.id_paquete = paqueteSeleccionado
        ? paqueteSeleccionado.id_paquete
        : "";

        console.log("Fecha compra:", compra.value.fecha_compra )
        const fechaLocal = new Date();
        const fechaUTC = new Date(Date.UTC(fechaLocal.getFullYear(), fechaLocal.getMonth(), fechaLocal.getDate()));
        compra.value.fecha_compra = fechaUTC.toISOString().substr(0, 10);
        console.log("Fecha compra:", compra.value.fecha_compra);
        //compra.value.monto_adeudado = compra.value.monto_original - compra.value.monto_pagado;
  
        emit("addCompra", compra.value);
        emit("close");
      };
  
      const clearFields = () => {
        compra.value = {
          id_cliente: "",
          id_paquete: "",
          fecha_compra: new Date(new Date().setHours(0, 0, 0, 0)).toISOString().substr(0, 10),
          monto_original: 0,
          monto_pagado: "",
          monto_adeudado: 0,
          estado_compra: ""
        };
      };
  
      return {
        compra,
        clientes,
        paquetes,
        clienteOptions,
        paqueteOptions,
        rules,
        isValid,
        onSubmit,
        clearFields
      };
    },
  };
  </script>