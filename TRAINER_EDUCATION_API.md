# 📚 API de Documentos de Educación de Entrenadores

## 🎯 **Descripción General**

Esta API permite gestionar documentos de educación de entrenadores como certificaciones, diplomas, títulos académicos y otros documentos profesionales. Los documentos se crean con estado "pendiente" por defecto y requieren verificación administrativa.

## 🔐 **Autenticación**

Todos los endpoints requieren autenticación JWT. Algunos endpoints están restringidos solo para administradores.

## 📋 **Endpoints Disponibles**

### 1. **Subir Documento de Educación**
```http
POST /trainer-education/upload/{trainerId}
```

**Descripción:** Sube un nuevo documento de educación para un entrenador.

**Parámetros de ruta:**
- `trainerId` (UUID): ID del entrenador

**Body (multipart/form-data):**
- `file`: Archivo del documento (PDF, JPG, PNG, DOC, DOCX)
- `title`: Título del documento (5-200 caracteres)
- `description`: Descripción detallada (10-1000 caracteres)

**Respuesta exitosa (201):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Certificación en Entrenamiento Personal",
  "description": "Certificación obtenida en el Instituto Nacional de Deportes",
  "originalName": "certificacion.pdf",
  "fileName": "123e4567-e89b-12d3-a456-426614174000_certificacion.pdf",
  "filePath": "Entrenadores/123e4567-e89b-12d3-a456-426614174000/educacion/certificacion.pdf",
  "mimeType": "application/pdf",
  "fileSize": 2048576,
  "verificationStatus": "pendiente",
  "trainerId": "123e4567-e89b-12d3-a456-426614174001",
  "firebaseUrl": "https://firebasestorage.googleapis.com/...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. **Obtener Documentos de un Entrenador**
```http
GET /trainer-education/documents/{trainerId}
```

**Descripción:** Lista todos los documentos de educación de un entrenador específico.

**Parámetros de ruta:**
- `trainerId` (UUID): ID del entrenador

**Respuesta exitosa (200):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Certificación en Entrenamiento Personal",
    "description": "Certificación obtenida en el Instituto Nacional de Deportes",
    "verificationStatus": "verificado",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### 3. **Obtener Documento por ID**
```http
GET /trainer-education/document/{documentId}
```

**Descripción:** Obtiene la información completa de un documento específico.

**Parámetros de ruta:**
- `documentId` (UUID): ID del documento

**Respuesta exitosa (200):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Certificación en Entrenamiento Personal",
  "description": "Certificación obtenida en el Instituto Nacional de Deportes",
  "originalName": "certificacion.pdf",
  "fileName": "123e4567-e89b-12d3-a456-426614174000_certificacion.pdf",
  "filePath": "Entrenadores/123e4567-e89b-12d3-a456-426614174000/educacion/certificacion.pdf",
  "mimeType": "application/pdf",
  "fileSize": 2048576,
  "verificationStatus": "verificado",
  "verificationNotes": "Documento verificado correctamente",
  "verifiedBy": "admin-uuid",
  "verifiedAt": "2024-01-16T14:30:00.000Z",
  "trainerId": "123e4567-e89b-12d3-a456-426614174001",
  "firebaseUrl": "https://firebasestorage.googleapis.com/...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-16T14:30:00.000Z",
  "trainer": {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "fullName": "Carlos Entrenador",
    "email": "carlos@ejemplo.com"
  }
}
```

### 4. **Actualizar Documento**
```http
PUT /trainer-education/document/{documentId}
```

**Descripción:** Actualiza el título y/o descripción de un documento no verificado.

**Parámetros de ruta:**
- `documentId` (UUID): ID del documento

**Body:**
```json
{
  "title": "Certificación en Entrenamiento Personal Avanzado",
  "description": "Certificación avanzada obtenida en el Instituto Nacional de Deportes"
}
```

**Nota:** Al modificar un documento, el estado vuelve a "pendiente".

### 5. **Eliminar Documento**
```http
DELETE /trainer-education/document/{documentId}
```

**Descripción:** Elimina completamente un documento y su archivo asociado.

**Parámetros de ruta:**
- `documentId` (UUID): ID del documento

### 6. **Verificar Documento (Solo Admin)**
```http
PUT /trainer-education/verify/{documentId}
```

**Descripción:** Permite a administradores cambiar el estado de verificación de un documento.

**Parámetros de ruta:**
- `documentId` (UUID): ID del documento

**Body:**
```json
{
  "verificationStatus": "verificado",
  "verificationNotes": "Documento verificado correctamente. Certificación válida y vigente."
}
```

**Estados disponibles:**
- `pendiente`: Documento en espera de verificación
- `verificado`: Documento aprobado
- `rechazado`: Documento rechazado

### 7. **Obtener Documentos por Estado (Solo Admin)**
```http
GET /trainer-education/documents/status/{status}
```

**Descripción:** Filtra documentos según su estado de verificación.

**Parámetros de ruta:**
- `status`: Estado de verificación (pendiente, verificado, rechazado)

### 8. **Obtener Documentos Pendientes (Solo Admin)**
```http
GET /trainer-education/documents/pending
```

**Descripción:** Lista todos los documentos que requieren verificación administrativa.

### 9. **Obtener Documentos Verificados**
```http
GET /trainer-education/documents/verified
```

**Descripción:** Lista todos los documentos que han sido aprobados.

### 10. **Obtener Documentos Rechazados**
```http
GET /trainer-education/documents/rejected
```

**Descripción:** Lista todos los documentos que han sido rechazados.

### 11. **Obtener Estadísticas por Entrenador**
```http
GET /trainer-education/stats/{trainerId}
```

**Descripción:** Proporciona estadísticas cuantitativas de los documentos de un entrenador.

**Parámetros de ruta:**
- `trainerId` (UUID): ID del entrenador

**Respuesta exitosa (200):**
```json
{
  "total": 5,
  "pending": 2,
  "verified": 2,
  "rejected": 1
}
```

### 12. **Obtener URL de Descarga**
```http
GET /trainer-education/document/{documentId}/download?expirationMinutes=60
```

**Descripción:** Genera una URL temporal para descargar o visualizar el archivo.

**Parámetros de ruta:**
- `documentId` (UUID): ID del documento

**Parámetros de query:**
- `expirationMinutes` (opcional): Tiempo de expiración en minutos (default: 60)

## 🔒 **Permisos y Roles**

### **Entrenadores:**
- ✅ Subir documentos
- ✅ Ver sus propios documentos
- ✅ Actualizar documentos no verificados
- ✅ Eliminar sus documentos
- ✅ Ver documentos verificados globalmente
- ✅ Ver documentos rechazados globalmente
- ✅ Obtener estadísticas de sus documentos
- ✅ Generar URLs de descarga

### **Administradores:**
- ✅ Todas las operaciones de entrenadores
- ✅ Verificar documentos
- ✅ Ver documentos por estado
- ✅ Ver todos los documentos pendientes
- ✅ Acceso completo a todas las funcionalidades

## 📁 **Tipos de Archivo Soportados**

- **PDF** (.pdf)
- **Imágenes** (.jpg, .jpeg, .png)
- **Documentos** (.doc, .docx)

## 📏 **Límites y Validaciones**

- **Tamaño máximo de archivo:** 10MB
- **Título:** 5-200 caracteres
- **Descripción:** 10-1000 caracteres
- **Estados de verificación:** pendiente, verificado, rechazado

## 🚀 **Ejemplos de Uso**

### **Subir una Certificación:**
```bash
curl -X POST http://localhost:8000/trainer-education/upload/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@certificacion.pdf" \
  -F "title=Certificación en Entrenamiento Personal" \
  -F "description=Certificación obtenida en el Instituto Nacional de Deportes con especialización en entrenamiento funcional"
```

### **Verificar un Documento (Admin):**
```bash
curl -X PUT http://localhost:8000/trainer-education/verify/123e4567-e89b-12d3-a456-426614174000 \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "verificationStatus": "verificado",
    "verificationNotes": "Documento verificado correctamente. Certificación válida y vigente."
  }'
```

### **Obtener Documentos de un Entrenador:**
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8000/trainer-education/documents/123e4567-e89b-12d3-a456-426614174000
```

## ⚠️ **Notas Importantes**

1. **Estado por defecto:** Todos los documentos se crean con estado "pendiente"
2. **Verificación requerida:** Solo administradores pueden cambiar el estado de verificación
3. **Edición limitada:** Solo se pueden editar documentos no verificados
4. **Almacenamiento:** Los archivos se guardan en Firebase Storage
5. **Seguridad:** URLs de descarga tienen tiempo de expiración configurable
6. **Auditoría:** Se registra quién y cuándo verificó cada documento

## 🔧 **Configuración Requerida**

- **Firebase Admin SDK** configurado
- **JWT Secret** configurado
- **Base de datos PostgreSQL** con TypeORM
- **Módulo de autenticación** configurado
- **Guards de roles** implementados
