# API de Documentos de Entrenadores - BlxckTraining Backend

## 📋 **Endpoints Disponibles**

### 1. **Obtener Todos los Documentos de un Entrenador**
- **GET** `/users/trainer/{trainerId}/documents`
- **Descripción**: Obtiene todos los documentos de verificación de un entrenador específico
- **Parámetros**: `trainerId` (UUID del entrenador)
- **Autenticación**: No requiere JWT
- **Respuesta**: Array de documentos de verificación

### 2. **Obtener un Documento Específico por ID**
- **GET** `/users/trainer/document/{documentId}`
- **Descripción**: Obtiene un documento específico de verificación por su ID
- **Parámetros**: `documentId` (UUID del documento)
- **Autenticación**: No requiere JWT
- **Respuesta**: Documento de verificación individual

### 3. **Verificar un Documento de Entrenador**
- **PATCH** `/users/trainer/document/{documentId}/verify`
- **Descripción**: Verifica o rechaza un documento de verificación de entrenador
- **Parámetros**: `documentId` (UUID del documento)
- **Autenticación**: Requiere JWT (solo administradores)
- **Body**: `VerifyTrainerDocumentDto`
- **Respuesta**: Documento verificado con información de verificación

## 🔍 **Ejemplos de Uso**

### **Obtener todos los documentos de un entrenador:**
```bash
curl http://localhost:8000/users/trainer/8eb9f06f-40c3-403a-a56b-0cad0f334b35/documents
```

### **Obtener un documento específico:**
```bash
curl http://localhost:8000/users/trainer/document/123e4567-e89b-12d3-a456-426614174000
```

### **Aprobar un documento:**
```bash
curl -X PATCH http://localhost:8000/users/trainer/document/123e4567-e89b-12d3-a456-426614174000/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "verificationStatus": "aceptada",
    "verificationNotes": "Documento de identificación verificado correctamente. La información coincide con los datos registrados del entrenador."
  }'
```

### **Rechazar un documento:**
```bash
curl -X PATCH http://localhost:8000/users/trainer/document/123e4567-e89b-12d3-a456-426614174000/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "verificationStatus": "rechazada",
    "verificationNotes": "Documento rechazado: la imagen es borrosa y no se puede verificar la información. Por favor, subir una nueva imagen más clara."
  }'
```

### **Marcar documento como pendiente:**
```bash
curl -X PATCH http://localhost:8000/users/trainer/document/123e4567-e89b-12d3-a456-426614174000/verify \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "verificationStatus": "pendiente",
    "verificationNotes": "Documento marcado como pendiente para revisión posterior."
  }'
```

## 📄 **Estructura de Respuesta**

### **Respuesta - Documentos de Entrenador:**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "documentType": "identification",
    "originalName": "identificacion.jpg",
    "fileName": "9ad642c2-15c1-4359-8139-b1964303014f_identification_f575ee9a-b7d3-42b8-9a93-f0404bd08098.jpg",
    "filePath": "trainer-verification/9ad642c2-15c1-4359-8139-b1964303014f_identification_f575ee9a-b7d3-42b8-9a93-f0404bd08098.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 1024000,
    "verificationStatus": "pendiente",
    "verificationNotes": null,
    "verifiedBy": null,
    "verifiedAt": null,
    "trainerId": "8eb9f06f-40c3-403a-a56b-0cad0f334b35",
    "firebaseUrl": "https://firebasestorage.googleapis.com/...",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### **Respuesta - Documento Individual:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "documentType": "identification",
  "originalName": "identificacion.jpg",
  "fileName": "9ad642c2-15c1-4359-8139-b1964303014f_identification_f575ee9a-b7d3-42b8-9a93-f0404bd08098.jpg",
  "filePath": "trainer-verification/9ad642c2-15c1-4359-8139-b1964303014f_identification_f575ee9a-b7d3-42b8-9a93-f0404bd08098.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 1024000,
  "verificationStatus": "pendiente",
  "verificationNotes": null,
  "verifiedBy": null,
  "verifiedAt": null,
  "trainerId": "8eb9f06f-40c3-403a-a56b-0cad0f334b35",
  "firebaseUrl": "https://firebasestorage.googleapis.com/...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "trainer": {
    "id": "8eb9f06f-40c3-403a-a56b-0cad0f334b35",
    "fullName": "Juan Pérez",
    "email": "juan@example.com",
    "role": "trainer"
  }
}
```

### **Respuesta - Documento Verificado:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "documentType": "identification",
  "originalName": "identificacion.jpg",
  "fileName": "9ad642c2-15c1-4359-8139-b1964303014f_identification_f575ee9a-b7d3-42b8-9a93-f0404bd08098.jpg",
  "filePath": "trainer-verification/9ad642c2-15c1-4359-8139-b1964303014f_identification_f575ee9a-b7d3-42b8-9a93-f0404bd08098.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 1024000,
  "verificationStatus": "aceptada",
  "verificationNotes": "Documento de identificación verificado correctamente. La información coincide con los datos registrados del entrenador.",
  "verifiedBy": "admin-uuid-here",
  "verifiedAt": "2024-01-15T16:45:00.000Z",
  "trainerId": "8eb9f06f-40c3-403a-a56b-0cad0f334b35",
  "firebaseUrl": "https://firebasestorage.googleapis.com/...",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T16:45:00.000Z",
  "trainer": {
    "id": "8eb9f06f-40c3-403a-a56b-0cad0f334b35",
    "fullName": "Juan Pérez",
    "email": "juan@example.com",
    "role": "trainer"
  }
}
```

## 📝 **Estructura del Body para Verificación**

### **VerifyTrainerDocumentDto:**
```json
{
  "verificationStatus": "aceptada",
  "verificationNotes": "Comentarios obligatorios sobre la verificación del documento (máximo 1000 caracteres)"
}
```

**Campos:**
- `verificationStatus` (string, obligatorio): Estado de verificación del documento
  - `"pendiente"` - Documento pendiente de revisión
  - `"rechazada"` - Documento rechazado por el administrador
  - `"aceptada"` - Documento verificado y aprobado
- `verificationNotes` (string, obligatorio): Comentarios explicativos sobre la verificación (1-1000 caracteres)

## 🏷️ **Tipos de Documentos**

Los documentos pueden ser de los siguientes tipos:
- `identification` - Documento de identificación
- `birth_certificate` - Acta de nacimiento
- `curp` - CURP del entrenador
- `rfc` - RFC del entrenador

## 🔄 **Estados de Verificación**

Los documentos pueden tener los siguientes estados de verificación:
- **`pendiente`** - Estado por defecto cuando se sube un nuevo documento
- **`rechazada`** - Documento rechazado por el administrador
- **`aceptada`** - Documento verificado y aprobado por el administrador

## ⚠️ **Códigos de Error**

### **404 - Entrenador no encontrado:**
```json
{
  "statusCode": 404,
  "message": "Entrenador no encontrado",
  "error": "Not Found"
}
```

### **404 - Documento no encontrado:**
```json
{
  "statusCode": 404,
  "message": "Documento no encontrado",
  "error": "Not Found"
}
```

### **404 - Administrador no encontrado:**
```json
{
  "statusCode": 404,
  "message": "Administrador no encontrado",
  "error": "Not Found"
}
```

### **401 - No autenticado:**
```json
{
  "statusCode": 401,
  "message": "Usuario no autenticado",
  "error": "Unauthorized"
}
```

### **403 - Sin permisos:**
```json
{
  "statusCode": 403,
  "message": "Solo los administradores pueden verificar documentos de entrenadores",
  "error": "Forbidden"
}
```

### **400 - Validación de datos:**
```json
{
  "statusCode": 400,
  "message": [
    "El estado de verificación debe ser: pendiente, rechazada o aceptada",
    "El estado de verificación es requerido",
    "Los comentarios de verificación son requeridos",
    "Los comentarios no pueden tener más de 1000 caracteres"
  ],
  "error": "Bad Request"
}
```

## 🔗 **Relaciones**

- **TrainerVerificationDocument** → **Trainer**: Muchos documentos pertenecen a un entrenador
- Los documentos se ordenan por fecha de creación (más recientes primero)
- Al obtener un documento individual o verificado, se incluye la información básica del entrenador

## 📝 **Notas de Implementación**

- Solo los administradores pueden verificar documentos
- Se requiere comentarios obligatorios para cada verificación
- Se registra automáticamente el ID del administrador y la fecha de verificación
- Los endpoints de consulta no requieren autenticación JWT para facilitar el acceso
- Los documentos se ordenan por fecha de creación descendente
- Se incluye validación para verificar que el entrenador, documento y administrador existan
- Se utilizan las relaciones de TypeORM para optimizar las consultas
- **Nuevo**: Los documentos se crean automáticamente con estado "pendiente"
- **Nuevo**: Se pueden cambiar entre los 3 estados de verificación: pendiente, rechazada, aceptada

## 🔒 **Seguridad**

- **Autenticación JWT**: Solo los administradores pueden verificar documentos
- **Validación de permisos**: Se verifica que el usuario tenga rol de administrador
- **Validación de datos**: Se valida que todos los campos requeridos estén presentes
- **Registro de auditoría**: Se guarda quién verificó el documento y cuándo
- **Estados controlados**: Solo se permiten los 3 estados de verificación definidos
