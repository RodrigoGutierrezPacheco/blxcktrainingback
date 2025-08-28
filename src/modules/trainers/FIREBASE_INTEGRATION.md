# Integración de Firebase Storage con Verificación de Entrenadores

Este documento explica cómo se ha integrado Firebase Storage con el sistema de verificación de entrenadores para subir y gestionar documentos de verificación.

## 🚀 Configuración Implementada

### 1. Estructura de Carpetas en Firebase Storage

```
Entrenadores/
├── {trainerId1}/
│   ├── identification_{timestamp}.jpg
│   ├── birth_certificate_{timestamp}.pdf
│   ├── curp_{timestamp}.jpg
│   └── rfc_{timestamp}.pdf
├── {trainerId2}/
│   ├── identification_{timestamp}.png
│   └── birth_certificate_{timestamp}.pdf
└── ...
```

### 2. Cambios en la Base de Datos

Se ha agregado el campo `firebaseUrl` a la entidad `TrainerVerificationDocument` para almacenar la URL pública del archivo en Firebase Storage.

## 📁 Endpoints Disponibles

### Subida de Documentos

#### `POST /trainer-verification/upload/:trainerId`
Sube un nuevo documento de verificación para un entrenador.

**Body (multipart/form-data):**
- `file`: Archivo a subir (PDF, JPG, JPEG, PNG)
- `documentType`: Tipo de documento (identification, birth_certificate, curp, rfc)

**Ejemplo de respuesta:**
```json
{
  "id": "uuid",
  "documentType": "identification",
  "originalName": "INE.jpg",
  "fileName": "trainer123_identification_uuid.jpg",
  "filePath": "Entrenadores/trainer123/trainer123_identification_uuid.jpg",
  "firebaseUrl": "https://storage.googleapis.com/bucket/Entrenadores/trainer123/trainer123_identification_uuid.jpg",
  "mimeType": "image/jpeg",
  "fileSize": 1024000,
  "isVerified": false,
  "trainerId": "trainer123"
}
```

#### `PUT /trainer-verification/replace/:trainerId/:documentType`
Reemplaza un documento existente del mismo tipo.

### Consulta de Documentos

#### `GET /trainer-verification/documents/:trainerId`
Obtiene todos los documentos de un entrenador.

#### `GET /trainer-verification/document/:documentId/:trainerId`
Obtiene un documento específico.

#### `GET /trainer-verification/file/:documentId/:trainerId`
Obtiene información del archivo incluyendo URL firmada temporal.

### Gestión de Archivos

#### `GET /trainer-verification/signed-url/:documentId/:trainerId`
Genera una URL firmada temporal para acceder al documento.

**Body (opcional):**
- `expirationMinutes`: Minutos de validez (default: 60)

#### `GET /trainer-verification/files/:trainerId`
Lista todos los archivos de un entrenador en Firebase Storage.

#### `GET /trainer-verification/exists/:trainerId/:filePath`
Verifica si un archivo existe en Firebase Storage.

### Administración

#### `PUT /trainer-verification/verify/:documentId`
Verifica un documento (solo admin).

#### `GET /trainer-verification/pending`
Obtiene todos los documentos pendientes de verificación (solo admin).

#### `DELETE /trainer-verification/:documentId/:trainerId`
Elimina un documento y su archivo de Firebase Storage.

## 🔐 Seguridad y Permisos

### Roles Requeridos
- **trainer**: Puede subir, reemplazar, ver y eliminar sus propios documentos
- **admin**: Puede acceder a todos los documentos y verificar documentos

### Validaciones
- **Tipo de archivo**: Solo PDF, JPG, JPEG, PNG
- **Tamaño máximo**: 10MB por archivo
- **Propiedad**: Los entrenadores solo pueden acceder a sus propios documentos

## 📊 Tipos de Documentos Soportados

1. **identification**: Documento de identificación (INE, pasaporte, etc.)
2. **birth_certificate**: Certificado de nacimiento
3. **curp**: Clave Única de Registro de Población
4. **rfc**: Registro Federal de Contribuyentes

## 🛠️ Uso en el Código

### Inyección del Servicio

```typescript
import { FirebaseStorageService } from 'src/common/firebase';

@Injectable()
export class YourService {
  constructor(
    private readonly firebaseStorage: FirebaseStorageService
  ) {}
}
```

### Subida de Documentos

```typescript
// Subir documento de identificación
const result = await this.firebaseStorage.uploadFileWithCustomName(
  file,
  'Entrenadores',
  `identification_${trainerId}_${Date.now()}.jpg`
);

if (result.success) {
  console.log('Documento subido:', result.url);
  console.log('Ruta en Firebase:', result.path);
}
```

### Generación de URLs Firmadas

```typescript
// Generar URL temporal válida por 1 hora
const signedUrl = await this.firebaseStorage.getSignedUrl(
  document.filePath, 
  60
);
```

## 🔍 Monitoreo y Debugging

### Logs del Sistema
El servicio registra todas las operaciones de Firebase Storage:
- Subida exitosa de archivos
- Errores de subida
- Eliminación de archivos
- Generación de URLs firmadas

### Verificación de Archivos
```typescript
// Verificar si un archivo existe
const exists = await this.firebaseStorage.fileExists(filePath);

// Obtener metadatos
const metadata = await this.firebaseStorage.getFileMetadata(filePath);
```

## 🚨 Manejo de Errores

### Errores Comunes

1. **Error de autenticación**: Verificar credenciales de Firebase
2. **Archivo no encontrado**: Verificar ruta del archivo
3. **Permisos insuficientes**: Verificar rol del usuario
4. **Tipo de archivo no permitido**: Verificar extensión del archivo
5. **Archivo demasiado grande**: Verificar tamaño del archivo

### Respuestas de Error

```json
{
  "statusCode": 400,
  "message": "Error al subir el archivo: Firebase error message",
  "error": "Bad Request"
}
```

## 📈 Estadísticas y Métricas

### Métodos Disponibles

```typescript
// Obtener estadísticas de documentos
const stats = await this.trainerFirebaseExample.getTrainerDocumentsStats();

// Obtener información de documentos de un entrenador
const docsInfo = await this.trainerFirebaseExample.getTrainerDocumentsInfo(trainerId);
```

## 🔄 Migración de Datos

### Ejecutar Migración
```bash
# Ejecutar migración para agregar campo firebaseUrl
npm run migration:run
```

### Migración Manual
Si necesitas migrar documentos existentes:

```typescript
// Subir archivos existentes a Firebase Storage
const documents = await this.documentRepository.find();
for (const doc of documents) {
  if (doc.filePath && !doc.firebaseUrl) {
    // Lógica para migrar archivo local a Firebase
    // y actualizar firebaseUrl
  }
}
```

## 🧪 Testing

### Endpoints de Prueba

1. **Subir documento de prueba**:
   ```bash
   curl -X POST http://localhost:8000/trainer-verification/upload/trainer123 \
     -H "Authorization: Bearer {token}" \
     -F "file=@test-document.jpg" \
     -F "documentType=identification"
   ```

2. **Verificar documento subido**:
   ```bash
   curl http://localhost:8000/trainer-verification/documents/trainer123 \
     -H "Authorization: Bearer {token}"
   ```

### Verificación en Firebase Console
1. Ir a Firebase Console > Storage
2. Verificar que aparezca la carpeta "Entrenadores"
3. Verificar que los archivos se suban correctamente

## 📚 Recursos Adicionales

- [Documentación de Firebase Storage](https://firebase.google.com/docs/storage)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [NestJS File Upload](https://docs.nestjs.com/techniques/file-upload)

## 🆘 Soporte

Para problemas relacionados con Firebase Storage:
1. Verificar logs del servidor
2. Verificar configuración de Firebase en variables de entorno
3. Verificar permisos del service account
4. Verificar conectividad a Firebase
