#!/bin/bash

# Script para cambiar el entorno de la aplicación Vue

echo "🔧 Cambiando entorno de la aplicación Vue..."
echo ""

case $1 in
  "local")
    echo "📍 Cambiando a entorno LOCAL (localhost:3000)"
    sed -i '' "s/return '.*';/return 'local';/" src/config/api.js
    ;;
  "production")
    echo "🌐 Cambiando a entorno PRODUCCIÓN (gpocherry.com)"
    sed -i '' "s/return '.*';/return 'production';/" src/config/api.js
    ;;
  "staging")
    echo "🔍 Cambiando a entorno STAGING (staging.gpocherry.com)"
    sed -i '' "s/return '.*';/return 'staging';/" src/config/api.js
    ;;
  *)
    echo "❌ Uso: ./switch_env_vue.sh [local|production|staging]"
    echo ""
    echo "Entornos disponibles:"
    echo "  local      - http://localhost:3000/cherry"
    echo "  production - https://gpocherry.com/cherry"
    echo "  staging    - https://staging.gpocherry.com/cherry"
    exit 1
    ;;
esac

echo "✅ Entorno cambiado exitosamente!"
echo "🔄 Reinicia la aplicación Vue para aplicar los cambios"
echo ""
echo "Para reiniciar:"
echo "  npm run serve" 