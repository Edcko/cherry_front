<template>
  <v-card class="modern-hora-card">
    <!-- Header con icono y hora -->
    <div class="card-header" style="border-left-color: #4caf50;">
      <div class="status-badge" style="background-color: #4caf50;">
        <v-icon size="16" color="white">mdi-clock-outline</v-icon>
        <span>DISPONIBLE</span>
      </div>
      <div class="date-time">
        <v-icon size="18" color="grey">mdi-access-time</v-icon>
        <span>{{ hora }}</span>
      </div>
    </div>

    <!-- Contenido principal -->
    <v-card-text class="card-content">
      <!-- Información de disponibilidad -->
      <div class="availability-section">
        <div class="availability-icon">
          <v-icon size="24" color="success">mdi-check-circle</v-icon>
        </div>
        <div class="availability-info">
          <h3 class="availability-title">Hora Libre</h3>
          <p class="availability-detail">Cabina disponible para agendar</p>
        </div>
      </div>

      <!-- Información adicional para equilibrar altura -->
      <div class="additional-info">
        <div class="info-item">
          <div class="info-icon">
            <v-icon size="18" color="grey">mdi-calendar-check</v-icon>
          </div>
          <div class="info-content">
            <label>Estado</label>
            <span>Disponible para agendar</span>
          </div>
        </div>
        
        <div class="info-item">
          <div class="info-icon">
            <v-icon size="18" color="grey">mdi-clock</v-icon>
          </div>
          <div class="info-content">
            <label>Duración</label>
            <span>1 hora estándar</span>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="action-section">
        <v-btn
          color="success"
          variant="outlined"
          size="small"
          @click="agendarCita"
          class="action-btn primary"
        >
          <v-icon size="18" class="mr-2">mdi-plus-circle</v-icon>
          Agregar Cita
        </v-btn>
        
        <v-btn
          color="warning"
          variant="outlined"
          size="small"
          @click="abrirCerrarCabinaDialog"
          class="action-btn secondary"
        >
          <v-icon size="18" class="mr-2">mdi-close-circle</v-icon>
          Cerrar Cabina
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "HoraLibreCard",
  props: ["hora"],
  methods: {
    agendarCita() {
      this.$emit("agendar", this.hora);
    },
    abrirCerrarCabinaDialog() {
      this.$emit("cerrarCabina", this.hora);
    }
  },
};
</script>

<style scoped>
.modern-hora-card {
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  background: white;
  border: 1px solid #f0f0f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
  min-width: 250px;
  max-width: 350px;
  height: 420px; /* Aumentamos altura para evitar que se corte el botón */
  display: flex;
  flex-direction: column;
}

.modern-hora-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #e0e0e0;
}

/* Header */
.card-header {
  padding: 20px 24px 16px 24px;
  background: #fafafa;
  border-left: 4px solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  flex-shrink: 0;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.date-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Contenido */
.card-content {
  padding: 20px 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.availability-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #f1f8e9;
  border-radius: 12px;
  border: 1px solid #c8e6c9;
  flex-shrink: 0;
}

.availability-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #e8f5e8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.availability-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #2e7d32;
  line-height: 1.3;
}

.availability-detail {
  margin: 4px 0 0 0;
  font-size: 0.875rem;
  color: #558b2f;
  font-weight: 500;
}

/* Información adicional */
.additional-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
  flex: 1;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.info-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.info-content label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-content span {
  font-size: 0.875rem;
  color: #1a1a1a;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
}

/* Acciones */
.action-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
  flex-shrink: 0;
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0.3px;
  height: 40px;
}

.action-btn.primary {
  border: 2px solid #4caf50 !important;
  color: #4caf50 !important;
  background-color: transparent !important;
}

.action-btn.primary:hover {
  background-color: #4caf50 !important;
  color: white !important;
}

.action-btn.secondary {
  border: 2px solid #ff9800 !important;
  color: #ff9800 !important;
  background-color: transparent !important;
}

.action-btn.secondary:hover {
  background-color: #ff9800 !important;
  color: white !important;
}

/* Responsive */
@media (max-width: 768px) {
  .modern-hora-card {
    min-width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 350px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .availability-section {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .additional-info {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .action-section {
    flex-direction: row;
    gap: 8px;
  }
  
  .action-btn {
    flex: 1;
    font-size: 0.8rem;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .modern-hora-card {
    margin: 8px;
    border-radius: 12px;
    height: auto;
    min-height: 320px;
    max-width: calc(100vw - 16px);
  }
  
  .card-header,
  .card-content {
    padding: 12px;
  }
  
  .availability-title {
    font-size: 0.95rem;
  }
  
  .action-section {
    flex-direction: column;
    gap: 8px;
  }
  
  .action-btn {
    font-size: 0.8rem;
    height: 40px;
    width: 100%;
  }
  
  .availability-detail {
    font-size: 0.8rem;
  }
  
  .info-content span {
    font-size: 0.8rem;
  }
}
</style>
