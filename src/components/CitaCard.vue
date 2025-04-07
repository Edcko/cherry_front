<template>
  <v-container v-if="user" fluid>
    <v-col>
      <v-card class="custom-card">
        <!-- Título con fecha -->
        <v-card-title class="card-header">
          <v-icon small class="mr-2">mdi-calendar-clock</v-icon>
          {{ formattedFecha }}
        </v-card-title>

        <v-card-text>
          <!-- Cliente -->
          <div class="info-row">
            <span class="info-label">
              <v-icon small class="mr-1">mdi-account</v-icon>
              Cliente:
            </span>
            <span class="info-value truncate" :title="clientFullName">
              {{ clientFullName }}
            </span>
          </div>

          <!-- Agendó -->
          <div class="info-row">
            <span class="info-label">
              <v-icon small class="mr-1">mdi-calendar-check</v-icon>
              Agendó:
            </span>
            <span class="info-value truncate" :title="agendoFullName">
              {{ agendoFullName }}
            </span>
          </div>

          <!-- Cabina -->
          <div class="info-row">
            <span class="info-label">
              <v-icon small class="mr-1">mdi-hospital-building</v-icon>
              Cabina:
            </span>
            <span class="info-value">
              {{ cita.Cabina.turno }} - {{ cita.Cabina.estado_cabina }}
            </span>
          </div>

          <!-- Terapeuta -->
          <div class="info-row">
            <span class="info-label">
              <v-icon small class="mr-1">mdi-account-heart</v-icon>
              Terapeuta:
            </span>
            <span class="info-value truncate" :title="terapeutaFullName">
              {{ terapeutaFullName }}
            </span>
          </div>

          <!-- Paquete -->
          <div class="info-row">
            <span class="info-label">
              <v-icon small class="mr-1">mdi-package-variant-closed</v-icon>
              Paquete:
            </span>
            <span class="info-value truncate" :title="paqueteName">
              {{ paqueteName }}
            </span>
          </div>

          <!-- Número de cita -->
          <div class="info-row">
            <span class="info-label">
              <v-icon small class="mr-1">mdi-pound</v-icon>
              No. de cita:
            </span>
            <span class="info-value">{{ numeroCita }}</span>
          </div>

          <!-- Estado de la cita (chip) -->
          <div class="status-chip" :style="{ backgroundColor: estadoColor }">
            {{ cita.estado }}
          </div>
        </v-card-text>

        <!-- Botones de acciones -->
        <v-card-actions class="justify-center">
          <v-btn
            v-if="['Administrador', 'Gerente', 'Desarrollador'].includes(user.tipo_empleado)"
            icon
            color="error"
            @click="handleDeleteCita(cita)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-btn
            v-if="['Administrador', 'Gerente', 'Desarrollador', 'Manager'].includes(user.tipo_empleado)"
            icon
            color="success"
            @click="changeEstado(cita)"
          >
            <v-icon>mdi-check-circle-outline</v-icon>
          </v-btn>
        </v-card-actions>

        <!-- Diálogo para editar cita -->
        <cita-edit-dialog
          v-model="showEditDialog"
          :cita="currentCita"
          @update="updateCitaFromForm"
          @closeDialog="showEditDialog = false"
        />
      </v-card>

      <!-- Diálogo de confirmación para eliminar cita -->
      <v-dialog v-model="confirmDeleteDialog" max-width="400px">
        <v-card>
          <v-card-title class="text-h6">Confirmar Eliminación</v-card-title>
          <v-card-text>
            ¿Está seguro de eliminar la cita #{{ citaToDelete.id_cita }}?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="grey" text @click="confirmDeleteDialog = false">Cancelar</v-btn>
            <v-btn color="red" text @click="deleteCita">Eliminar</v-btn>
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

    const formattedFecha = computed(() => {
      return format(new Date(props.cita.fecha), "EE dd/MMM/yy HH:mm", { locale: es });
    });

    const clientFullName = computed(() => {
      return `${props.cita.Cliente.nombre_cliente} ${props.cita.Cliente.apellido_paterno} ${props.cita.Cliente.apellido_materno}`;
    });

    const agendoFullName = computed(() => {
      return props.cita.Empleado
        ? `${props.cita.Empleado.nombre_empleado} ${props.cita.Empleado.apellido_paterno} ${props.cita.Empleado.apellido_materno}`
        : "";
    });

    const terapeutaFullName = computed(() => {
      return `${props.cita.Cabina.Empleado.nombre_empleado} ${props.cita.Cabina.Empleado.apellido_paterno} ${props.cita.Cabina.Empleado.apellido_materno}`;
    });

    const paqueteName = computed(() => {
      return props.cita.Paquete.nombre_paquete;
    });

    const numeroCita = computed(() => {
      return props.cita.numero_visita;
    });

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
    truncateName(name, limit = 30) {
      return name.length > limit ? name.substring(0, limit) + "..." : name;
    },
  },
};
</script>

<style scoped>
.custom-card {
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-bottom: 15px;
}
.card-header {
  font-weight: 600;
  font-size: 1.1rem;
  color: #424242;
}
.info-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}
.info-label {
  font-weight: 500;
  color: #616161;
  display: flex;
  align-items: center;
}
.info-value {
  color: #424242;
}
.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  color: white;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-top: 10px;
  text-transform: capitalize;
}
.truncate {
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
