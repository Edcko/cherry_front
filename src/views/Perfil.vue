<template>
  <v-container fluid class="pa-0">
    <!-- Debug info - Solo en desarrollo -->
    <v-card v-if="false" class="mb-4">
      <v-card-title>Debug Info</v-card-title>
      <v-card-text>
        <p>User: {{ user }}</p>
        <p>User type: {{ typeof user }}</p>
        <p>User value: {{ user ? user.nombre_empleado : 'No user' }}</p>
      </v-card-text>
    </v-card>

    <!-- Loading state -->
    <v-container v-if="!user" fluid class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <div class="loading-container">
            <v-progress-circular
              indeterminate
              color="primary"
              size="80"
              width="6"
              class="loading-spinner"
            ></v-progress-circular>
            <p class="text-h5 mt-6 text-grey-600 font-weight-light">Cargando tu perfil...</p>
            <div class="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Profile content -->
    <div v-else-if="user && user.nombre_empleado" class="profile-container">
      <!-- Hero Section with Parallax Effect -->
      <div class="hero-section">
        <div class="hero-background">
          <div class="hero-overlay"></div>
          <div class="floating-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
          </div>
        </div>
        
        <v-container class="hero-content">
          <v-row align="end" class="fill-height">
            <v-col cols="12" class="d-flex align-end">
              <div class="profile-avatar-container">
                <div class="avatar-ring">
                  <v-avatar
                    size="180"
                    class="profile-avatar"
                    @click="openAvatarDialog = true"
                  >
                    <v-img 
                      cover 
                      :src="user.avatar || '../assets/img/login.png'"
                      class="avatar-image"
                    ></v-img>
                    <div class="avatar-overlay">
                      <v-icon color="white" size="32">mdi-camera</v-icon>
                      <span class="avatar-hint">Cambiar foto</span>
                    </div>
                  </v-avatar>
                </div>
              </div>
              
              <div class="profile-info">
                <h1 class="hero-title">
                  {{ user.nombre_empleado }} {{ user.apellido_paterno }} {{ user.apellido_materno }}
                </h1>
                <div class="role-badge">
                  <v-chip
                    :color="getRoleColor(user.tipo_empleado)"
                    text-color="white"
                    class="role-chip"
                    size="large"
                    elevation="8"
                  >
                    <v-icon left size="20">mdi-badge-account</v-icon>
                    {{ user.tipo_empleado }}
                  </v-chip>
                </div>
                <p class="hero-subtitle">
                  <v-icon size="18" class="mr-2">mdi-email</v-icon>
                  {{ user.email }}
                </p>
              </div>
              
              <v-spacer></v-spacer>
              
              <div class="action-buttons">
                <v-btn
                  fab
                  large
                  color="white"
                  class="edit-profile-btn"
                  elevation="12"
                  @click="openEditDialog = true"
                >
                  <v-icon color="primary" size="28">mdi-pencil</v-icon>
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <!-- Main Content -->
      <v-container class="main-content">
        <v-row>
          <!-- Information Cards -->
          <v-col cols="12" lg="8">
            <!-- Personal Information Card -->
            <v-card class="info-card mb-6" elevation="8">
              <div class="card-header">
                <v-icon color="primary" size="32" class="mr-3">mdi-account-circle</v-icon>
                <h2 class="card-title">Información Personal</h2>
              </div>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12" sm="6" md="4" v-for="(item, index) in personalInfo" :key="index">
                    <div class="info-item">
                      <div class="info-icon">
                        <v-icon :color="item.color" size="24">{{ item.icon }}</v-icon>
                      </div>
                      <div class="info-content">
                        <h4 class="info-label">{{ item.label }}</h4>
                        <p class="info-value">{{ item.value }}</p>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Statistics Cards -->
            <v-card class="stats-card mb-6" elevation="8">
              <div class="card-header">
                <v-icon color="success" size="32" class="mr-3">mdi-chart-line</v-icon>
                <h2 class="card-title">Estadísticas</h2>
              </div>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12" sm="6" md="3" v-for="(stat, index) in statistics" :key="index">
                    <div class="stat-card" :class="`stat-${stat.color}`">
                      <div class="stat-icon">
                        <v-icon :color="stat.color" size="48">{{ stat.icon }}</v-icon>
                      </div>
                      <div class="stat-content">
                        <h3 class="stat-value">{{ stat.value }}</h3>
                        <p class="stat-label">{{ stat.label }}</p>
                      </div>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Sidebar -->
          <v-col cols="12" lg="4">
            <!-- Quick Actions -->
            <v-card class="sidebar-card mb-6" elevation="8">
              <div class="card-header">
                <v-icon color="warning" size="32" class="mr-3">mdi-lightning-bolt</v-icon>
                <h2 class="card-title">Acciones Rápidas</h2>
              </div>
              <v-card-text class="pa-4">
                <div class="action-list">
                  <div 
                    v-for="(action, index) in quickActions" 
                    :key="index"
                    class="action-item"
                    @click="action.handler"
                  >
                    <div class="action-icon">
                      <v-icon :color="action.color" size="24">{{ action.icon }}</v-icon>
                    </div>
                    <div class="action-content">
                      <h4 class="action-title">{{ action.title }}</h4>
                      <p class="action-description">{{ action.description }}</p>
                    </div>
                    <v-icon color="grey" size="20">mdi-chevron-right</v-icon>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Additional Info -->
            <v-card class="sidebar-card" elevation="8">
              <div class="card-header">
                <v-icon color="info" size="32" class="mr-3">mdi-information</v-icon>
                <h2 class="card-title">Información Adicional</h2>
              </div>
              <v-card-text class="pa-4">
                <div class="info-list">
                  <div class="info-status">
                    <div class="status-indicator active"></div>
                    <div class="status-content">
                      <h4 class="status-title">Estado: Activo</h4>
                      <p class="status-description">Empleado en servicio</p>
                    </div>
                  </div>
                  
                  <div class="info-status">
                    <div class="status-indicator info"></div>
                    <div class="status-content">
                      <h4 class="status-title">Último acceso</h4>
                      <p class="status-description">{{ formatDateTime(new Date()) }}</p>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Diálogo de edición de perfil -->
      <v-dialog v-model="openEditDialog" max-width="700px" persistent>
        <v-card class="edit-dialog">
          <div class="dialog-header">
            <v-icon color="primary" size="32" class="mr-3">mdi-account-edit</v-icon>
            <h2 class="dialog-title">Editar Perfil</h2>
          </div>
          <v-card-text class="pa-6">
            <v-form ref="editForm" v-model="editFormValid">
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editForm.nombre_empleado"
                    label="Nombre"
                    :rules="[rules.required]"
                    outlined
                    dense
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editForm.apellido_paterno"
                    label="Apellido Paterno"
                    :rules="[rules.required]"
                    outlined
                    dense
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editForm.apellido_materno"
                    label="Apellido Materno"
                    outlined
                    dense
                    prepend-inner-icon="mdi-account"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editForm.email"
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    outlined
                    dense
                    prepend-inner-icon="mdi-email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editForm.telefono_empleado"
                    label="Teléfono"
                    outlined
                    dense
                    prepend-inner-icon="mdi-phone"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editForm.direccion"
                    label="Dirección"
                    outlined
                    dense
                    prepend-inner-icon="mdi-map-marker"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-6">
            <v-spacer></v-spacer>
            <v-btn text @click="openEditDialog = false" class="cancel-btn">Cancelar</v-btn>
            <v-btn color="primary" @click="saveProfile" :loading="saving" class="save-btn">
              <v-icon left>mdi-content-save</v-icon>
              Guardar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo de cambio de avatar -->
      <v-dialog v-model="openAvatarDialog" max-width="500px" persistent>
        <v-card class="avatar-dialog">
          <div class="dialog-header">
            <v-icon color="primary" size="32" class="mr-3">mdi-camera</v-icon>
            <h2 class="dialog-title">Cambiar Avatar</h2>
          </div>
          <v-card-text class="pa-6">
            <v-file-input
              v-model="avatarFile"
              accept="image/*"
              label="Seleccionar imagen"
              prepend-icon="mdi-camera"
              outlined
              dense
              @change="previewAvatar"
              class="file-input"
            ></v-file-input>
            <div v-if="avatarPreview" class="preview-container">
              <v-img
                :src="avatarPreview"
                max-height="200"
                contain
                class="preview-image"
              ></v-img>
            </div>
          </v-card-text>
          <v-card-actions class="pa-6">
            <v-spacer></v-spacer>
            <v-btn text @click="openAvatarDialog = false" class="cancel-btn">Cancelar</v-btn>
            <v-btn color="primary" @click="uploadAvatar" :loading="uploading" class="save-btn">
              <v-icon left>mdi-upload</v-icon>
              Subir
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Diálogo de cambio de contraseña -->
      <v-dialog v-model="openPasswordDialog" max-width="600px" persistent>
        <v-card class="password-dialog">
          <div class="dialog-header">
            <v-icon color="primary" size="32" class="mr-3">mdi-lock</v-icon>
            <h2 class="dialog-title">Cambiar Contraseña</h2>
          </div>
          <v-card-text class="pa-6">
            <v-form ref="passwordForm" v-model="passwordFormValid">
              <v-text-field
                v-model="passwordForm.currentPassword"
                label="Contraseña Actual"
                type="password"
                :rules="[rules.required]"
                outlined
                dense
                prepend-inner-icon="mdi-lock"
              ></v-text-field>
              <v-text-field
                v-model="passwordForm.newPassword"
                label="Nueva Contraseña"
                type="password"
                :rules="[rules.required, rules.minLength]"
                outlined
                dense
                prepend-inner-icon="mdi-lock-plus"
              ></v-text-field>
              <v-text-field
                v-model="passwordForm.confirmPassword"
                label="Confirmar Nueva Contraseña"
                type="password"
                :rules="[rules.required, rules.confirmPassword]"
                outlined
                dense
                prepend-inner-icon="mdi-lock-check"
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions class="pa-6">
            <v-spacer></v-spacer>
            <v-btn text @click="openPasswordDialog = false" class="cancel-btn">Cancelar</v-btn>
            <v-btn color="primary" @click="changePassword" :loading="changingPassword" class="save-btn">
              <v-icon left>mdi-lock-reset</v-icon>
              Cambiar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script>
import { ref, onMounted, reactive, watch, computed } from 'vue';
import useUser from "@/composables/useUser";
import useGlobalAlert from "@/composables/useGlobalAlert";

export default {
  name: "Perfil_view",
  setup() {
    const { user, loadUser } = useUser();
    const { showAlert } = useGlobalAlert();
    
    // Estados de diálogos
    const openEditDialog = ref(false);
    const openAvatarDialog = ref(false);
    const openPasswordDialog = ref(false);
    
    // Estados de carga
    const saving = ref(false);
    const uploading = ref(false);
    const changingPassword = ref(false);
    
    // Formularios
    const editFormValid = ref(false);
    const passwordFormValid = ref(false);
    const editForm = reactive({
      nombre_empleado: '',
      apellido_paterno: '',
      apellido_materno: '',
      email: '',
      telefono_empleado: '',
      direccion: ''
    });
    
    const passwordForm = reactive({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    
    // Avatar
    const avatarFile = ref(null);
    const avatarPreview = ref(null);
    
    // Referencias de formularios
    const editFormRef = ref(null);
    const passwordFormRef = ref(null);
    
    // Datos computados para el template
    const personalInfo = computed(() => [
      {
        icon: 'mdi-email',
        label: 'Email',
        value: user.value?.email || 'No especificado',
        color: 'primary'
      },
      {
        icon: 'mdi-phone',
        label: 'Teléfono',
        value: user.value?.telefono_empleado || 'No especificado',
        color: 'success'
      },
      {
        icon: 'mdi-calendar',
        label: 'Fecha de Nacimiento',
        value: formatDate(user.value?.fecha_nacimiento),
        color: 'info'
      },
      {
        icon: 'mdi-calendar-check',
        label: 'Fecha de Contratación',
        value: formatDate(user.value?.fecha_contratacion),
        color: 'warning'
      },
      {
        icon: 'mdi-map-marker',
        label: 'Dirección',
        value: user.value?.direccion || 'No especificada',
        color: 'purple'
      },
      {
        icon: 'mdi-identifier',
        label: 'ID de Empleado',
        value: user.value?.id_empleado || 'N/A',
        color: 'grey'
      }
    ]);

    const statistics = computed(() => [
      {
        icon: 'mdi-calendar-check',
        label: 'Citas Completadas',
        value: stats.citasCompletadas || 0,
        color: 'success'
      },
      {
        icon: 'mdi-account-group',
        label: 'Clientes Atendidos',
        value: stats.clientesAtendidos || 0,
        color: 'info'
      },
      {
        icon: 'mdi-star',
        label: 'Valoración Promedio',
        value: `${stats.promedioValoracion || 0}/5`,
        color: 'warning'
      },
      {
        icon: 'mdi-clock',
        label: 'Horas Trabajadas',
        value: `${stats.horasTrabajadas || 0}h`,
        color: 'purple'
      }
    ]);

    const quickActions = computed(() => [
      {
        icon: 'mdi-account-edit',
        title: 'Editar Perfil',
        description: 'Modificar información personal',
        color: 'primary',
        handler: () => openEditDialog.value = true
      },
      {
        icon: 'mdi-camera',
        title: 'Cambiar Avatar',
        description: 'Actualizar foto de perfil',
        color: 'success',
        handler: () => openAvatarDialog.value = true
      },
      {
        icon: 'mdi-lock',
        title: 'Cambiar Contraseña',
        description: 'Actualizar credenciales',
        color: 'warning',
        handler: () => openPasswordDialog.value = true
      },
      {
        icon: 'mdi-download',
        title: 'Exportar Perfil',
        description: 'Descargar datos personales',
        color: 'info',
        handler: exportProfile
      }
    ]);

    // Estadísticas simuladas (en un caso real vendrían del backend)
    const stats = reactive({
      citasCompletadas: 156,
      clientesAtendidos: 89,
      promedioValoracion: 4.8,
      horasTrabajadas: 1240
    });
    
    // Reglas de validación
    const rules = {
      required: v => !!v || 'Este campo es requerido',
      email: v => /.+@.+\..+/.test(v) || 'Email debe ser válido',
      minLength: v => v.length >= 6 || 'Mínimo 6 caracteres',
      confirmPassword: v => v === passwordForm.newPassword || 'Las contraseñas no coinciden'
    };
    
    // Funciones
    const getRoleColor = (role) => {
      const colors = {
        'Administrador': 'red',
        'Empleado': 'blue',
        'Recepcionista': 'green',
        'Técnico': 'orange'
      };
      return colors[role] || 'grey';
    };
    
    const formatDate = (date) => {
      if (!date) return 'No especificada';
      return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    };
    
    const formatDateTime = (date) => {
      return new Date(date).toLocaleString('es-ES');
    };
    
    const initializeEditForm = () => {
      console.log('Initializing edit form with user:', user.value);
      if (user.value) {
        Object.assign(editForm, {
          nombre_empleado: user.value.nombre_empleado || '',
          apellido_paterno: user.value.apellido_paterno || '',
          apellido_materno: user.value.apellido_materno || '',
          email: user.value.email || '',
          telefono_empleado: user.value.telefono_empleado || '',
          direccion: user.value.direccion || ''
        });
      }
    };
    
    const saveProfile = async () => {
      if (!editFormValid.value) return;
      
      saving.value = true;
      try {
        // Aquí iría la llamada al API para actualizar el perfil
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
        
        // Actualizar el usuario local
        Object.assign(user.value, editForm);
        
        showAlert('Perfil actualizado exitosamente', 'success');
        openEditDialog.value = false;
      } catch (error) {
        showAlert('Error al actualizar el perfil', 'error');
      } finally {
        saving.value = false;
      }
    };
    
    const previewAvatar = (file) => {
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          avatarPreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    
    const uploadAvatar = async () => {
      if (!avatarFile.value) return;
      
      uploading.value = true;
      try {
        // Aquí iría la llamada al API para subir el avatar
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
        
        user.value.avatar = avatarPreview.value;
        showAlert('Avatar actualizado exitosamente', 'success');
        openAvatarDialog.value = false;
        avatarFile.value = null;
        avatarPreview.value = null;
      } catch (error) {
        showAlert('Error al subir el avatar', 'error');
      } finally {
        uploading.value = false;
      }
    };
    
    const changePassword = async () => {
      if (!passwordFormValid.value) return;
      
      changingPassword.value = true;
      try {
        // Aquí iría la llamada al API para cambiar la contraseña
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulación
        
        showAlert('Contraseña cambiada exitosamente', 'success');
        openPasswordDialog.value = false;
        Object.assign(passwordForm, {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        showAlert('Error al cambiar la contraseña', 'error');
      } finally {
        changingPassword.value = false;
      }
    };
    
    const exportProfile = () => {
      const profileData = {
        ...user.value,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(profileData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `perfil_${user.value.nombre_empleado}_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(url);
      showAlert('Perfil exportado exitosamente', 'success');
    };
    
    // Watchers
    watch(user, (newUser) => {
      console.log('User changed:', newUser);
      if (newUser) {
        initializeEditForm();
      }
    });
    
    onMounted(() => {
      console.log('Perfil component mounted');
      loadUser();
    });
    
    return {
      user,
      openEditDialog,
      openAvatarDialog,
      openPasswordDialog,
      saving,
      uploading,
      changingPassword,
      editFormValid,
      passwordFormValid,
      editForm,
      passwordForm,
      avatarFile,
      avatarPreview,
      editFormRef,
      passwordFormRef,
      stats,
      personalInfo,
      statistics,
      quickActions,
      rules,
      getRoleColor,
      formatDate,
      formatDateTime,
      saveProfile,
      previewAvatar,
      uploadAvatar,
      changePassword,
      exportProfile
    };
  },
};
</script>

<style scoped>
/* Loading Animation */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  animation: pulse 2s infinite;
}

.loading-dots {
  display: flex;
  gap: 8px;
  margin-top: 20px;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--v-primary-base);
  animation: dots 1.5s infinite;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 400px;
  overflow: hidden;
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('../assets/img/fondoPer.jpg') center/cover;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.85) 0%, rgba(66, 165, 245, 0.85) 100%);
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 80px;
  height: 80px;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 120px;
  height: 120px;
  top: 60%;
  right: 20%;
  animation-delay: 2s;
}

.shape-3 {
  width: 60px;
  height: 60px;
  top: 40%;
  right: 10%;
  animation-delay: 4s;
}

.hero-content {
  position: relative;
  z-index: 2;
  height: 100%;
}

.profile-avatar-container {
  position: relative;
}

.avatar-ring {
  position: relative;
  padding: 8px;
  background: linear-gradient(45deg, #1976d2, #42a5f5, #26a69a, #66bb6a);
  border-radius: 50%;
  animation: rotate 10s linear infinite;
}

.profile-avatar {
  border: 6px solid white;
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.profile-avatar:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  border-radius: 50%;
  color: white;
}

.profile-avatar:hover .avatar-overlay {
  opacity: 1;
}

.avatar-hint {
  font-size: 12px;
  margin-top: 8px;
  font-weight: 500;
}

.profile-info {
  color: white;
  margin-left: 2rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  color: white;
}

.role-badge {
  margin-bottom: 1rem;
}

.role-chip {
  font-weight: 600;
  font-size: 1.1rem;
  padding: 8px 16px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

.hero-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  display: flex;
  align-items: center;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.edit-profile-btn {
  box-shadow: 0 8px 25px rgba(0,0,0,0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.edit-profile-btn:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 12px 35px rgba(0,0,0,0.4);
}

/* Main Content */
.main-content {
  margin-top: -50px;
  position: relative;
  z-index: 3;
}

/* Cards */
.info-card, .stats-card, .sidebar-card {
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: white;
  border: 1px solid rgba(0,0,0,0.05);
}

.info-card:hover, .stats-card:hover, .sidebar-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

/* Info Items */
.info-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
}

.info-item:hover {
  background: rgba(0,0,0,0.02);
  transform: translateX(8px);
}

.info-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background: rgba(0,0,0,0.05);
}

.info-content {
  flex: 1;
}

.info-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0 0 0.25rem 0;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

/* Statistics */
.stat-card {
  text-align: center;
  padding: 2rem 1rem;
  border-radius: 16px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: white;
  border: 1px solid rgba(0,0,0,0.05);
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1976d2, #42a5f5);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0,0,0,0.1);
}

.stat-icon {
  margin-bottom: 1rem;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  color: #1976d2;
}

.stat-label {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0;
  font-weight: 500;
}

/* Action Items */
.action-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.action-item:hover {
  background: rgba(0,0,0,0.02);
  border-color: rgba(0,0,0,0.1);
  transform: translateX(8px);
}

.action-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background: rgba(0,0,0,0.05);
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.action-description {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0;
}

/* Status Items */
.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-status {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 12px;
  background: rgba(0,0,0,0.02);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 1rem;
}

.status-indicator.active {
  background: #28a745;
  box-shadow: 0 0 0 4px rgba(40, 167, 69, 0.2);
}

.status-indicator.info {
  background: #17a2b8;
  box-shadow: 0 0 0 4px rgba(23, 162, 184, 0.2);
}

.status-content {
  flex: 1;
}

.status-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.status-description {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0;
}

/* Dialogs */
.edit-dialog, .avatar-dialog, .password-dialog {
  border-radius: 20px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  padding: 1.5rem 2rem;
  background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
  border-bottom: 1px solid rgba(0,0,0,0.08);
}

.dialog-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.cancel-btn {
  font-weight: 500;
  text-transform: none;
}

.save-btn {
  font-weight: 600;
  text-transform: none;
  padding: 0 2rem;
}

.file-input {
  margin-bottom: 1rem;
}

.preview-container {
  text-align: center;
  margin-top: 1rem;
}

.preview-image {
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes dots {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* Responsive Design */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .profile-info {
    margin-left: 1rem;
  }
  
  .main-content {
    margin-top: -30px;
  }
}

@media (max-width: 600px) {
  .hero-section {
    height: 300px;
  }
  
  .profile-avatar {
    size: 120px !important;
  }
  
  .edit-profile-btn {
    display: none;
  }
  
  .hero-title {
    font-size: 1.5rem;
  }
  
  .card-header {
    padding: 1rem 1.5rem;
  }
  
  .card-title {
    font-size: 1.25rem;
  }
}

/* Consistent color scheme */
.info-card, .stats-card, .sidebar-card {
  background: white;
  color: #424242;
}

.info-label, .stat-label, .action-description, .status-description {
  color: #757575;
}

.info-value, .action-title, .status-title {
  color: #424242;
}

.card-title {
  color: #1976d2;
}
</style>