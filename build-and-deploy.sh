#!/bin/bash

### Configuración
LOCAL_DIST_PATH="dist"
REMOTE_USER="root"
REMOTE_HOST="198.199.68.78"
REMOTE_DIR="/var/www/cherry_front"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")

echo "🏗️  Paso 1: Generando build local..."
npm run build

if [ $? -ne 0 ]; then
  echo "❌ Error: Falló la generación del build. Abortando..."
  exit 1
fi

echo "🔐 Paso 2: Realizando respaldo en el servidor..."
ssh ${REMOTE_USER}@${REMOTE_HOST} "
  cd ${REMOTE_DIR} && \
  if [ -d dist ]; then
    echo '📦 Respaldando dist/ actual a dist_backup_${TIMESTAMP}' && \
    cp -r dist dist_backup_${TIMESTAMP} && \
    rm -rf dist
  else
    echo '⚠️ No existe carpeta dist actual, se omitió respaldo.'
  fi
"

echo "🚀 Paso 3: Subiendo nuevo build al servidor..."
scp -r ${LOCAL_DIST_PATH}/ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

if [ $? -eq 0 ]; then
  echo "♻️  Paso 4: Reiniciando Nginx en el servidor..."
  ssh ${REMOTE_USER}@${REMOTE_HOST} "systemctl reload nginx"

  if [ $? -eq 0 ]; then
    echo "✅ ¡Despliegue y reinicio de Nginx completado con éxito!"
  else
    echo "⚠️ El despliegue fue exitoso, pero falló el reinicio de Nginx. Verifica manualmente."
  fi
else
  echo "❌ Error: Falló la transferencia. No se reiniciará Nginx."
  exit 1
fi
