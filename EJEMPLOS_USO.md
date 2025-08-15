# Ejemplos de Uso - BlxckTraining Backend

## 📝 **Ejemplos de Uso**

### **Asignar un entrenador:**
```bash
curl -X POST http://localhost:3000/users/assign-trainer \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "e0ceb555-5885-4300-a462-8c6d010092b0",
    "trainerId": "8eb9f06f-40c3-403a-a56b-0cad0f334b35"
  }'
```

### **Ver usuarios de un entrenador:**
```bash
curl http://localhost:3000/users/by-trainer/8eb9f06f-40c3-403a-a56b-0cad0f334b35
```

### **Ver información de un entrenador:**
```bash
curl http://localhost:3000/users/trainer/8eb9f06f-40c3-403a-a56b-0cad0f334b35
```

### **Ver mi perfil de entrenador (autenticado):**
```bash
curl -H "Authorization: Bearer tu_jwt_token" \
  http://localhost:3000/users/trainer/profile/me
```

### **Ver entrenador de un usuario:**
```bash
curl http://localhost:3000/users/e0ceb555-5885-4300-a462-8c6d010092b0/trainer
```

### **Remover entrenador:**
```bash
curl -X DELETE http://localhost:3000/users/e0ceb555-5885-4300-a462-8c6d010092b0/trainer
```

## 🔑 **Formato de IDs:**

- **Usuarios**: UUIDs (ej: `e0ceb555-5885-4300-a462-8c6d010092b0`)
- **Entrenadores**: UUIDs (ej: `8eb9f06f-40c3-403a-a56b-0cad0f334b35`)
- **Campo `trainerId`**: UUID del entrenador o `null` si no tiene

## 📋 **Endpoints Completos Disponibles**

1. **`POST /users/assign-trainer`** - Asignar entrenador a usuario
2. **`GET /users/with-trainers`** - Ver usuarios con entrenadores
3. **`GET /users/trainer/{trainerId}`** - Ver información de un entrenador
4. **`GET /users/trainer/profile/me`** - Ver mi perfil de entrenador (autenticado) ⭐ **NUEVO**
5. **`GET /users/by-trainer/{trainerId}`** - Ver usuarios de un entrenador
6. **`GET /users/{userId}/trainer`** - Ver entrenador de un usuario
7. **`DELETE /users/{userId}/trainer`** - Remover entrenador de un usuario

## ✅ **Características Implementadas**

- **Endpoint sin protección JWT**: `POST /users/assign-trainer` no requiere autenticación
- **Relación 1:N**: Un entrenador puede tener varios usuarios, pero un usuario solo puede tener un entrenador activo
- **Asignación inteligente**: Si un usuario ya tiene entrenador, se reemplaza automáticamente
- **Campo directo**: La tabla de usuarios incluye `trainerId` para acceso rápido
- **Sincronización automática**: El campo `trainerId` se actualiza automáticamente
- **Historial preservado**: Las asignaciones anteriores se marcan como inactivas
