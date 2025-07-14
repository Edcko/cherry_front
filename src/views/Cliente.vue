<template>
  <v-container fluid class="clientes-hero-bg pa-0">
    <!-- Carga inicial -->
    <v-row v-if="isLoading" justify="center" align="center" class="full-height">
      <v-progress-circular indeterminate color="teal" size="64" />
    </v-row>

    <div v-else>
      <v-row class="mt-4">
        <!-- Dashboard de Ventas -->
        <v-col cols="12" md="8">
          <v-card class="pa-6 dashboard-card" elevation="10">
            <v-row align="center" class="mb-4">
              <v-col cols="12" md="6">
                <div class="text-h5 font-weight-bold">Dashboard de Ventas</div>
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="dashboard.periodo"
                  :items="dashboard.periodos"
                  label="Período"
                  dense
                  outlined
                  class="mb-2"
                />
                <v-menu
                  v-model="dashboard.menuFechas"
                  :close-on-content-click="false"
                  max-width="290"
                  transition="scale-transition"
                  offset-y
                  v-if="dashboard.periodo === 'Rango personalizado'"
                >
                  <template #activator="{ props }">
                    <v-text-field
                      v-model="dashboard.fechaTexto"
                      label="Rango de fechas"
                      prepend-icon="mdi-calendar"
                      readonly
                      dense
                      outlined
                      v-bind="props"
                    />
                  </template>
                  <vcal-date-picker
                    v-model.range="dashboard.rangoFechas"
                    is-inline
                    :locale="dashboard.esLocale"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <!-- KPIs -->
            <v-row dense class="mb-4">
              <v-col cols="6" sm="3" v-for="kpi in dashboard.kpis" :key="kpi.titulo">
                <v-card outlined class="pa-3 kpi-mini-card">
                  <div class="text-subtitle-2">{{ kpi.titulo }}</div>
                  <div class="text-h5 font-weight-bold">{{ kpi.valor }}</div>
                </v-card>
              </v-col>
            </v-row>

            <!-- Gráfica -->
            <v-row class="my-4">
              <v-col cols="12">
                <apexchart
                  type="bar"
                  :options="dashboard.chartOptions"
                  :series="dashboard.chartSeries"
                  height="250"
                />
              </v-col>
            </v-row>

            <!-- Tabla de detalle -->
            <v-row>
              <v-col cols="12">
                <v-card outlined class="table-container">
                  <v-table dense class="full-width-table">
                    <thead>
                      <tr>
                        <th v-for="header in dashboard.tableHeaders" :key="header.value" class="text-left">
                          {{ header.title }}
                        </th>
                        <th class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="item in paginatedTableData" :key="item.fecha">
                        <tr class="hover-row">
                          <td>{{ item.fecha }}</td>
                          <td>{{ item.total_compras }}</td>
                          <td>${{ item.ventas_original }}</td>
                          <td>${{ item.ventas_pagadas }}</td>
                          <td>${{ item.ventas_pendientes }}</td>
                          <td class="text-center">
                            <v-btn 
                              icon 
                              small 
                              @click="toggleRowDetails(item)"
                              color="primary"
                            >
                              <v-icon>{{ expandedRows.includes(item) ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                            </v-btn>
                          </td>
                        </tr>
                        <!-- Fila expandida -->
                        <tr v-if="expandedRows.includes(item)">
                          <td :colspan="dashboard.tableHeaders.length + 1">
                            <v-card class="ma-2 pa-4 detail-card" elevation="2">
                              <div class="d-flex align-center mb-4">
                                <v-icon color="primary" class="mr-2">mdi-calendar-clock</v-icon>
                                <h3 class="text-h6 mb-0">Detalles de compras - {{ item.fecha }}</h3>
                              </div>
                              
                              <div v-if="item.detalleCompras && item.detalleCompras.length > 0">
                                <v-row>
                                  <v-col 
                                    v-for="compra in item.detalleCompras" 
                                    :key="compra.id_compra" 
                                    cols="12" 
                                    sm="6" 
                                    md="6" 
                                    lg="6"
                                    class="d-flex"
                                  >
                                    <v-card class="compra-detail-card flex-grow-1" elevation="1">
                                      <v-card-title class="text-subtitle-1 font-weight-bold pb-2">
                                        <v-icon small color="teal" class="mr-2">mdi-account</v-icon>
                                        <v-tooltip 
                                          :text="`${compra.nombre_cliente} ${compra.apellido_paterno} ${compra.apellido_materno}`"
                                          location="top"
                                        >
                                          <template v-slot:activator="{ props }">
                                            <span 
                                              v-bind="props" 
                                              class="text-truncate"
                                              style="max-width: 300px; display: inline-block;"
                                            >
                                              {{ compra.nombre_cliente }} {{ compra.apellido_paterno }} {{ compra.apellido_materno }}
                                            </span>
                                          </template>
                                        </v-tooltip>
                                      </v-card-title>
                                      
                                      <v-card-text class="pt-0">
                                        <div class="mb-3">
                                          <div class="d-flex align-center mb-2">
                                            <v-icon small color="blue" class="mr-2">mdi-package</v-icon>
                                            <v-tooltip 
                                              :text="compra.nombre_paquete"
                                              location="top"
                                            >
                                              <template v-slot:activator="{ props }">
                                                <span 
                                                  v-bind="props" 
                                                  class="font-weight-medium text-truncate"
                                                  style="max-width: 280px; display: inline-block;"
                                                >
                                                  {{ compra.nombre_paquete }}
                                                </span>
                                              </template>
                                            </v-tooltip>
                                          </div>
                                          <div class="text-caption text-grey">Precio: ${{ compra.precio }}</div>
                                        </div>
                                        
                                        <v-divider class="my-2"></v-divider>
                                        
                                        <div class="mb-3">
                                          <div class="d-flex justify-space-between mb-1">
                                            <span class="text-caption">Original:</span>
                                            <span class="font-weight-medium">${{ compra.monto_original }}</span>
                                          </div>
                                          <div class="d-flex justify-space-between mb-1">
                                            <span class="text-caption">Pagado:</span>
                                            <span class="font-weight-medium text-success">${{ compra.monto_pagado }}</span>
                                          </div>
                                          <div class="d-flex justify-space-between">
                                            <span class="text-caption">Adeudado:</span>
                                            <span class="font-weight-medium text-warning">${{ compra.monto_adeudado }}</span>
                                          </div>
                                        </div>
                                        
                                        <v-divider class="my-2"></v-divider>
                                        
                                        <div class="d-flex justify-space-between align-center">
                                          <v-chip 
                                            :color="compra.estado_compra === 'Completado' ? 'success' : 'warning'"
                                            small
                                            text-color="white"
                                          >
                                            {{ compra.estado_compra }}
                                          </v-chip>
                                          <div class="d-flex align-center">
                                            <v-btn 
                                              icon 
                                              x-small 
                                              color="teal" 
                                              @click="handleGeneratePDF(compra)"
                                              :loading="isGeneratingPDF"
                                              class="mr-2"
                                            >
                                              <v-tooltip activator="parent" location="top">Generar ticket PDF</v-tooltip>
                                              <v-icon>mdi-file-pdf-box</v-icon>
                                            </v-btn>
                                            <span class="text-caption text-grey">{{ compra.fecha_compra }}</span>
                                          </div>
                                        </div>
                                      </v-card-text>
                                    </v-card>
                                  </v-col>
                                </v-row>
                              </div>
                              
                              <v-alert v-else type="info" variant="tonal" class="mt-3">
                                <template v-slot:prepend>
                                  <v-icon>mdi-information</v-icon>
                                </template>
                                No hay compras detalladas disponibles para este día.
                              </v-alert>
                            </v-card>
                          </td>
                        </tr>
                      </template>
                    </tbody>
                  </v-table>
                  
                  <!-- Paginación manual -->
                  <v-card-actions class="justify-center">
                    <v-btn 
                      icon 
                      :disabled="currentPage === 1"
                      @click="currentPage--"
                    >
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <span class="mx-4">
                      Página {{ currentPage }} de {{ totalPages }}
                    </span>
                    <v-btn 
                      icon 
                      :disabled="currentPage === totalPages"
                      @click="currentPage++"
                    >
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <!-- Columna lateral: Ventas y Clientes -->
        <v-col cols="12" md="4">
          <!-- Lista de Compras -->
          <v-card class="pa-4 compras-card mb-4" elevation="10">
            <div class="d-flex align-center mb-2">
              <v-icon color="teal" class="mr-2">mdi-cart</v-icon>
              <span class="text-h6 font-weight-bold">Ventas</span>
              <v-spacer />
              <v-btn icon color="teal" @click="dialogs.showCompra = true">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
            <v-text-field
              v-model="searchComprasQuery"
              append-icon="mdi-magnify"
              label="Buscar compras"
              dense 
              hide-details
              class="mb-2"
              outlined
              clearable
            />
            <v-virtual-scroll :items="filteredCompras" height="370" item-height="56">
              <template #default="{ item }">
                <v-list-item 
                  class="compra-list-item" 
                  @mouseenter="hoveredCompra = item.id_compra" 
                  @mouseleave="hoveredCompra = null"
                >
                  <template #prepend>
                    <v-avatar color="green lighten-4" size="40">
                      <span class="white--text">{{ getInitials(item.Cliente) }}</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-bold">
                    {{ item.Cliente?.nombre_cliente }} {{ item.Cliente?.apellido_paterno }} {{ item.Cliente?.apellido_materno }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-icon small color="grey">mdi-package</v-icon> {{ item.Paquete?.nombre_paquete }}<br>
                    <v-icon small color="grey">mdi-calendar</v-icon> {{ item.fecha_compra }}<br>
                    <v-icon small color="grey">mdi-currency-usd</v-icon> ${{ item.monto_original }} - Pagado: ${{ item.monto_pagado }}
                  </v-list-item-subtitle>
                  <template #append v-if="hoveredCompra === item.id_compra">
                    <v-btn 
                      icon 
                      small 
                      color="teal" 
                      @click="handleGeneratePDF(item)"
                      :loading="isGeneratingPDF"
                      class="mr-1"
                    >
                      <v-tooltip activator="parent" location="top">Generar ticket PDF</v-tooltip>
                      <v-icon>mdi-file-pdf-box</v-icon>
                    </v-btn>
                    <v-btn 
                      icon 
                      small 
                      :color="item.estado_compra === 'Completado' ? 'grey' : 'teal'"
                      @click="handleAbonarCompra(item)"
                      :disabled="item.estado_compra === 'Completado'"
                      class="mr-1"
                    >
                      <v-tooltip activator="parent" location="top">Abonar o liquidar compra</v-tooltip>
                      <v-icon>{{ item.estado_compra === 'Completado' ? 'mdi-check-circle' : 'mdi-cash-plus' }}</v-icon>
                    </v-btn>
                    <v-btn 
                      icon 
                      small 
                      color="red" 
                      @click="openDeleteCompraDialog(item)"
                    >
                      <v-tooltip activator="parent" location="top">Eliminar compra</v-tooltip>
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
                <v-divider />
              </template>
            </v-virtual-scroll>
          </v-card>

          <!-- Lista de Clientes -->
          <v-card class="pa-4 clientes-card" elevation="10">
            <div class="d-flex align-center mb-2">
              <v-icon color="teal" class="mr-2">mdi-account-group</v-icon>
              <span class="text-h6 font-weight-bold">Clientes</span>
              <v-spacer />
              <v-btn icon color="teal" @click="dialogs.show = true">
                <v-icon>mdi-account-plus</v-icon>
              </v-btn>
            </div>
            <v-text-field
              v-model="searchQuery"
              append-icon="mdi-magnify"
              label="Buscar clientes"
              dense 
              hide-details
              class="mb-2"
              outlined
            />
            <v-virtual-scroll :items="filteredClientes" height="370" item-height="56">
              <template #default="{ item }">
                <v-list-item 
                  class="cliente-list-item" 
                  @mouseenter="hoveredCliente = item.id_cliente" 
                  @mouseleave="hoveredCliente = null"
                >
                  <template #prepend>
                    <v-avatar color="teal lighten-4" size="40">
                      <span class="white--text">{{ getInitials(item) }}</span>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="font-weight-bold">
                    {{ item.nombre_cliente }} {{ item.apellido_paterno }} {{ item.apellido_materno }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-icon small color="grey">mdi-email</v-icon> {{ item.email }}<br>
                    <v-icon small color="grey">mdi-phone</v-icon> {{ item.telefono_cliente }}
                  </v-list-item-subtitle>
                  <template #append v-if="hoveredCliente === item.id_cliente">
                    <v-btn 
                      icon 
                      small 
                      color="primary" 
                      @click="openEditDialog(item)"
                      class="mr-1"
                    >
                      <v-tooltip activator="parent" location="top">Editar cliente</v-tooltip>
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn 
                      icon 
                      small 
                      color="red" 
                      @click="openDeleteDialog(item)"
                    >
                      <v-tooltip activator="parent" location="top">Eliminar cliente</v-tooltip>
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
                <v-divider />
              </template>
            </v-virtual-scroll>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Diálogos de Cliente -->
    <v-dialog v-model="dialogs.show" persistent width="1024">
      <cliente-dialog
        :showDialog="dialogs.show"
        @close="dialogs.show = false"
        @addCliente="addCliente"
      />
    </v-dialog>
    <v-dialog v-model="dialogs.edit" max-width="500px">
      <cliente-dialog
        :clienteEdit="selectedClient"
        @updateCliente="updateCliente"
        @close="dialogs.edit = false"
      />
    </v-dialog>
    <v-dialog v-model="dialogs.delete" max-width="500px">
      <v-card>
        <v-card-title class="headline">Confirmación de eliminación</v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar el cliente con ID
          {{ clientToDelete.id_cliente }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="blue darken-1" @click="dialogs.delete = false">No</v-btn>
          <v-btn text color="red darken-1" @click="confirmDelete">Sí</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogos de Compra -->
    <v-dialog v-model="dialogs.showCompra" persistent max-width="600px">
      <compra-dialog 
        :show-dialog="dialogs.showCompra" 
        @close="dialogs.showCompra = false" 
        @addCompra="handleAddCompra" 
      />
    </v-dialog>
    <v-dialog v-model="dialogs.deleteCompra" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Confirmar Eliminación</v-card-title>
        <v-card-text>
          ¿Está seguro de eliminar la compra {{ compraToDelete.id_compra }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="green darken-1" text @click="dialogs.deleteCompra = false">Cancelar</v-btn>
          <v-btn color="red darken-1" text @click="confirmDeleteCompra">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de PDF -->
    <pdf-confirmation-dialog
      :show="dialogs.showPDFConfirmation"
      :compra="compraForPDF"
      @close="dialogs.showPDFConfirmation = false"
      @pdfGenerated="handlePDFGenerated"
    />

    <!-- Diálogo de abono -->
    <abonar-compra-dialog 
      :show="dialogs.showAbonar" 
      :compra="compraToAbonar" 
      @close="dialogs.showAbonar = false" 
      @abonado="handleAbonado" 
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from "vue";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, format } from "date-fns";
import apiService from "@/services/apiServices";
import ClienteDialog from "@/components/ClienteDialog.vue";
import CompraDialog from "@/components/CompraDialog.vue";
import useClientes from "@/composables/useClientes";
import useCompras from "@/composables/useCompras";
import usePDF from "@/composables/usePDF.js";
import store from "@/store";
import AbonarCompraDialog from "@/components/AbonarCompraDialog.vue";

// --- Estado general ---
const isLoading = ref(true);
const dialogs = reactive({
  show: false,
  edit: false,
  delete: false,
  showCompra: false,
  deleteCompra: false,
  showPDFConfirmation: false,
  showAbonar: false,
});
const selectedClient = ref(null);
const clientToDelete = ref({});
const compraToDelete = ref({});
const compraForPDF = ref(null);
const compraToAbonar = ref(null);
const searchQuery = ref("");
const searchComprasQuery = ref("");
const hoveredCliente = ref(null);
const hoveredCompra = ref(null);
const expandedRows = ref([]);
const detalleCompradoresPorFecha = ref({});
const currentPage = ref(1);
const totalPages = ref(1);

// --- Clientes y Compras ---
const { clientes, addCliente, updateCliente, deleteCliente } = useClientes();
const { compras, addCompra, deleteCompra, abonarCompra } = useCompras();
const { isGeneratingPDF, generateTicketPDF } = usePDF();
const idSpa = store.getters.idSpa;

// --- Dashboard ---
const dashboard = reactive({
  periodos: ["Esta semana", "Este mes", "Rango personalizado"],
  periodo: "Esta semana",
  menuFechas: false,
  rangoFechas: { start: null, end: null },
  fechaTexto: "",
  kpis: [
    { titulo: "Total Ventas", valor: 0 },
    { titulo: "Ingresos Originales", valor: "$0.00" },
    { titulo: "Ingresos Cobrados", valor: "$0.00" },
    { titulo: "Pendientes Pago", valor: "$0.00" },
  ],
  chartSeries: [{ name: "Ventas", data: [] }],
  chartOptions: {
    chart: { toolbar: { show: false } },
    xaxis: { categories: [] },
    title: { text: "Ventas por Día", align: "left" },
  },
  tableHeaders: [
    { title: "Fecha", value: "fecha" },
    { title: "Compras", value: "total_compras" },
    { title: "Ingresos", value: "ventas_original" },
    { title: "Pagadas", value: "ventas_pagadas" },
    { title: "Pendientes", value: "ventas_pendientes" },
  ],
  tableData: [],
  esLocale: { id: "es", firstDayOfWeek: 1, masks: { L: "YYYY-MM-DD" } },
});

// --- Computed ---
const filteredClientes = computed(() => {
  if (!searchQuery.value) return clientes.value;
  return clientes.value.filter((c) =>
    [c.nombre_cliente, c.apellido_paterno, c.apellido_materno, c.email, c.telefono_cliente]
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase())
  );
});

const filteredCompras = computed(() => {
  if (!searchComprasQuery.value) return compras.value;
  return compras.value.filter((compra) => {
    return (
      compra.Cliente?.nombre_cliente?.toLowerCase().includes(searchComprasQuery.value.toLowerCase()) ||
      compra.Cliente?.apellido_paterno?.toLowerCase().includes(searchComprasQuery.value.toLowerCase()) ||
      compra.Cliente?.apellido_materno?.toLowerCase().includes(searchComprasQuery.value.toLowerCase()) ||
      compra.Paquete?.nombre_paquete?.toLowerCase().includes(searchComprasQuery.value.toLowerCase()) ||
      compra.fecha_compra?.toLowerCase().includes(searchComprasQuery.value.toLowerCase()) ||
      compra.estado_compra?.toLowerCase().includes(searchComprasQuery.value.toLowerCase())
    );
  });
});

const paginatedTableData = computed(() => {
  const start = (currentPage.value - 1) * 10;
  const end = start + 10;
  return dashboard.tableData.slice(start, end);
});

// --- Métodos y lógica ---
const getInitials = (cliente) => {
  if (!cliente) return '';
  return (cliente.nombre_cliente?.[0] || '') + (cliente.apellido_paterno?.[0] || '');
};

const openEditDialog = (c) => {
  selectedClient.value = { ...c };
  dialogs.edit = true;
};
const openDeleteDialog = (c) => {
  clientToDelete.value = c;
  dialogs.delete = true;
};
const confirmDelete = () => {
  deleteCliente(clientToDelete.value);
  dialogs.delete = false;
};

const handleAddCompra = async (compra) => {
  try {
    const addedCompra = await addCompra(compra);
    dialogs.showCompra = false;
    
    // Mostrar diálogo de confirmación de PDF
    compraForPDF.value = addedCompra;
    dialogs.showPDFConfirmation = true;
  } catch (error) {
    console.error('Error al agregar compra:', error);
  }
};

const handlePDFGenerated = (compra) => {
  console.log('PDF generado para la compra:', compra);
  // Aquí puedes agregar lógica adicional después de generar el PDF
};

const openDeleteCompraDialog = (compra) => {
  compraToDelete.value = compra;
  dialogs.deleteCompra = true;
};

const confirmDeleteCompra = () => {
  handleDeleteCompra(compraToDelete.value);
  dialogs.deleteCompra = false;
};

const handleDeleteCompra = async (compra) => {
  try {
    await deleteCompra(compra);
    const idx = compras.value.findIndex((c) => c.id_compra === compra.id_compra);
    if (idx !== -1) compras.value.splice(idx, 1);
  } catch (e) {
    console.error(e);
  }
};

const handleAbonarCompra = async (compra) => {
  // Solo permitir abonar si la compra no está completada
  if (compra.estado_compra === 'Completado') {
    return;
  }
  
  compraToAbonar.value = compra;
  dialogs.showAbonar = true;
};

const handleAbonado = async (datosAbono) => {
  try {
    await abonarCompra(datosAbono);
    
    // Actualizar la compra en la lista local
    const idx = compras.value.findIndex((c) => c.id_compra === datosAbono.id_compra);
    if (idx !== -1) {
      compras.value[idx].monto_pagado = datosAbono.nuevo_monto_pagado;
      compras.value[idx].monto_adeudado = datosAbono.nuevo_monto_adeudado;
      compras.value[idx].estado_compra = datosAbono.nuevo_estado;
    }
    
    // Recargar el dashboard para actualizar las estadísticas
    await fetchDashboard();
    
  } catch (error) {
    console.error('Error al procesar el abono:', error);
  }
};

const handleGeneratePDF = async (compra) => {
  try {
    await generateTicketPDF(compra);
  } catch (error) {
    console.error('Error al generar PDF:', error);
  }
};

const toggleRowDetails = async (item) => {
  console.log('Toggle row details for:', item);
  const index = expandedRows.value.indexOf(item);
  if (index > -1) {
    // Cerrar la fila
    expandedRows.value.splice(index, 1);
  } else {
    // Abrir la fila y cargar detalles
    expandedRows.value = [item];
    await loadComprasDetalle(item);
  }
};

const loadComprasDetalle = async (item) => {
  try {
    console.log('Loading details for date:', item.fecha);
    console.log('Available dates:', Object.keys(detalleCompradoresPorFecha.value));
    console.log('Item fecha type:', typeof item.fecha);
    console.log('Available dates types:', Object.keys(detalleCompradoresPorFecha.value).map(d => typeof d));
    // Usar los detalles agrupados por fecha
    item.detalleCompras = detalleCompradoresPorFecha.value[item.fecha] || [];
    console.log('Loaded details:', item.detalleCompras);
  } catch (error) {
    console.error('Error al cargar detalles:', error);
    item.detalleCompras = [];
  }
};

async function fetchDashboard() {
  let inicio, fin;
  const hoy = new Date();
  if (dashboard.periodo === "Esta semana") {
    inicio = startOfWeek(hoy, { weekStartsOn: 1 });
    fin = endOfWeek(hoy, { weekStartsOn: 1 });
  } else if (dashboard.periodo === "Este mes") {
    inicio = startOfMonth(hoy);
    fin = endOfMonth(hoy);
  } else if (dashboard.rangoFechas.start && dashboard.rangoFechas.end) {
    inicio = dashboard.rangoFechas.start;
    fin = dashboard.rangoFechas.end;
  } else {
    return;
  }

  // Totales
  const [
    { total_compras, ventas_original, ventas_pagadas, ventas_pendientes },
  ] = await apiService.getVentasPorRango({
    inicio: format(inicio, "yyyy-MM-dd"),
    fin: format(fin, "yyyy-MM-dd"),
  });

  dashboard.kpis[0].valor = total_compras;
  dashboard.kpis[1].valor = `$${Number(ventas_original).toFixed(2)}`;
  dashboard.kpis[2].valor = `$${Number(ventas_pagadas).toFixed(2)}`;
  dashboard.kpis[3].valor = `$${Number(ventas_pendientes).toFixed(2)}`;

  // Detalle diario
  const detalle = await apiService.getVentasDetallePorRango({
    inicio: format(inicio, "yyyy-MM-dd"),
    fin: format(fin, "yyyy-MM-dd"),
  });

  // Nuevo: obtener detalles de compradores
  const detalleCompradores = await apiService.getVentasDetalleCompradores({
    inicio: format(inicio, "yyyy-MM-dd"),
    fin: format(fin, "yyyy-MM-dd"),
  });
  console.log('Detalle compradores raw:', detalleCompradores);
  // Agrupar por fecha
  detalleCompradoresPorFecha.value = {};
  detalleCompradores.forEach(compra => {
    const fecha = compra.fecha_compra;
    if (!detalleCompradoresPorFecha.value[fecha]) {
      detalleCompradoresPorFecha.value[fecha] = [];
    }
    detalleCompradoresPorFecha.value[fecha].push(compra);
  });
  console.log('Detalle compradores agrupados:', detalleCompradoresPorFecha.value);

  const fechas = detalle.map((d) => d.fecha);
  const datos = detalle.map((d) => d.total_compras);

  dashboard.chartOptions = {
    chart: { toolbar: { show: false } },
    xaxis: { categories: fechas },
    title: { text: "Ventas por Día", align: "left" },
  };
  dashboard.chartSeries = [{ name: "Ventas", data: datos }];
  dashboard.tableData = detalle;

  totalPages.value = Math.ceil(dashboard.tableData.length / 10);
}

// --- Watchers ---
onMounted(async () => {
  try {
    clientes.value = await apiService.getClientes({ idSpa });
    compras.value = await apiService.getCompras();
    await fetchDashboard();
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
});

watch(() => dashboard.periodo, fetchDashboard);

watch(
  () => dashboard.rangoFechas,
  ({ start, end }) => {
    if (start && end) {
      dashboard.fechaTexto = `${format(start, "yyyy-MM-dd")} – ${format(end, "yyyy-MM-dd")}`;
      dashboard.menuFechas = false;
      fetchDashboard();
    }
  },
  { deep: true }
);
</script>

<script>
export default {
  name: 'ClientesView'
}
</script>

<style scoped>
/* Estilos para modo claro */
.v-application:not(.v-theme--dark) {
  .hover-row:hover {
    background-color: #f5f5f5 !important;
    transition: background-color 0.3s ease;
  }
  
  .v-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .v-table thead th {
    background-color: #f8f9fa !important;
    color: #333 !important;
    font-weight: 600;
    border-bottom: 2px solid #e0e0e0;
    padding: 16px 8px;
  }
  
  .v-table tbody td {
    padding: 12px 8px;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .v-table tbody tr:last-child td {
    border-bottom: none;
  }
}

/* Estilos para modo oscuro */
.v-application.v-theme--dark {
  .hover-row:hover {
    background-color: #424242 !important;
    transition: background-color 0.3s ease;
  }
  
  .v-table {
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .v-table thead th {
    background-color: #424242 !important;
    color: #fff !important;
    font-weight: 600;
    border-bottom: 2px solid #616161;
    padding: 16px 8px;
  }
  
  .v-table tbody td {
    padding: 12px 8px;
    border-bottom: 1px solid #424242;
  }
  
  .v-table tbody tr:last-child td {
    border-bottom: none;
  }
}

/* Estilos generales */
.v-card {
  border-radius: 12px;
  transition: all 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.v-btn {
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}

/* Animación para las filas expandidas */
.v-card-actions {
  border-top: 1px solid #e0e0e0;
  background-color: #fafafa;
}

.v-theme--dark .v-card-actions {
  border-top: 1px solid #424242;
  background-color: #2d2d2d;
}

/* Estilos para los detalles expandidos */
.detail-card {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-left: 4px solid #007bff;
}

.v-theme--dark .detail-card {
  background: linear-gradient(135deg, #424242 0%, #2d2d2d 100%);
  border-left: 4px solid #64b5f6;
}

/* Estilos para las tarjetas de compras */
.compra-detail-card {
  transition: all 0.3s ease;
  border-radius: 8px;
  min-height: 260px;
  height: 100%;
}

.compra-detail-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.v-theme--dark .compra-detail-card {
  background-color: #424242;
  border: 1px solid #616161;
}

.v-theme--dark .compra-detail-card:hover {
  background-color: #4a4a4a;
  border-color: #757575;
}

/* Colores para los estados */
.text-success {
  color: #28a745 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.v-theme--dark .text-success {
  color: #4caf50 !important;
}

.v-theme--dark .text-warning {
  color: #ff9800 !important;
}

/* Responsive */
@media (max-width: 768px) {
  .v-table {
    font-size: 0.875rem;
  }
  
  .v-table thead th,
  .v-table tbody td {
    padding: 8px 4px;
  }
}

.v-theme--dark .clientes-hero-bg {
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
}

.kpi-mini-card {
  border-radius: 12px;
  text-align: center;
  background: #f1f8e9;
  transition: background-color 0.3s ease;
}

.v-theme--dark .kpi-mini-card {
  background: #2d2d2d;
}

.dashboard-card {
  border-radius: 24px;
  background: #fafafa;
  transition: background-color 0.3s ease;
}

.v-theme--dark .dashboard-card {
  background: #1e1e1e;
}

.clientes-card {
  border-radius: 24px;
  background: #fff;
  transition: background-color 0.3s ease;
}

.v-theme--dark .clientes-card {
  background: #2d2d2d;
}

.compras-card {
  border-radius: 24px;
  background: #fff;
  transition: background-color 0.3s ease;
}

.v-theme--dark .compras-card {
  background: #2d2d2d;
}

.cliente-list-item {
  transition: background 0.2s;
}

.cliente-list-item:hover {
  background: #e0f2f1;
}

.v-theme--dark .cliente-list-item:hover {
  background: #3d3d3d;
}

.compra-list-item {
  transition: background 0.2s;
}

.compra-list-item:hover {
  background: #e8f5e8;
}

.v-theme--dark .compra-list-item:hover {
  background: #3d3d3d;
}

.full-height {
  height: 80vh;
}

/* Mejorar el layout de las columnas */
.v-col.d-flex {
  display: flex !important;
}

.flex-grow-1 {
  flex-grow: 1;
}

/* Estilos para tooltips */
.v-tooltip {
  z-index: 9999;
}

/* Mejorar la legibilidad del texto truncado */
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Responsividad mejorada para las tarjetas */
@media (max-width: 600px) {
  .compra-detail-card {
    min-height: 230px;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .compra-detail-card {
    min-height: 250px;
  }
}

@media (min-width: 961px) and (max-width: 1264px) {
  .compra-detail-card {
    min-height: 260px;
  }
}

@media (min-width: 1265px) {
  .compra-detail-card {
    min-height: 280px;
  }
}

/* Estilos para la tabla que ocupe todo el espacio */
.table-container {
  width: 100%;
  overflow: hidden;
}

.full-width-table {
  width: 100%;
  table-layout: fixed;
}

.full-width-table th,
.full-width-table td {
  padding: 20px 16px;
  word-wrap: break-word;
  font-size: 1rem;
}

.full-width-table th:nth-child(1) { width: 15%; } /* Fecha */
.full-width-table th:nth-child(2) { width: 10%; } /* Compras */
.full-width-table th:nth-child(3) { width: 20%; } /* Ingresos */
.full-width-table th:nth-child(4) { width: 20%; } /* Pagadas */
.full-width-table th:nth-child(5) { width: 20%; } /* Pendientes */
.full-width-table th:nth-child(6) { width: 15%; } /* Acciones */
</style>