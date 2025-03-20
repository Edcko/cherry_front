<template>
  <v-container v-if="user" fluid>
    <v-col>
      <v-card>
        <v-card-title class="headline">
          Fecha: {{ truncateName(formattedFecha) }}
          <v-tooltip activator="parent" location="bottom">
            {{ formattedFecha }}
          </v-tooltip>
        </v-card-title>
        <v-card-subtitle>
          <div class="title-text">
            <strong>Cliente: </strong>
            <span class="truncate">
              {{ truncateName(clientFullName) }}
              <v-tooltip activator="parent" location="bottom">
                {{ clientFullName }}
              </v-tooltip>
            </span>
          </div>
        </v-card-subtitle>
        <v-card-text>
          <p>
            <strong>Agendó: </strong>
            <span class="truncate">
              {{ truncateName(agendoFullName) }}
              <v-tooltip activator="parent" location="bottom">
                {{ agendoFullName }}
              </v-tooltip>
            </span>
          </p>
          <p>
            <strong>Cabina:</strong>
            {{ cita.Cabina.turno }} - {{ cita.Cabina.estado_cabina }}
          </p>
          <p>
            <strong>Terapeuta: </strong>
            <span class="truncate">
              {{ truncateName(terapeutaFullName) }}
              <v-tooltip activator="parent" location="bottom">
                {{ terapeutaFullName }}
              </v-tooltip>
            </span>
          </p>
          <p>
            <strong>Paquete: </strong>
            <span class="truncate">
              {{ truncateName(paqueteName) }}
              <v-tooltip activator="parent" location="bottom">
                {{ paqueteName }}
              </v-tooltip>
            </span>
          </p>
          <p>
            <strong>No. de cita: </strong>
            <span class="truncate">
              {{ truncateName(numeroCita) }}
              <v-tooltip activator="parent" location="bottom">
                {{ numeroCita }}
              </v-tooltip>
            </span>
          </p>
          <p
            :style="{
              backgroundColor: estadoColor,
              color: 'white',
              padding: '5px',
              borderRadius: '5px'
            }"
          >
            <strong>Estado:</strong> {{ cita.estado }}
          </p>
        </v-card-text>
        <v-card-actions class="actions">
          <v-btn
            v-if="user.tipo_empleado === 'Administrador' || user.tipo_empleado === 'Gerente' || user.tipo_empleado === 'Desarrollador'"
            color="error"
            @click="handleDeleteCita(cita)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn
            v-if="user.tipo_empleado === 'Administrador' || user.tipo_empleado === 'Gerente' || user.tipo_empleado === 'Desarrollador'"
            color="success"
            @click="changeEstado(cita)"
          >
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
            <v-btn color="green darken-1" text @click="confirmDeleteDialog = false">
              Cancelar
            </v-btn>
            <v-btn color="red darken-1" text @click="deleteCita">
              Eliminar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </v-container>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { es } from "date-fns/locale";
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
  setup(props, { emit }) {
    const showEditDialog = ref(false);
    const currentCita = ref({});
    const confirmDeleteDialog = ref(false);
    const citaToDelete = ref(null);
    const { user, loadUser } = useUser();

    onMounted(async () => {
      await loadUser();
    });

    const { changeEstado } = useCitas();

    // Computed: formatea la fecha y almacena el resultado para evitar recalculaciones
    const formattedFecha = computed(() => {
      return format(new Date(props.cita.fecha), "EE dd/MMM/yy HH:mm", { locale: es });
    });

    // Computed: nombre completo del cliente
    const clientFullName = computed(() => {
      return `${props.cita.Cliente.nombre_cliente} ${props.cita.Cliente.apellido_paterno} ${props.cita.Cliente.apellido_materno}`;
    });

    // Computed: nombre completo de quien agendó la cita
    const agendoFullName = computed(() => {
      return props.cita.Empleado
        ? `${props.cita.Empleado.nombre_empleado} ${props.cita.Empleado.apellido_paterno} ${props.cita.Empleado.apellido_materno}`
        : "";
    });

    // Computed: nombre completo del terapeuta asignado a la cabina
    const terapeutaFullName = computed(() => {
      return `${props.cita.Cabina.Empleado.nombre_empleado} ${props.cita.Cabina.Empleado.apellido_paterno} ${props.cita.Cabina.Empleado.apellido_materno}`;
    });

    // Computed: nombre del paquete
    const paqueteName = computed(() => {
      return props.cita.Paquete.nombre_paquete;
    });

    // Computed: número de cita
    const numeroCita = computed(() => {
      return props.cita.numero_visita;
    });

    // Computed: color para el estado de la cita, usando chroma para normalizar el valor
    const estadoColor = computed(() => {
      const colors = {
        "por confirmar": "#f18933",
        "cita programada": "#9754af",
        "cita realizada": "#77dd77",
        "cita perdida": "#84b6f4",
        "reagendo cita": "#eeca06",
        adeudo: "#a62520",
      };
      const color = colors[props.cita.estado.toLowerCase()] || "#9e9e9e";
      return chroma(color).hex();
    });

    // Métodos para eliminar y editar citas
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
      emit("updateCita", cita);
    };

    return {
      formattedFecha,
      clientFullName,
      agendoFullName,
      terapeutaFullName,
      paqueteName,
      numeroCita,
      estadoColor,
      showEditDialog,
      currentCita,
      updateCitaFromForm,
      changeEstado,
      handleDeleteCita,
      confirmDeleteDialog,
      citaToDelete,
      deleteCita,
      editCita,
      user,
    };
  },
  methods: {
    // Función simple para truncar cadenas
    truncateName(name, limit = 30) {
      return name.length > limit ? name.substring(0, limit) + "..." : name;
    },
  },
};
</script>

<style scoped>
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
