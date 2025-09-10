# 🚀 API Completa - BlxckTraining Backend

## 📋 **Descripción General**
Sistema completo de gestión de entrenamiento con usuarios, entrenadores, administradores, rutinas y planes.

---

## 🔐 **AUTENTICACIÓN Y AUTORIZACIÓN**

### **Registro de Usuarios**
- **POST** `/auth/register/user` - Registrar usuario normal
- **POST** `/auth/register/trainer` - Registrar entrenador
- **POST** `/auth/register/admin` - Registrar administrador

### **Login**
- **POST** `/auth/login/user` - Login de usuario normal
- **POST** `/auth/login/trainer` - Login de entrenador
- **POST** `/auth/login/admin` - Login de administrador

---

## 👥 **GESTIÓN DE USUARIOS**

### **Obtener Usuarios**
- **GET** `/users/with-trainers` - Todos los usuarios con información de entrenadores
- **GET** `/users/admins` - Todos los administradores
- **GET** `/users/trainers` - Todos los entrenadores
- **GET** `/users/normal` - Todos los usuarios normales
- **GET** `/users/by-email?email={email}` - Usuario por email
- **GET** `/users/:id` - Usuario por ID

### **Gestión de Entrenadores**
- **GET** `/users/trainer/:trainerId` - Perfil de entrenador específico
- **GET** `/users/trainer/profile/me` - Perfil del entrenador autenticado
- **GET** `/users/:userId/trainer` - Entrenador asignado a un usuario
- **POST** `/users/assign-trainer` - Asignar entrenador a usuario
- **DELETE** `/users/:userId/trainer` - Remover entrenador de usuario
- **GET** `/users/by-trainer/:trainerId` - Usuarios de un entrenador específico
- **PATCH** `/users/trainer/:trainerId` - Actualizar información del entrenador
- **PATCH** `/users/trainer/:trainerId/toggle-status` - Cambiar status activo/inactivo del entrenador
- **PATCH** `/users/trainer/:trainerId/toggle-verification` - Cambiar status de verificación del entrenador

### **Documentos de Entrenadores**
- **GET** `/users/trainer/:trainerId/documents` - Todos los documentos de verificación de un entrenador
- **GET** `/users/trainer/document/:documentId` - Documento específico de verificación por ID
- **PATCH** `/users/trainer/document/:documentId/verify` - Verificar documento de entrenador (solo admins)

### **Actualización de Usuarios**
- **PATCH** `/users/:id` - Actualizar información de usuario

---

## 📋 **GESTIÓN DE RUTINAS**

### **CRUD de Rutinas**
- **POST** `/routines` - Crear nueva rutina
- **GET** `/routines` - Todas las rutinas activas
- **GET** `/routines/all` - Todas las rutinas (activas e inactivas)
- **GET** `/routines/:id` - Rutina por ID
- **PATCH** `/routines/:id` - Actualizar rutina
- **DELETE** `/routines/:id` - Eliminar rutina

### **Rutinas por Entrenador**
- **GET** `/routines/trainer/:trainerId` - Rutinas de un entrenador específico

### **Asignación de Rutinas**
- **POST** `/routines/assign` - Asignar rutina a usuario
- **GET** `/routines/user/:userId` - Rutina de un usuario por ID
- **GET** `/routines/user/email/:email` - Rutina de un usuario por email
- **GET** `/routines/user/by-email?email={email}` - Rutina de un usuario por email (query param)

### **Gestión de Rutinas de Usuario**
- **PATCH** `/routines/user/:userId/routine/:routineId/deactivate` - Desactivar rutina de usuario
- **DELETE** `/routines/user/:userId/routine/:routineId` - Eliminar rutina de usuario

### **Sincronización y Reportes**
- **POST** `/routines/sync-users-routine-status` - Sincronizar estado de rutinas de usuarios
- **GET** `/routines/users/with-routine-status` - Usuarios con estado de rutina
- **GET** `/routines/users/with-routine-details` - Usuarios con detalles de rutina
- **GET** `/routines/users/without-routine` - Usuarios sin rutina
- **GET** `/routines/users/with-routine` - Usuarios con rutina

---

## 💪 **GESTIÓN DE GRUPOS MUSCULARES**

### **CRUD de Grupos Musculares**
- **POST** `/muscle-groups` - Crear nuevo grupo muscular
- **GET** `/muscle-groups` - Todos los grupos musculares (activos e inactivos)
- **GET** `/muscle-groups/active` - Solo grupos musculares activos
- **GET** `/muscle-groups/all` - Todos los grupos musculares (activos e inactivos)
- **GET** `/muscle-groups/:id` - Grupo muscular por ID
- **PATCH** `/muscle-groups/:id` - Actualizar grupo muscular
- **DELETE** `/muscle-groups/:id` - Eliminar grupo muscular (soft delete)
- **PATCH** `/muscle-groups/:id/activate` - Activar grupo muscular
- **PATCH** `/muscle-groups/:id/toggle-status` - Cambiar status activo/inactivo

---

## 🏋️ **GESTIÓN DE EJERCICIOS**

### **CRUD de Ejercicios**
- **POST** `/exercises` - Crear nuevo ejercicio
- **POST** `/exercises/with-image` - Crear ejercicio con imagen de Firebase Storage
- **POST** `/exercises/with-image-id` - Crear ejercicio con ID de imagen
- **GET** `/exercises` - Todos los ejercicios (activos e inactivos)
- **GET** `/exercises/active` - Solo ejercicios activos
- **GET** `/exercises/all` - Todos los ejercicios (activos e inactivos)
- **GET** `/exercises/muscle-group/:muscleGroupId` - Ejercicios por grupo muscular
- **GET** `/exercises/:id` - Ejercicio por ID
- **PATCH** `/exercises/:id` - Actualizar ejercicio
- **PATCH** `/exercises/:id/with-image` - Actualizar ejercicio con imagen de Firebase Storage
- **DELETE** `/exercises/:id` - Eliminar ejercicio (soft delete)
- **PATCH** `/exercises/:id/activate` - Activar ejercicio
- **PATCH** `/exercises/:id/toggle-status` - Cambiar status activo/inactivo

### **CRUD de Grupos Musculares**
- **POST** `/muscle-groups` - Crear nuevo grupo muscular
- **GET** `/muscle-groups` - Todos los grupos musculares (activos e inactivos)
- **GET** `/muscle-groups/active` - Solo grupos musculares activos
- **GET** `/muscle-groups/all` - Todos los grupos musculares (activos e inactivos)
- **GET** `/muscle-groups/:id` - Grupo muscular por ID
- **PATCH** `/muscle-groups/:id` - Actualizar grupo muscular
- **DELETE** `/muscle-groups/:id` - Eliminar grupo muscular (soft delete)
- **PATCH** `/muscle-groups/:id/activate` - Activar grupo muscular
- **PATCH** `/muscle-groups/:id/toggle-status` - Cambiar status activo/inactivo

---

## 💰 **GESTIÓN DE PLANES**

### **CRUD de Planes**
- **POST** `/plans` - Crear nuevo plan
- **GET** `/plans` - Todos los planes activos
- **GET** `/plans/all` - Todos los planes (activos e inactivos)
- **GET** `/plans/:id` - Plan por ID
- **PATCH** `/plans/:id` - Actualizar plan
- **DELETE** `/plans/:id` - Eliminar plan

### **Activación/Desactivación**
- **PATCH** `/plans/:id/deactivate` - Desactivar plan
- **PATCH** `/plans/:id/activate` - Activar plan

### **Búsquedas Avanzadas**
- **GET** `/plans/search/price-range?minPrice={min}&maxPrice={max}` - Planes por rango de precio
- **GET** `/plans/search/duration/:duration` - Planes por duración
- **GET** `/plans/type/:type` - Planes por tipo (user/trainer)
- **GET** `/plans/search/type/:type/price-range?minPrice={min}&maxPrice={max}` - Planes por tipo y rango de precio

---

## 🏠 **ENDPOINTS GENERALES**

- **GET** `/` - Información general de la API

---

## 📊 **ESTRUCTURA DE DATOS**

### **Rutinas**
```
Routine → Weeks → Days → Exercises
├── name, description, comments
├── weekNumber, name, comments
├── dayNumber, name, comments
└── name, sets, repetitions, restBetweenSets, restBetweenExercises, comments, order
```

### **Grupos Musculares**
```
MuscleGroup
├── title (string, 3-100 caracteres)
├── description (text, 10-1000 caracteres)
├── isActive (boolean, default: true)
└── createdAt, updatedAt
```

### **Ejercicios**
```
Exercise
├── name (string, 3-100 caracteres)
├── description (text, 10-1000 caracteres)
├── image (json: {type, url}, opcional)
├── muscleGroupId (uuid, obligatorio)
├── muscleGroupName (string, 100 caracteres)
├── isActive (boolean, default: true)
└── createdAt, updatedAt
```

### **Planes**
```
Plan
├── name, price, duration, detail
├── type (user/trainer)
├── features (array de strings)
├── badge (color, name)
├── image (type, url)
└── isActive
```

### **Usuarios**
```
User/Admin/Trainer/NormalUser
├── id, email, fullName, role
├── hasRoutine (boolean)
├── age, weight, height (opcional)
└── createdAt, updatedAt
```

---

## 🔒 **AUTENTICACIÓN**

Todos los endpoints (excepto registro y login) requieren:
```
Authorization: Bearer {JWT_TOKEN}
```

---

## 📝 **EJEMPLOS DE USO**

### **Obtener Todos los Administradores**
```bash
curl -X GET http://localhost:8000/users/admins \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Obtener Todos los Entrenadores**
```bash
curl -X GET http://localhost:8000/users/trainers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta incluye:**
- Información completa del entrenador (sin contraseña)
- Campo `assignedUsersCount` con el número de usuarios asignados

**Ejemplo de respuesta:**
```json
[
  {
    "id": "9ad642c2-15c1-4359-8139-b1964303014f",
    "email": "entrenador1@ejemplo.com",
    "fullName": "Carlos Entrenador",
    "role": "trainer",
    "age": 30,
    "phone": "+1234567890",
    "isActive": true,
    "isVerified": false,
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z",
    "assignedUsersCount": 5
  },
  {
    "id": "otro-uuid-entrenador",
    "email": "entrenador2@ejemplo.com",
    "fullName": "María Entrenadora",
    "role": "trainer",
    "age": 28,
    "phone": "+0987654321",
    "isActive": false,
    "isVerified": true,
    "createdAt": "2024-01-12T10:00:00.000Z",
    "updatedAt": "2024-01-12T10:00:00.000Z",
    "assignedUsersCount": 0
  }
]
```

### **Obtener Todos los Usuarios Normales**
```bash
curl -X GET http://localhost:8000/users/normal \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta incluye:**
- Información completa del usuario (sin contraseña)
- Información del entrenador asignado (si tiene uno)
- Campo `trainer: null` si no tiene entrenador asignado

**Ejemplo de respuesta:**
```json
[
  {
    "id": "uuid-del-usuario",
    "email": "usuario@ejemplo.com",
    "fullName": "Juan Pérez",
    "role": "user",
    "age": 25,
    "weight": 70,
    "height": 175,
    "trainerId": "uuid-del-entrenador",
    "hasRoutine": true,
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "trainer": {
      "id": "uuid-del-entrenador",
      "fullName": "Carlos Entrenador",
      "email": "entrenador@ejemplo.com",
      "role": "trainer",
      "age": 30,
      "phone": "+1234567890",
      "createdAt": "2024-01-10T10:00:00.000Z",
      "updatedAt": "2024-01-10T10:00:00.000Z"
    }
  }
]
```

### **Obtener Todas las Rutinas (Incluyendo Inactivas)**
```bash
curl -X GET http://localhost:8000/routines/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Obtener Todos los Usuarios con Entrenadores**
```bash
curl -X GET http://localhost:8000/users/with-trainers \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Crear Grupo Muscular**
```bash
curl -X POST http://localhost:8000/muscle-groups \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pecho",
    "description": "Grupo muscular del pecho que incluye pectoral mayor, pectoral menor y serrato anterior. Fundamental para ejercicios de empuje y desarrollo de la parte superior del cuerpo."
  }'
```

**Respuesta:**
```json
{
  "id": "uuid-generado",
  "title": "Pecho",
  "description": "Grupo muscular del pecho que incluye pectoral mayor, pectoral menor y serrato anterior. Fundamental para ejercicios de empuje y desarrollo de la parte superior del cuerpo.",
  "isActive": true,
  "createdAt": "2024-01-15T16:00:00.000Z",
  "updatedAt": "2024-01-15T16:00:00.000Z"
}
```

### **Obtener Todos los Grupos Musculares (Activos e Inactivos)**
```bash
curl -X GET http://localhost:8000/muscle-groups \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta incluye:**
- Todos los grupos musculares (activos e inactivos)
- Campo `isActive` para identificar el status de cada grupo
- Ordenados alfabéticamente por título

**Ejemplo de respuesta:**
```json
[
  {
    "id": "uuid-1",
    "title": "Espalda",
    "description": "Grupo muscular de la espalda...",
    "isActive": true,
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  },
  {
    "id": "uuid-2",
    "title": "Pecho",
    "description": "Grupo muscular del pecho...",
    "isActive": false,
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:30:00.000Z"
  }
]
```

### **Obtener Solo Grupos Musculares Activos**
```bash
curl -X GET http://localhost:8000/muscle-groups/active \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta:**
```json
[
  {
    "id": "uuid-1",
    "title": "Pecho",
    "description": "Grupo muscular del pecho...",
    "isActive": true,
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  },
  {
    "id": "uuid-2",
    "title": "Espalda",
    "description": "Grupo muscular de la espalda...",
    "isActive": true,
    "createdAt": "2024-01-15T16:00:00.000Z",
    "updatedAt": "2024-01-15T16:00:00.000Z"
  }
]
```

### **Actualizar Grupo Muscular**
```bash
curl -X PATCH http://localhost:8000/muscle-groups/UUID_DEL_GRUPO \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Pecho Superior",
    "description": "Descripción actualizada del grupo muscular del pecho..."
  }'
```

### **Eliminar Grupo Muscular (Soft Delete)**
```bash
curl -X DELETE http://localhost:8000/muscle-groups/UUID_DEL_GRUPO \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Activar Grupo Muscular**
```bash
curl -X PATCH http://localhost:8000/muscle-groups/UUID_DEL_GRUPO/activate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Cambiar Status de Grupo Muscular**
```bash
curl -X PATCH http://localhost:8000/muscle-groups/UUID_DEL_GRUPO/toggle-status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta:**
```json
{
  "isActive": false
}
```

---

## 🏋️ **EJEMPLOS DE USO - EJERCICIOS**

### **Crear Ejercicio**

#### **Opción 1: Con ID de Imagen (Recomendado)**
```bash
curl -X POST http://localhost:8000/exercises \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Press de Banca",
    "description": "Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores.",
    "imageId": "ef2e0482-95a2-43e7-a6e8-46450b0ccc2d",
    "muscleGroupId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

#### **Opción 2: Con URL de Imagen Personalizada**
```bash
curl -X POST http://localhost:8000/exercises \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Flexiones",
    "description": "Ejercicio de peso corporal para el pecho, tríceps y deltoides anteriores.",
    "image": {
      "type": "jpg",
      "url": "https://ejemplo.com/flexiones.jpg"
    },
    "muscleGroupId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

#### **Opción 3: Sin Imagen**
```bash
curl -X POST http://localhost:8000/exercises \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Plancha",
    "description": "Ejercicio isométrico para fortalecer el core.",
    "muscleGroupId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

**Respuesta:**
```json
{
  "id": "uuid-generado",
  "name": "Press de Banca",
  "description": "Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores.",
  "image": {
    "type": "gif",
    "url": "https://storage.googleapis.com/blxcktraining2.firebasestorage.app/Ejercicios/Pecho/press-banca.gif?X-Goog-Algorithm=..."
  },
  "muscleGroupId": "123e4567-e89b-12d3-a456-426614174000",
  "muscleGroupName": "Pecho",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Notas:**
- **`imageId`**: Usa el UUID de una imagen de `media_assets` (recomendado)
- **`image`**: Usa una URL personalizada de imagen
- **Ambos campos son opcionales** - no puedes usar ambos al mismo tiempo
- Si usas `imageId`, la imagen se marcará automáticamente como `isAssigned: true`
- Si usas `image.url`, el sistema intentará extraer el `filePath` para marcar la imagen como asignada

### **Crear Ejercicio con Imagen de Firebase Storage**
```bash
curl -X POST http://localhost:8000/exercises/with-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Press de Banca",
    "description": "Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores. Se realiza acostado en un banco plano.",
    "muscleGroupId": "UUID_DEL_GRUPO_MUSCULAR",
    "imagePath": "Ejercicios/Pecho/press-banca.gif"
  }'
```

**Respuesta:**
```json
{
  "id": "uuid-generado",
  "name": "Press de Banca",
  "description": "Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores. Se realiza acostado en un banco plano.",
  "image": {
    "type": "gif",
    "url": "https://storage.googleapis.com/blxcktraining2.firebasestorage.app/Ejercicios/Pecho/press-banca.gif?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=..."
  },
  "muscleGroupId": "UUID_DEL_GRUPO_MUSCULAR",
  "muscleGroupName": "Pecho",
  "isActive": true,
  "createdAt": "2024-01-15T16:00:00.000Z",
  "updatedAt": "2024-01-15T16:00:00.000Z"
}
```

**Notas:**
- El campo `imagePath` es opcional
- Si se proporciona, debe ser una ruta válida de Firebase Storage registrada en `media_assets`
- La URL de la imagen será una URL firmada temporal (60 minutos de validez)
- Si no se proporciona `imagePath`, el ejercicio se creará sin imagen

### **Crear Ejercicio con ID de Imagen**
```bash
curl -X POST http://localhost:8000/exercises/with-image-id \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Press de Banca",
    "description": "Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores.",
    "muscleGroupId": "123e4567-e89b-12d3-a456-426614174000",
    "imageId": "ef2e0482-95a2-43e7-a6e8-46450b0ccc2d"
  }'
```

**Respuesta:**
```json
{
  "id": "uuid-generado",
  "name": "Press de Banca",
  "description": "Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores.",
  "image": {
    "type": "gif",
    "url": "https://storage.googleapis.com/blxcktraining2.firebasestorage.app/Ejercicios/Pecho/press-banca.gif?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=..."
  },
  "muscleGroupId": "123e4567-e89b-12d3-a456-426614174000",
  "muscleGroupName": "Pecho",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

**Notas:**
- El campo `imageId` es opcional
- Si se proporciona, debe ser un UUID válido de una imagen en `media_assets`
- La imagen se marcará automáticamente como `isAssigned: true`
- Se genera una URL firmada temporal (60 minutos de validez)
- Si no se proporciona `imageId`, el ejercicio se creará sin imagen

### **Actualizar Ejercicio con Imagen de Firebase Storage**
```bash
curl -X PATCH http://localhost:8000/exercises/UUID_DEL_EJERCICIO/with-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Press de Banca Inclinado",
    "description": "Ejercicio compuesto para el pecho en banco inclinado que involucra pectoral mayor, tríceps y deltoides anteriores.",
    "muscleGroupId": "123e4567-e89b-12d3-a456-426614174000",
    "imagePath": "Ejercicios/Pecho/press-banca-inclinado.gif"
  }'
```

**Respuesta:**
```json
{
  "id": "uuid-del-ejercicio",
  "name": "Press de Banca Inclinado",
  "description": "Ejercicio compuesto para el pecho en banco inclinado que involucra pectoral mayor, tríceps y deltoides anteriores.",
  "image": {
    "type": "gif",
    "url": "https://storage.googleapis.com/blxcktraining2.firebasestorage.app/Ejercicios/Pecho/press-banca-inclinado.gif?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=..."
  },
  "muscleGroupId": "123e4567-e89b-12d3-a456-426614174000",
  "muscleGroupName": "Pecho",
  "isActive": true,
  "updatedAt": "2024-01-15T16:00:00.000Z"
}
```

**Actualización sin cambiar imagen:**
```bash
curl -X PATCH http://localhost:8000/exercises/UUID_DEL_EJERCICIO/with-image \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Press de Banca con Barra",
    "description": "Descripción actualizada del press de banca con barra...",
    "muscleGroupId": "123e4567-e89b-12d3-a456-426614174000"
  }'
```

**Notas:**
- Todos los campos son opcionales
- Si se proporciona `imagePath`, debe ser una ruta válida registrada en `media_assets`
- La imagen se actualiza con URL firmada temporal (60 minutos de validez)
- Si no se proporciona `imagePath`, la imagen actual se mantiene
- Se valida que el nombre sea único y el grupo muscular exista

### **Obtener Todos los Ejercicios (Activos e Inactivos)**
```bash
curl -X GET http://localhost:8000/exercises \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta incluye:**
- Todos los ejercicios (activos e inactivos)
- Campo `isActive` para identificar el status de cada ejercicio
- Campo `muscleGroupName` para consultas rápidas
- Ordenados alfabéticamente por nombre

### **Obtener Ejercicios por Grupo Muscular**
```bash
curl -X GET http://localhost:8000/exercises/muscle-group/UUID_DEL_GRUPO_MUSCULAR \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Actualizar Ejercicio**
```bash
curl -X PATCH http://localhost:8000/exercises/UUID_DEL_EJERCICIO \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Press de Banca con Barra",
    "description": "Descripción actualizada del press de banca...",
    "muscleGroupId": "NUEVO_UUID_GRUPO_MUSCULAR"
  }'
```

### **Eliminar Ejercicio (Soft Delete)**
```bash
curl -X DELETE http://localhost:8000/exercises/UUID_DEL_EJERCICIO \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Activar Ejercicio**
```bash
curl -X PATCH http://localhost:8000/exercises/UUID_DEL_EJERCICIO/activate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Cambiar Status de Ejercicio**
```bash
curl -X PATCH http://localhost:8000/exercises/UUID_DEL_EJERCICIO/toggle-status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta:**
```json
{
  "isActive": false
}
```

### **Actualizar Entrenador**
```bash
curl -X PATCH http://localhost:8000/users/trainer/TRAINER_UUID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Nuevo Nombre del Entrenador",
    "age": 32,
    "phone": "+1234567890",
    "documents": "Certificaciones actualizadas...",
    "rfc": "CARE800101ABC",
    "curp": "CARE800101HDFABC00",
    "dateOfBirth": "1980-01-01"
  }'
```

**Campos actualizables:**
- `fullName` - Nombre completo
- `age` - Edad (18-100 años)
- `phone` - Número de teléfono
- `documents` - Documentos/certificaciones
- `rfc` - RFC del entrenador (13 caracteres, formato: AAAA000000AAA)
- `curp` - CURP del entrenador (18 caracteres, formato: AAAA000000HAAAAA00)
- `dateOfBirth` - Fecha de nacimiento (formato: YYYY-MM-DD)

**Respuesta:**
```json
{
  "id": "eaee096b-8ee4-43c0-b3a4-f5ec73d0d542",
  "email": "entrenador@ejemplo.com",
  "fullName": "Nuevo Nombre del Entrenador",
  "role": "trainer",
  "age": 32,
  "phone": "+1234567890",
  "documents": "Certificaciones actualizadas...",
  "rfc": "CARE800101ABC",
  "curp": "CARE800101HDFABC00",
  "dateOfBirth": "1980-01-01",
  "isActive": true,
  "isVerified": false,
  "createdAt": "2024-01-10T10:00:00.000Z",
  "updatedAt": "2024-01-15T16:00:00.000Z"
}
```

**Nota:** Solo el propio entrenador o administradores pueden actualizar la información.

### **Cambiar Status de Entrenador**
```bash
curl -X PATCH http://localhost:8000/users/trainer/TRAINER_UUID/toggle-status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta:**
```json
{
  "message": "Status del entrenador cambiado exitosamente a inactivo",
  "isActive": false
}
```

**Nota:** Solo los administradores pueden cambiar el status de los entrenadores.

### **Cambiar Status de Verificación de Entrenador**
```bash
curl -X PATCH http://localhost:8000/users/trainer/TRAINER_UUID/toggle-verification \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta:**
```json
{
  "message": "Status de verificación del entrenador cambiado exitosamente a verificado",
  "isVerified": true
}
```

**Nota:** Solo los administradores pueden cambiar el status de verificación de los entrenadores.

---

## 🖼️ **EJEMPLOS DE USO - MEDIA ASSETS**

### **Obtener Imágenes de una Carpeta con URLs Firmadas**
```bash
curl -X GET "http://localhost:8000/media-assets/by-folder?folder=Biceps&expirationMinutes=120" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**También disponible como:**
```bash
curl -X GET "http://localhost:8000/media-assets/by-folder-with-signed-urls?folder=Biceps&expirationMinutes=120" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Respuesta:**
```json
[
  {
    "id": "ef2e0482-95a2-43e7-a6e8-46450b0ccc2d",
    "folder": "Biceps",
    "filePath": "Ejercicios/Biceps/Barbell-Curl-On-Arm-Blaster.gif",
    "url": "https://storage.googleapis.com/blxcktraining2.firebasestorage.app/Ejercicios/Biceps/Barbell-Curl-On-Arm-Blaster.gif?GoogleAccessId=firebase-adminsdk-fbsvc%40blxcktraining2.iam.gserviceaccount.com&Expires=1757047986&Signature=...",
    "name": "Curl con Barra en Arm Blaster",
    "description": "Ejercicio para bíceps con barra en arm blaster",
    "isAssigned": false,
    "createdAt": "2025-09-05T03:53:56.958Z",
    "updatedAt": "2025-09-05T03:53:56.958Z"
  },
  {
    "id": "ca05de2a-316e-428e-8f93-29cce70c34c8",
    "folder": "Biceps",
    "filePath": "Ejercicios/Biceps/Concentration-Curl.gif",
    "url": "https://storage.googleapis.com/...&X-Goog-Expires=...",
    "name": "Curl de Concentración",
    "description": "Ejercicio aislado para bíceps",
    "isAssigned": true,
    "createdAt": "2025-09-05T03:54:12.123Z",
    "updatedAt": "2025-09-05T03:54:12.123Z"
  }
]
```

**Parámetros:**
- `folder` (requerido): Nombre de la carpeta (ej: "Biceps", "Pecho", "Cardio")
- `expirationMinutes` (opcional): Minutos de validez de las URLs firmadas (por defecto 60)

**Notas:**
- Las URLs firmadas son temporales y seguras
- Si falla la generación de URL firmada, se devuelve la URL pública original
- Se ordenan por nombre de archivo (ASC)
- **`isAssigned`**: Indica si la imagen está siendo utilizada en algún ejercicio
  - `false`: Imagen disponible para asignar a un ejercicio
  - `true`: Imagen ya está asignada a un ejercicio
- El estado se actualiza automáticamente cuando se crea, actualiza o elimina un ejercicio

---

## 🖼️ **GESTIÓN DE MEDIA ASSETS**

### **CRUD de Media Assets**
- **POST** `/media-assets/upsert` - Crear/actualizar metadatos de imagen/GIF
- **GET** `/media-assets` - Listar todos los metadatos
- **GET** `/media-assets/by-folder` - Listar imágenes de carpeta con URLs firmadas
- **GET** `/media-assets/by-folder-with-signed-urls` - Listar imágenes de carpeta con URLs firmadas (alias)
- **DELETE** `/media-assets` - Eliminar metadatos por filePath
- **GET** `/media-assets/missing` - Listar archivos sin metadatos

---

## 🎯 **CARACTERÍSTICAS ESPECIALES**

1. **🔐 JWT Authentication** - Sistema seguro de autenticación
2. **📊 Relaciones Complejas** - Usuarios, entrenadores, rutinas y planes interconectados
3. **🔄 Soft Delete** - Los planes se pueden desactivar en lugar de eliminar
4. **📈 Estado de Rutinas** - Control automático del campo `hasRoutine` en usuarios
5. **🔍 Búsquedas Avanzadas** - Filtros por precio, duración, tipo, etc.
6. **📝 Validación Completa** - Uso de class-validator para todas las entradas
7. **⏰ Timestamps Automáticos** - Control de fechas de creación y actualización
8. **🆔 UUIDs** - Identificadores únicos para todas las entidades

---

## 🚀 **INFORMACIÓN DEL SERVIDOR**

- **URL Base:** `http://localhost:8000`
- **Documentación Swagger:** `http://localhost:8000/api`
- **Framework:** NestJS v11.0.10
- **Base de Datos:** PostgreSQL con TypeORM
- **Autenticación:** JWT (JSON Web Tokens)
