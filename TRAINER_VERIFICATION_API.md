# API de Verificación de Entrenadores

Esta API permite a los entrenadores subir, gestionar y administrar sus documentos de verificación, y a los administradores verificar estos documentos.

## Tipos de Documentos Aceptados

- **identification**: Identificación oficial (INE, pasaporte, etc.)
- **birth_certificate**: Acta de nacimiento
- **curp**: Clave Única de Registro de Población
- **rfc**: Registro Federal de Contribuyentes

## Endpoints

### 1. Subir Documento de Verificación

**POST** `/trainer-verification/upload/:trainerId`

Sube un nuevo documento de verificación para un entrenador.

**Headers:**
- `Authorization: Bearer {JWT_TOKEN}`
- `Content-Type: multipart/form-data`

**Parámetros de URL:**
- `trainerId`: UUID del entrenador

**Body (form-data):**
- `file`: Archivo (PDF, JPG, JPEG, PNG, máximo 10MB)
- `documentType`: Tipo de documento (identification, birth_certificate, curp, rfc)
- `notes`: Notas opcionales (opcional)

**Permisos:** Solo entrenadores (pueden subir solo sus propios documentos)

**Respuesta:**
```json
{
  "id": "uuid",
  "documentType": "identification",
  "originalName": "INE.pdf",
  "fileName": "trainer_id_identification_uuid.pdf",
  "filePath": "uploads/trainer-verification/trainer_id_identification_uuid.pdf",
  "mimeType": "application/pdf",
  "fileSize": 1024000,
  "isVerified": false,
  "trainerId": "trainer_uuid",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### 2. Reemplazar Documento Existente

**PUT** `/trainer-verification/replace/:trainerId/:documentType`

Reemplaza un documento existente del mismo tipo.

**Headers:**
- `Authorization: Bearer {JWT_TOKEN}`
- `Content-Type: multipart/form-data`

**Parámetros de URL:**
- `trainerId`: UUID del entrenador
- `documentType`: Tipo de documento a reemplazar

**Body (form-data):**
- `file`: Nuevo archivo (PDF, JPG, JPEG, PNG, máximo 10MB)
- `notes`: Notas opcionales (opcional)

**Permisos:** Solo entrenadores (pueden reemplazar solo sus propios documentos)

**Respuesta:** Mismo formato que subir documento

### 3. Obtener Documentos de un Entrenador

**GET** `/trainer-verification/documents/:trainerId`

Obtiene todos los documentos de verificación de un entrenador específico.

**Headers:**
- `Authorization: Bearer {JWT_TOKEN}`

**Parámetros de URL:**
- `trainerId`: UUID del entrenador

**Permisos:** Entrenadores (solo sus documentos) y Administradores

**Respuesta:**
```json
[
  {
    "id": "uuid",
    "documentType": "identification",
    "originalName": "INE.pdf",
    "fileName": "trainer_id_identification_uuid.pdf",
    "filePath": "uploads/trainer-verification/trainer_id_identification_uuid.pdf",
    "mimeType": "application/pdf",
    "fileSize": 1024000,
    "isVerified": true,
    "verificationNotes": "Documento válido",
    "verifiedBy": "admin_uuid",
    "verifiedAt": "2024-01-01T00:00:00.000Z",
    "trainerId": "trainer_uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 4. Obtener Documento Específico

**GET** `/trainer-verification/document/:documentId/:trainerId`

Obtiene información detallada de un documento específico.

**Headers:**
- `Authorization: Bearer {JWT_TOKEN}`

**Parámetros de URL:**
- `documentId`: UUID del documento
- `trainerId`: UUID del entrenador

**Permisos:** Entrenadores (solo sus documentos) y Administradores

**Respuesta:** Mismo formato que un documento individual

### 5. Descargar Archivo del Documento

**GET** `/trainer-verification/download/:documentId/:trainerId`

Descarga el archivo físico del documento.

**Headers:**
- `Authorization: Bearer {JWT_TOKEN}`

**Parámetros de URL:**
- `documentId`: UUID del documento
- `trainerId`: UUID del entrenador

**Permisos:** Entrenadores (solo sus documentos) y Administradores

**Respuesta:** Archivo binario con headers de descarga

### 6. Eliminar Documento

**DELETE** `/trainer-verification/document/:documentId/:trainerId`

Elimina un documento de verificación.

**Headers:**
- `Authorization: Bearer {JWT_TOKEN}`

**Parámetros de URL:**
- `documentId`: UUID del documento
- `trainerId`: UUID del entrenador

**Permisos:** Solo entrenadores (pueden eliminar solo sus propios documentos)

**Respuesta:**
```json
{
  "message": "Documento eliminado correctamente"
}
```

### 7. Verificar Documento (Admin)

**PUT** `/trainer-verification/verify/:documentId`

Permite a los administradores verificar o rechazar un documento.

**Headers:**
- `Authorization: Bearer {JWT_TOKEN}`
- `Content-Type: application/json`

**Parámetros de URL:**
- `documentId`: UUID del documento

**Body:**
```json
{
  "isVerified": true,
  "verificationNotes": "Documento válido y legible",
  "verifiedBy": "admin_uuid"
}
```

**Permisos:** Solo administradores

**Respuesta:** Documento actualizado con información de verificación

### 8. Obtener Documentos Pendientes (Admin)

**GET** `/trainer-verification/pending`

Obtiene todos los documentos pendientes de verificación.

**Headers:**
- `Authorization: Bearer {JWT_TOKEN}`

**Permisos:** Solo administradores

**Respuesta:** Array de documentos pendientes con información del entrenador

### 9. Obtener Tipos de Documentos

**GET** `/trainer-verification/document-types`

Obtiene la lista de tipos de documentos disponibles.

**Headers:**
- `Authorization: Bearer {JWT_TOKEN}`

**Permisos:** Entrenadores y Administradores

**Respuesta:**
```json
[
  "identification",
  "birth_certificate",
  "curp",
  "rfc"
]
```

## Características de Seguridad

- **Autenticación JWT**: Todos los endpoints requieren autenticación
- **Autorización por Roles**: Control de acceso basado en roles (trainer, admin)
- **Validación de Propiedad**: Los entrenadores solo pueden acceder a sus propios documentos
- **Validación de Archivos**: Solo se aceptan PDF, JPG, JPEG, PNG
- **Límite de Tamaño**: Máximo 10MB por archivo
- **Nombres Únicos**: Los archivos se guardan con nombres únicos para evitar conflictos

## Estructura de Archivos

Los archivos se guardan en el directorio `uploads/trainer-verification/` con el siguiente formato de nombre:
```
{trainerId}_{documentType}_{uuid}.{extension}
```

Ejemplo: `abc123_identification_def456.pdf`

## Estados de Verificación

- **isVerified: false**: Documento pendiente de verificación
- **isVerified: true**: Documento verificado por un administrador

## Flujo de Verificación

1. El entrenador sube sus documentos de verificación
2. Los administradores revisan los documentos pendientes
3. Los administradores aprueban o rechazan cada documento
4. Cuando todos los documentos están verificados, el entrenador se marca como verificado
5. El entrenador puede reemplazar documentos si es necesario

## Manejo de Errores

- **400 Bad Request**: Datos inválidos o archivo no válido
- **401 Unauthorized**: Token JWT inválido o expirado
- **403 Forbidden**: Permisos insuficientes
- **404 Not Found**: Entrenador o documento no encontrado
- **500 Internal Server Error**: Error interno del servidor

## Ejemplos de Uso

### Subir Identificación
```bash
curl -X POST \
  http://localhost:3000/trainer-verification/upload/trainer-uuid \
  -H "Authorization: Bearer JWT_TOKEN" \
  -F "file=@INE.pdf" \
  -F "documentType=identification"
```

### Verificar Documento
```bash
curl -X PUT \
  http://localhost:3000/trainer-verification/verify/document-uuid \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "isVerified": true,
    "verificationNotes": "Documento válido"
  }'
```
