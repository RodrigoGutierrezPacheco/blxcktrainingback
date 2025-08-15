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

## 📋 **Endpoints Completos de Asignación de Entrenadores**

### **1. Asignar Entrenador a Usuario**
```http
POST /users/assign-trainer
Content-Type: application/json

{
  "userId": "e0ceb555-5885-4300-a462-8c6d010092b0",
  "trainerId": "8eb9f06f-40c3-403a-a56b-0cad0f334b35"
}
```

### **2. Obtener Usuarios con Entrenadores Asignados**
```http
GET /users/with-trainers
```

### **3. Obtener Información de un Entrenador**
```http
GET /users/trainer/{trainerId}
```

**Ejemplo:**
```http
GET /users/trainer/8eb9f06f-40c3-403a-a56b-0cad0f334b35
```

**Respuesta:**
```json
{
  "id": "8eb9f06f-40c3-403a-a56b-0cad0f334b35",
  "fullName": "Carlos Entrenador",
  "email": "carlos@example.com",
  "role": "trainer",
  "age": 35,
  "phone": "+1234567890",
  "documents": "Certificaciones...",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### **4. Obtener Usuarios por Entrenador**
```http
GET /users/by-trainer/8eb9f06f-40c3-403a-a56b-0cad0f334b35
```

### **5. Obtener Entrenador de un Usuario**
```http
GET /users/e0ceb555-5885-4300-a462-8c6d010092b0/trainer
```

### **6. Remover Entrenador de un Usuario**
```http
DELETE /users/e0ceb555-5885-4300-a462-8c6d010092b0/trainer
```

## ✅ **Características Implementadas**

- **Endpoint sin protección JWT**: `POST /users/assign-trainer` no requiere autenticación
- **Relación 1:N**: Un entrenador puede tener varios usuarios, pero un usuario solo puede tener un entrenador activo
- **Asignación inteligente**: Si un usuario ya tiene entrenador, se reemplaza automáticamente
- **Campo directo**: La tabla de usuarios incluye `trainerId` para acceso rápido
- **Sincronización automática**: El campo `trainerId` se actualiza automáticamente
- **Historial preservado**: Las asignaciones anteriores se marcan como inactivas
