<template>
  <v-container v-if="user" fluid>
  <v-col >
    <v-card >
      <v-card-title class="headline">
        Fecha: {{ truncateName(formatDateToDayMonthYear(cita.fecha)) }}
        <v-tooltip
          activator="parent"
          location="bottom"
        >{{ formatDateToDayMonthYear(cita.fecha) }}</v-tooltip>
      </v-card-title>
      <v-card-subtitle>  
      <div class="title-text">
          <strong>Cliente: </strong>
          <span class="truncate">
            {{ truncateName(cita.Cliente.nombre_cliente + ' ' + cita.Cliente.apellido_paterno + ' ' + cita.Cliente.apellido_materno) }}
            <v-tooltip
              activator="parent"
              location="bottom"
            >{{ cita.Cliente.nombre_cliente + ' ' + cita.Cliente.apellido_paterno + ' ' + cita.Cliente.apellido_materno }}</v-tooltip>
          </span>
        </div></v-card-subtitle> 
      <v-card-text>
       
        <p><strong>Agendo: </strong> 
          <span class="truncate">
            {{ truncateName( cita.Empleado?.nombre_empleado + ' ' + cita.Empleado?.apellido_paterno + ' ' + cita.Empleado?.apellido_materno) }}
            <v-tooltip
              activator="parent"
              location="bottom"
            >{{ cita.Empleado?.nombre_empleado + ' ' + cita.Empleado?.apellido_paterno + ' ' + cita.Empleado?.apellido_materno }}</v-tooltip>
          </span>
          </p>
        <p><strong>Cabina:</strong> {{ cita.Cabina.turno }} - {{ cita.Cabina.estado_cabina }}  </p>
        <p><strong>Terapeuta: </strong> 
          <span class="truncate">
            {{ truncateName(cita.Cabina.Empleado.nombre_empleado + ' ' + cita.Cabina.Empleado.apellido_paterno + ' ' + cita.Cabina.Empleado.apellido_materno) }}
            <v-tooltip
              activator="parent"
              location="bottom"
            >{{cita.Cabina.Empleado.nombre_empleado + ' ' + cita.Cabina.Empleado.apellido_paterno + ' ' + cita.Cabina.Empleado.apellido_materno }}</v-tooltip>
          </span></p>

        <p><strong>Paquete: </strong><span class="truncate">
        {{ truncateName(cita.Paquete.nombre_paquete) }}
        <v-tooltip
            activator="parent"
            location="bottom"
        >{{ cita.Paquete.nombre_paquete }}</v-tooltip>
    </span></p>
    <p><strong>No. de cita: </strong><span class="truncate">
        {{ truncateName(cita.numero_visita) }}
        <v-tooltip
            activator="parent"
            location="bottom"
        >{{ cita.numero_visita }}</v-tooltip>
    </span></p>
        

    <!--<p><strong>Sesión:</strong> {{ cita.Sesion.descripcion }}</p> -->
        <p :style="{ backgroundColor: getColorForEstado(cita.estado), color: 'white', padding: '5px', borderRadius: '5px' }"><strong>Estado:</strong> {{ cita.estado }}</p>
      </v-card-text>
      
      <v-card-actions class="actions">
    <!--     <v-btn v-if="user.tipo_empleado === 'Administrador' || user.tipo_empleado === 'Gerente'" color="primary" @click="editCita(cita)">
    <v-icon>mdi-file-document-edit-outline</v-icon>
    </v-btn>
    -->

    <v-btn v-if="user.tipo_empleado === 'Administrador' || user.tipo_empleado === 'Gerente'" color="error" @click="handleDeleteCita(cita)">
    <v-icon>mdi-delete</v-icon>
    </v-btn>
    <v-btn v-if="user.tipo_empleado === 'Administrador' || user.tipo_empleado === 'Gerente'" color="success" @click="changeEstado(cita)">
    <v-icon>mdi-check</v-icon>
    </v-btn>
      </v-card-actions>

     
 
      <cita-edit-dialog
        v-model="showEditDialog"
        :cita="currentCita"
        @update="updateCitaFromForm"
        @closeDialog="showEditDialog = false"
      />
      
    </v-card>

    <v-dialog v-model="confirmDeleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro de eliminar la cita {{ citaToDelete.id_cita }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="confirmDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="red darken-1" text @click="deleteCita">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-col>
  </v-container> 

<!-- <v-container v-else fluid class="fill-height"> 
      <v-row align="center" justify="center">
        <v-progress-circular
          indeterminate
          color="teal"
          size="70"
        ></v-progress-circular>
      </v-row>
    </v-container> -->

</template>

<script>
import { ref, onMounted } from "vue";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { formatDate } from "@/utils/dateUtils";
import useCitas from "@/composables/useCitas";
import useUser from "@/composables/useUser";
import CitaEditDialog from "@/components/CitaEditDialog.vue";
import chroma from "chroma-js";

export default {
  name: "CitaCard",
  components: {
    CitaEditDialog,
  },
  props: ["cita"],
  setup(props, {emit}) {
    const showEditDialog = ref(false);
    const currentCita = ref({});
    const confirmDeleteDialog = ref(false);
    const citaToDelete = ref(null);
    const { user, loadUser } = useUser();
    
    onMounted( async () => { 
      
      await loadUser();
    });

    const {    
      changeEstado, citas,
    } = useCitas();

    const handleDeleteCita = (cita) => {
      citaToDelete.value = cita;
      confirmDeleteDialog.value = true;
    };

    const deleteCita = () => {
      emit("deleteCita", citaToDelete.value);
      confirmDeleteDialog.value = false;
    };

    const editCita = (cita) => {
      currentCita.value = cita;
      showEditDialog.value = true;
    };

    const updateCitaFromForm = (cita) => {
      emit('updateCita', cita);
    };

    return {
      formatDate,
      editCita,
      showEditDialog,
      currentCita,
      updateCitaFromForm,
      changeEstado,
      handleDeleteCita,
      confirmDeleteDialog,
      citaToDelete,
      deleteCita,
      user,
      citas,
      loadUser
    };
  },
  methods: {
    getColorForEstado(estado) {
      const colors = {
      'por confirmar':  '#f18933',// Naranja
      'cita programada': '#9754af', // Morado
      'cita realizada': '#77dd77', // Verde pastel
      'cita perdida': '#84b6f4', // Azul turquesa
      'reagendo cita': '#eeca06', // Amarillo
      'adeudo': '#a62520', // Rojo
    };
    const color = colors[estado.toLowerCase()] || '#9e9e9e'; // Gris por defecto
    return chroma(color).hex();
    },

    truncateName(name, limit = 20) {
    return name.length > limit ? name.substring(0, limit) + '...' : name;
  },
  formatDateToDayMonthYear(dateString) {
    const date = new Date(dateString);
    return format(date, 'EE dd/MMM/yy HH:mm', { locale: es });
  },

  },
};
</script>

<style scope>

.actions {
  justify-content: center;
  margin-top: -10px;
}

.title-text {
  font-size: 1rem;
  font-weight: bold;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
