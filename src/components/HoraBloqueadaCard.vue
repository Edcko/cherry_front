<template>
  <v-card class="modern-bloqueo-card">
    <!-- Header con icono y hora -->
    <div class="card-header" style="border-left-color: #f44336;">
      <div class="status-badge" style="background-color: #f44336;">
        <v-icon size="16" color="white">mdi-lock</v-icon>
        <span>BLOQUEADO</span>
      </div>
      <div class="date-time">
        <v-icon size="18" color="grey">mdi-access-time</v-icon>
        <span>{{ hora }}</span>
      </div>
    </div>

    <!-- Contenido principal -->
    <v-card-text class="card-content">
      <!-- Información del bloqueo -->
      <div class="bloqueo-section">
        <div class="bloqueo-icon">
          <v-icon size="24" color="error">mdi-lock-clock</v-icon>
        </div>
        <div class="bloqueo-info">
          <h3 class="bloqueo-title">Hora Bloqueada</h3>
          <p class="bloqueo-detail">{{ motivoBloqueo }}</p>
        </div>
      </div>

      <!-- Información adicional para equilibrar altura -->
      <div class="additional-info">
        <div class="info-item">
          <div class="info-icon">
            <v-icon size="18" color="grey">mdi-calendar</v-icon>
          </div>
          <div class="info-content">
            <label>Estado</label>
            <span>Hora no disponible</span>
          </div>
        </div>
        
        <div class="info-item">
          <div class="info-icon">
            <v-icon size="18" color="grey">mdi-information</v-icon>
          </div>
          <div class="info-content">
            <label>Tipo</label>
            <span>Bloqueo temporal</span>
          </div>
        </div>
      </div>

      <!-- Acciones -->
      <div class="action-section">
        <v-btn
          v-if="canLiberar"
          color="success"
          variant="outlined"
          size="small"
          @click="$emit('liberar', idBloqueo)"
          class="action-btn primary"
        >
          <v-icon size="18" class="mr-2">mdi-lock-open</v-icon>
          Liberar Hora
        </v-btn>
        
        <div v-else class="no-action-message">
          <v-icon size="16" color="grey">mdi-information</v-icon>
          <span>No se puede liberar esta hora</span>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: "HoraBloqueadaCard",
  props: {
    idBloqueo: {
      type: Number,
      required: true,
    },
    hora: {
      type: String,
      required: true,
    },
    motivoBloqueo: {
      type: String,
      default: "Bloqueo",
    },
    canLiberar: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.modern-bloqueo-card {
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
  height: 420px; /* Aumentamos altura para mantener consistencia */
  display: flex;
  flex-direction: column;
}

.modern-bloqueo-card:hover {
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

.bloqueo-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #ffebee;
  border-radius: 12px;
  border: 1px solid #ffcdd2;
  flex-shrink: 0;
}

.bloqueo-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #ffcdd2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bloqueo-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #c62828;
  line-height: 1.3;
}

.bloqueo-detail {
  margin: 4px 0 0 0;
  font-size: 0.875rem;
  color: #d32f2f;
  font-weight: 500;
  word-break: break-word;
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
  border-color: #4caf50;
  color: #4caf50;
}

.action-btn.primary:hover {
  background-color: #4caf50;
  color: white;
}

.no-action-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
  color: #666;
  font-size: 0.875rem;
  font-style: italic;
  justify-content: center;
}

/* Responsive */
@media (max-width: 768px) {
  .modern-bloqueo-card {
    min-width: 100%;
    max-width: 100%;
    height: auto;
    min-height: 350px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    flex-shrink: 0;
  }
  
  .bloqueo-section {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  
  .additional-info {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .action-btn {
    width: 100%;
    font-size: 0.8rem;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .modern-bloqueo-card {
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
  
  .bloqueo-title {
    font-size: 0.95rem;
  }
  
  .action-btn {
    font-size: 0.8rem;
    height: 40px;
  }
  
  .bloqueo-detail {
    font-size: 0.8rem;
  }
  
  .info-content span {
    font-size: 0.8rem;
  }
}
</style>
