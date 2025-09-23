# 🚀 Despliegue en Railway - BlxckTraining Backend

## 📋 Pasos para Desplegar

### 1. **Preparar el Repositorio**
- ✅ Archivos de configuración creados:
  - `railway.json` - Configuración de Railway
  - `Procfile` - Comando de inicio
  - `railway-env-template.txt` - Template de variables de entorno

### 2. **Crear Cuenta en Railway**
1. Ve a [railway.app](https://railway.app)
2. Regístrate con GitHub
3. Autoriza el acceso a tu repositorio

### 3. **Crear Nuevo Proyecto**
1. En Railway Dashboard, haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Elige tu repositorio `blxcktraining-back`
4. Railway detectará automáticamente que es un proyecto Node.js

### 4. **Configurar Base de Datos PostgreSQL**
1. En tu proyecto, haz clic en "New"
2. Selecciona "Database" > "PostgreSQL"
3. Railway creará automáticamente las variables de entorno:
   - `DATABASE_URL`
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

### 5. **Configurar Variables de Entorno**
Ve a tu servicio > Variables y agrega:

#### Variables de Base de Datos (se configuran automáticamente)
```
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_USERNAME=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
DB_NAME=${PGDATABASE}
```

#### Variables de Aplicación
```
JWT_SECRET=tu-jwt-secret-super-seguro
PORT=8000
ALLOWED_ORIGINS=https://tu-frontend.vercel.app,https://tu-dominio.com
DB_SYNCHRONIZE=true
DB_LOGGING=false
```

#### Variables de Firebase
```
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=tu-service-account@tu-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=tu-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/tu-service-account%40tu-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=tu-project-id.appspot.com
```

### 6. **Desplegar**
1. Railway detectará automáticamente los archivos de configuración
2. El despliegue comenzará automáticamente
3. Puedes ver el progreso en la pestaña "Deployments"

### 7. **Verificar Despliegue**
1. Una vez desplegado, obtendrás una URL como: `https://tu-proyecto-production.up.railway.app`
2. Prueba el endpoint: `https://tu-proyecto-production.up.railway.app/` (debería mostrar "Hello World!")
3. Prueba la documentación Swagger: `https://tu-proyecto-production.up.railway.app/api`

## 🔧 **Configuración Adicional**

### **Dominio Personalizado (Opcional)**
1. Ve a tu servicio > Settings > Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones

### **Monitoreo**
- Railway proporciona logs en tiempo real
- Métricas de uso en el dashboard
- Alertas automáticas en caso de errores

## 🚨 **Solución de Problemas**

### **Error de Conexión a Base de Datos**
- Verifica que las variables `DB_*` estén configuradas correctamente
- Asegúrate de que `DB_SYNCHRONIZE=true` para la primera migración

### **Error de CORS**
- Verifica que `ALLOWED_ORIGINS` incluya la URL de tu frontend
- Formato: `https://tu-frontend.vercel.app,https://otro-dominio.com`

### **Error de Firebase**
- Verifica que todas las variables de Firebase estén configuradas
- Asegúrate de que el `FIREBASE_PRIVATE_KEY` esté en formato correcto

## 📊 **Costos**
- **Plan Gratuito**: $5 de crédito mensual
- **Plan Pro**: $20/mes
- **Base de datos PostgreSQL**: Incluida en el plan

## 🔗 **URLs Importantes**
- **Dashboard**: [railway.app](https://railway.app)
- **Documentación**: [docs.railway.app](https://docs.railway.app)
- **Soporte**: [discord.gg/railway](https://discord.gg/railway)

## ✅ **Checklist Final**
- [ ] Repositorio en GitHub
- [ ] Cuenta en Railway creada
- [ ] Proyecto creado y conectado
- [ ] Base de datos PostgreSQL agregada
- [ ] Variables de entorno configuradas
- [ ] Despliegue exitoso
- [ ] API funcionando correctamente
- [ ] Frontend conectado al backend
