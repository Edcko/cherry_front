// src/config/api.js
class ApiConfig {
  // Configuración de entorno - cambiar aquí para probar diferentes servidores
  static get environment() {
    return 'production'; // 'local', 'production', 'staging'
  }
  
  // Configuración de API
  static get baseURL() {
    switch (this.environment) {
      case 'local':
        return 'http://localhost:3000/cherry';
      case 'production':
        return '/cherry'; // Usar proxy para evitar CORS
      case 'staging':
        return 'https://staging.gpocherry.com/cherry';
      default:
        return '/cherry'; // Usar proxy para evitar CORS
    }
  }
  
  // Configuración de debug
  static get isDebugMode() {
    return process.env.NODE_ENV === 'development';
  }
  
  // Timeout de conexión
  static get timeout() {
    if (this.environment === 'production') {
      return 30000; // 30 segundos
    } else {
      return 60000; // 60 segundos para desarrollo
    }
  }
  
  // Imprimir información de configuración (solo en debug)
  static printConfig() {
    if (this.isDebugMode) {
      console.log('🔧 Configuración de API Vue:');
      console.log('   Entorno:', this.environment);
      console.log('   Base URL:', this.baseURL);
      console.log('   Debug Mode:', this.isDebugMode);
    }
  }
}

export default ApiConfig; 