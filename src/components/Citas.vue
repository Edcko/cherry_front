<template>
  <div>
    <v-calendar
      expanded
      :attributes="calendarAttributes"
      @dayclick="onDayClick"
    />
    
    <div class="d-flex justify-center mb-5 mt-5">
      <v-row justify="center">
        <v-dialog v-model="showDialog" persistent width="1024">
          <template v-slot:activator="{ props }">
            <v-btn color="white" elevation="8" rounded :large="true" class="mx-auto" v-bind="props">
              Crear Cita
            </v-btn>
          </template>
          <cita-dialog
            :showDialog="showDialog"
            @close="showDialog = false"
            @addCita="addCita"
            @updateCita="updateCita"
          />
        </v-dialog>
      </v-row>
    </div>


    <v-row>
      <v-col
        v-for="cita in citas"
        :key="cita.id_cita"
        cols="12"
        md="6"
        lg="4"
        class="mt-5"
      >
        <v-card class="mb-3">
          <v-card-title class="headline">Número de cita: {{ cita.id_cita }}</v-card-title>
          <v-card-subtitle>{{ formatDate(cita.fecha) }}</v-card-subtitle>
          <v-card-text>
            <p><strong>Empleado:</strong> {{ cita.id_empleado }}</p>
            <p><strong>Cliente:</strong> {{ cita.id_cliente }}</p>
            <p><strong>Cabina:</strong> {{ cita.id_cabina }}</p>
            <p><strong>Sesión:</strong> {{ cita.id_sesion }}</p>
            <p><strong>Estado:</strong> {{ cita.estado }}</p>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" @click="editCita(cita)">Editar</v-btn>
            <v-btn color="error" @click="deleteCita(cita)">Eliminar</v-btn>
            <v-btn color="success" @click="changeEstado(cita)">
              Cambiar Estado
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>


  </div>
</template>




<script>
import { onMounted, ref, computed } from "vue";
import apiService from "@/services/apiServices";
import CitaDialog from "@/components/CitaDialog.vue";
import { format, utcToZonedTime } from "date-fns-tz";



export default {
  name:'CitasComponent',
  components: {
    CitaDialog,
  },
  setup() {
    const citas = ref([]);
    const showDialog = ref(false);

    onMounted(async () => {
      try {
        citas.value = await apiService.getCitas();
      } catch (error) {
        console.error(error);
      }
    });

    const calendarAttributes = computed(() => {
      return citas.value.map((cita) => {
        return {
          key: cita.id_cita,
          dates: cita.fecha,
          highlight: {
            color: "blue",
            fillMode: "light",
          },
          content: "•",
          popovers: {
            label: `Cita: ${cita.id_cita}`,
            slots: [
              {
                content: `Empleado: ${cita.id_empleado}<br>Cliente: ${cita.id_cliente}`,
              },
            ],
          },
        };
      });
    });

    const onDayClick = (day) => {
      const dayDateString = day.date.toISOString().split("T")[0];
      const clickedCita = citas.value.find((cita) => {
        const citaDateString = new Date(cita.fecha).toISOString().split("T")[0];
        return citaDateString === dayDateString;
      });
      if (clickedCita) {
        // Muestra la información de la cita en un cuadro de diálogo personalizado
        console.log(`Cita: ${clickedCita.id_cita}`);
        console.log(`Empleado: ${clickedCita.id_empleado}`);
        console.log(`Cliente: ${clickedCita.id_cliente}`);
      } else {
        console.log("Selected day:", day);
      }
    };

    const formatDate = (dateString) => {
      const dateUTC = new Date(dateString);
  const dateLocal = utcToZonedTime(dateUTC, "America/Mexico_City");
  return format(dateLocal, "dd/MM/yyyy HH:mm");
    };

    const addCita = async (newCita) => {
      try {
        await apiService.addCita(newCita);
        citas.value = await apiService.getCitas();
      } catch (error) {
        console.error(error);
      }
    };

    const updateCita = async (cita) => {
      try {
        await apiService.updateCita(cita);
      } catch (error) {
        console.error(error);
      }
    };
    const deleteCita = async (cita) => {
  if (confirm(`¿Está seguro de eliminar la cita ${cita.id_cita}?`)) {
    try {
      await apiService.deleteCita(cita.id_cita);
      citas.value = await apiService.getCitas();
    } catch (error) {
      console.error(error);
    }
  }
};

const changeEstado = async (cita) => {
  const estados = ["programado", "cancelado", "realizado"];
  const currentIndex = estados.indexOf(cita.estado);
  const newEstado = estados[(currentIndex + 1) % estados.length];
  cita.estado = newEstado;
  await updateCita(cita);
};


return {
  citas,
  calendarAttributes,
  onDayClick,
  formatDate,
  showDialog,
  addCita,
  updateCita,
  deleteCita,
  changeEstado,
  
};
  },
};
</script>

<style>
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}
</style>