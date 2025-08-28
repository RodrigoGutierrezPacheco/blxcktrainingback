# Módulo de Entrenadores - Verificación de Documentos

Este módulo maneja la verificación de documentos de los entrenadores en el sistema BlxckTraining.

## Características

- **Subida de Documentos**: Los entrenadores pueden subir documentos de verificación
- **Tipos de Documentos**: Identificación oficial, acta de nacimiento, CURP, RFC
- **Verificación por Administradores**: Los admins pueden verificar y aprobar documentos
- **Gestión de Archivos**: Subir, reemplazar, eliminar y descargar documentos
- **Seguridad**: Control de acceso basado en roles y validación de archivos

## Estructura del Módulo

```
src/modules/trainers/
├── entities/
│   └── trainer-verification-document.entity.ts
├── dto/
│   ├── upload-document.dto.ts
│   ├── verify-document.dto.ts
│   └── replace-document.dto.ts
├── trainer-verification.service.ts
├── trainer-verification.controller.ts
├── trainers.module.ts
└── README.md
```

## Entidades

### TrainerVerificationDocument

Representa un documento de verificación de un entrenador.

**Campos:**
- `id`: UUID único del documento
- `documentType`: Tipo de documento (enum)
- `originalName`: Nombre original del archivo
- `fileName`: Nombre del archivo en el servidor
- `filePath`: Ruta completa del archivo
- `mimeType`: Tipo MIME del archivo
- `fileSize`: Tamaño en bytes
- `isVerified`: Estado de verificación
- `verificationNotes`: Notas del admin
- `verifiedBy`: ID del admin que verificó
- `verifiedAt`: Fecha de verificación
- `trainerId`: ID del entrenador
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de actualización

## DTOs

### UploadDocumentDto
- `documentType`: Tipo de documento (requerido)
- `notes`: Notas opcionales

### VerifyDocumentDto
- `isVerified`: Estado de verificación (requerido)
- `verificationNotes`: Notas de verificación (opcional)
- `verifiedBy`: ID del admin (opcional)

### ReplaceDocumentDto
- `documentType`: Tipo de documento (requerido)
- `notes`: Notas opcionales

## Servicios

### TrainerVerificationService

Maneja toda la lógica de negocio para la verificación de documentos.

**Métodos principales:**
- `uploadDocument()`: Subir nuevo documento
- `replaceDocument()`: Reemplazar documento existente
- `getDocuments()`: Obtener documentos de un entrenador
- `deleteDocument()`: Eliminar documento
- `verifyDocument()`: Verificar documento (admin)
- `getAllPendingDocuments()`: Obtener documentos pendientes
- `getDocumentFile()`: Obtener información del archivo

## Controladores

### TrainerVerificationController

Maneja las peticiones HTTP para la verificación de documentos.

**Endpoints:**
- `POST /upload/:trainerId` - Subir documento
- `PUT /replace/:trainerId/:documentType` - Reemplazar documento
- `GET /documents/:trainerId` - Obtener documentos
- `GET /document/:documentId/:trainerId` - Obtener documento específico
- `GET /download/:documentId/:trainerId` - Descargar archivo
- `DELETE /document/:documentId/:trainerId` - Eliminar documento
- `PUT /verify/:documentId` - Verificar documento (admin)
- `GET /pending` - Obtener documentos pendientes
- `GET /document-types` - Obtener tipos disponibles

## Seguridad

### Autenticación
- Todos los endpoints requieren JWT válido
- Verificación de token en cada petición

### Autorización
- **Entrenadores**: Solo pueden acceder a sus propios documentos
- **Administradores**: Acceso completo a todos los documentos
- Control de roles mediante `@Roles()` decorator

### Validación de Archivos
- Tipos permitidos: PDF, JPG, JPEG, PNG
- Tamaño máximo: 10MB
- Nombres únicos para evitar conflictos

## Flujo de Verificación

1. **Entrenador sube documentos** → Estado: Pendiente
2. **Admin revisa documentos** → Estado: En revisión
3. **Admin aprueba/rechaza** → Estado: Verificado/Rechazado
4. **Si todos están verificados** → Entrenador marcado como verificado

## Configuración

### Directorio de Uploads
Los archivos se guardan en `uploads/trainer-verification/` con el formato:
```
{trainerId}_{documentType}_{uuid}.{extension}
```

### Base de Datos
La entidad se sincroniza automáticamente con la base de datos PostgreSQL.

## Uso

### Para Entrenadores
```typescript
// Subir identificación
const formData = new FormData();
formData.append('file', file);
formData.append('documentType', 'identification');

await this.http.post('/trainer-verification/upload/trainer-id', formData);
```

### Para Administradores
```typescript
// Verificar documento
await this.http.put('/trainer-verification/verify/document-id', {
  isVerified: true,
  verificationNotes: 'Documento válido'
});
```

## Dependencias

- `@nestjs/common`: Decorators y funcionalidades base
- `@nestjs/typeorm`: Integración con base de datos
- `multer`: Manejo de archivos multipart
- `uuid`: Generación de IDs únicos
- `fs`: Sistema de archivos del servidor

## Testing

Para ejecutar las pruebas del módulo:
```bash
npm run test src/modules/trainers
```

## Despliegue

1. Asegurar que el directorio `uploads/` tenga permisos de escritura
2. Configurar variables de entorno para la base de datos
3. Verificar que el JWT esté configurado correctamente
4. Probar endpoints con Postman o similar
