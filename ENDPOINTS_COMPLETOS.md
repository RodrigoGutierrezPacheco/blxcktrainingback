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
