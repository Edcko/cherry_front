# 🔧 Solución de Problemas de CORS en Vue 3

## 📋 Problema Identificado

Al intentar hacer login desde localhost hacia el servidor de producción (`https://gpocherry.com`), se obtiene un error 404 porque:

1. **CORS**: El servidor de producción no permite peticiones desde `localhost:8080`
2. **Configuración**: El servidor puede no estar configurado para manejar peticiones desde el frontend

## ✅ Soluciones Implementadas

### 1. **Configuración de Entorno Local**
- Cambiado temporalmente a entorno `local` para desarrollo
- BaseURL: `http://localhost:3000/cherry`

### 2. **Logs de Debugging Mejorados**
- Logs detallados en `authService.js`
- Información de URL y errores
- Verificación de conectividad

### 3. **Headers CORS Agregados**
- Headers de Content-Type y Accept
- Configuración para peticiones JSON

## 🔄 Opciones para Desarrollo

### Opción 1: Usar Entorno Local (Recomendado para desarrollo)
```bash
# Cambiar a entorno local
./switch_env_vue.sh local
```

**Ventajas:**
- ✅ No hay problemas de CORS
- ✅ Desarrollo más rápido
- ✅ Debugging más fácil

**Desventajas:**
- ❌ Necesitas el servidor local corriendo
- ❌ Datos pueden ser diferentes

### Opción 2: Configurar Proxy en Vue (Alternativa)
Agregar al `vue.config.js`:
```javascript
module.exports = defineConfig({
  // ... otras configuraciones
  devServer: {
    proxy: {
      '/cherry': {
        target: 'https://gpocherry.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
```

### Opción 3: Configurar CORS en el Servidor (Solución definitiva)
El servidor de producción debe permitir peticiones desde:
- `http://localhost:8080`
- `http://localhost:3000`
- `http://127.0.0.1:8080`

## 🧪 Para Probar

### 1. **Verificar configuración actual**
En la consola deberías ver:
```
🔧 Configuración de API Vue:
   Entorno: local
   Base URL: http://localhost:3000/cherry
   Debug Mode: true
```

### 2. **Verificar logs de login**
Al intentar hacer login:
```
🔐 authService: Iniciando login
🌐 authService: URL base: http://localhost:3000/cherry/auth/
📧 authService: Email: [email]
🔍 authService: Probando conectividad...
🌐 authService: URL completa: http://localhost:3000/cherry/auth/login
```

### 3. **Verificar conectividad**
- Asegúrate de que el servidor local esté corriendo en `localhost:3000`
- Verifica que el endpoint `/cherry/auth/login` esté disponible

## 🚀 Configuración Recomendada

### Para Desarrollo:
```javascript
// src/config/api.js
static get environment() {
  return 'local'; // Para desarrollo
}
```

### Para Producción:
```javascript
// src/config/api.js
static get environment() {
  return 'production'; // Para producción
}
```

## 📝 Notas Importantes

1. **Servidor Local**: Asegúrate de que el servidor backend esté corriendo en `localhost:3000`
2. **Endpoints**: Verifica que los endpoints estén disponibles en el servidor local
3. **Datos**: Los datos pueden ser diferentes entre local y producción
4. **CORS**: Si usas producción, el servidor debe permitir peticiones desde tu dominio

## 🔧 Próximos Pasos

1. **Configurar servidor local** para desarrollo
2. **Implementar proxy** en Vue si es necesario
3. **Configurar CORS** en el servidor de producción
4. **Automatizar** el cambio de entorno según el ambiente 