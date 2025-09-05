# 🔧 Cambios de Configuración de API en Vue 3

## 📋 Resumen

Se han realizado cambios en la configuración de la API de Vue 3 para asegurar que apunte al servidor correcto y use los endpoints específicos del spa.

## ✅ Cambios Realizados

### 1. **Nuevo archivo de configuración (`src/config/api.js`)**
- ✅ Configuración centralizada para diferentes entornos
- ✅ Soporte para local, producción y staging
- ✅ Logs de debugging automáticos

### 2. **Actualización de servicios API (`src/services/apiServices.js`)**
- ✅ Uso de la nueva configuración centralizada
- ✅ Logs detallados para debugging
- ✅ Timeout configurable por entorno

### 3. **Logs de debugging agregados**
- ✅ `useEmpleados.js` - Logs en fetchEmpleados
- ✅ `apiServices.js` - Logs en getEmpleadosByCurrentSpa
- ✅ `store/index.js` - Logs en getter idSpa
- ✅ `Empleado.vue` - Logs en onMounted

### 4. **Script de cambio de entorno (`switch_env_vue.sh`)**
- ✅ Cambio fácil entre entornos
- ✅ Soporte para local, producción y staging

## 🔍 Configuración Actual

### Entorno: **PRODUCCIÓN**
- **Base URL**: `https://gpocherry.com/cherry`
- **Endpoints específicos del spa**:
  - Empleados: `GET /spa/{id_spa}/empleados`
  - Empleados activos: `GET /spa/{id_spa}/empleados/activos`
  - Paquetes: `GET /perteneceA/{id_spa}`

## 🧪 Para Probar

### 1. **Verificar configuración**
Al cargar la aplicación, verás en la consola:
```
🔧 Configuración de API Vue:
   Entorno: production
   Base URL: https://gpocherry.com/cherry
   Debug Mode: true
```

### 2. **Verificar logs de empleados**
Al cargar la página de empleados, verás:
```
🔍 Store: Getter idSpa llamado, valor: [ID_SPA]
🔍 apiServices: Obteniendo empleados para spa ID: [ID_SPA]
🌐 apiServices: URL: /spa/[ID_SPA]/empleados
📡 apiServices: Respuesta del servidor: [DATOS]
✅ apiServices: Empleados obtenidos: [CANTIDAD] empleados
🔍 useEmpleados: Iniciando fetchEmpleados
✅ useEmpleados: Empleados cargados: [CANTIDAD] empleados
🔍 Empleado.vue: Iniciando carga de empleados
✅ Empleado.vue: Empleados cargados: [CANTIDAD] empleados
```

### 3. **Verificar en DevTools**
- Abre DevTools (F12)
- Ve a Network → XHR/Fetch
- Verifica que las peticiones usen:
  - `https://gpocherry.com/cherry/spa/[ID_SPA]/empleados`
  - `https://gpocherry.com/cherry/perteneceA/[ID_SPA]`

## 🔄 Cambiar de Entorno

### Usando el script:
```bash
# Cambiar a producción
./switch_env_vue.sh production

# Cambiar a local
./switch_env_vue.sh local

# Cambiar a staging
./switch_env_vue.sh staging
```

### Manualmente:
Edita `src/config/api.js` y cambia:
```javascript
static get environment() {
  return 'production'; // Cambiar aquí
}
```

## 🎯 Resultado Esperado

Ahora la aplicación Vue 3 debería:
- ✅ Apuntar al servidor de producción
- ✅ Usar endpoints específicos del spa
- ✅ Mostrar solo empleados del spa del usuario autenticado
- ✅ Mostrar solo paquetes del spa del usuario autenticado
- ✅ Mantener consistencia con la aplicación Flutter

## 🚀 Estado Actual

✅ **CONFIGURADO**: API apunta al servidor de producción
✅ **DEBUGGING**: Logs detallados habilitados
✅ **SCOPING**: Endpoints específicos del spa implementados
✅ **CONSISTENTE**: Mismo comportamiento que Flutter 