# Ejemplo Práctico: Desasignar Todas las Rutinas de Laura

## Escenario

Laura tiene múltiples rutinas asignadas y queremos desasignar todas sus rutinas activas usando su email.

## Estado Inicial

### **Verificar Rutinas Actuales de Laura**

```bash
GET /routines/user/email/laura@gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta:**
```json
[
  {
    "id": "user-routine-1",
    "user_id": "user-laura-123",
    "routine_id": "routine-456",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": null,
    "notes": "Rutina de principiante",
    "isActive": true,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-01T10:00:00.000Z",
    "routine": {
      "id": "routine-456",
      "name": "Rutina de Principiante",
      "description": "Rutina básica para comenzar"
    }
  },
  {
    "id": "user-routine-2",
    "user_id": "user-laura-123",
    "routine_id": "routine-789",
    "startDate": "2024-01-10T00:00:00.000Z",
    "endDate": null,
    "notes": "Rutina intermedia",
    "isActive": true,
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-10T10:00:00.000Z",
    "routine": {
      "id": "routine-789",
      "name": "Rutina Intermedia",
      "description": "Rutina para usuarios con experiencia"
    }
  }
]
```

### **Verificar Estado del Usuario**

```bash
GET /users/by-email?email=laura%40gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta:**
```json
{
  "id": "user-laura-123",
  "email": "laura@gmail.com",
  "fullName": "Laura García",
  "hasRoutine": true,
  "isActive": true
}
```

## Operación: Desasignar Todas las Rutinas

### **Request**

```bash
DELETE /routines/user/email/laura@gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

### **Respuesta Exitosa**

```json
{
  "message": "Se desasignaron 2 rutina(s) del usuario exitosamente",
  "deactivatedRoutines": 2
}
```

## Estado Después de la Operación

### **Verificar Rutinas de Laura (Después)**

```bash
GET /routines/user/email/laura@gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta:**
```json
[
  {
    "id": "user-routine-1",
    "user_id": "user-laura-123",
    "routine_id": "routine-456",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-15T10:30:00.000Z",
    "notes": "Rutina de principiante",
    "isActive": false,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "routine": {
      "id": "routine-456",
      "name": "Rutina de Principiante",
      "description": "Rutina básica para comenzar"
    }
  },
  {
    "id": "user-routine-2",
    "user_id": "user-laura-123",
    "routine_id": "routine-789",
    "startDate": "2024-01-10T00:00:00.000Z",
    "endDate": "2024-01-15T10:30:00.000Z",
    "notes": "Rutina intermedia",
    "isActive": false,
    "createdAt": "2024-01-10T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "routine": {
      "id": "routine-789",
      "name": "Rutina Intermedia",
      "description": "Rutina para usuarios con experiencia"
    }
  }
]
```

### **Verificar Estado del Usuario (Después)**

```bash
GET /users/by-email?email=laura%40gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta:**
```json
{
  "id": "user-laura-123",
  "email": "laura@gmail.com",
  "fullName": "Laura García",
  "hasRoutine": false,
  "isActive": true
}
```

## Cambios Observados

### **✅ Cambios en las Rutinas:**
- `isActive`: `true` → `false` (ambas rutinas)
- `endDate`: `null` → `"2024-01-15T10:30:00.000Z"` (fecha actual)
- `updatedAt`: Se actualiza a la fecha actual

### **✅ Cambios en el Usuario:**
- `hasRoutine`: `true` → `false`

### **✅ Historial Preservado:**
- Las rutinas no se eliminan
- Se mantiene toda la información histórica
- Se puede ver el historial completo de rutinas asignadas

## Casos de Uso Comunes

### **1. Laura Termina su Programa de Entrenamiento**

```javascript
// Paso 1: Desasignar todas las rutinas actuales
const result = await fetch('/routines/user/email/laura@gmail.com', {
  method: 'DELETE',
  headers: { 'Authorization': `Bearer ${token}` }
});

console.log('Rutinas desasignadas:', result.deactivatedRoutines);

// Paso 2: Asignar nueva rutina
const newRoutine = await fetch('/routines/assign', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'user-laura-123',
    routineId: 'routine-advanced-999',
    startDate: '2024-01-20T00:00:00.000Z',
    endDate: '2024-03-20T00:00:00.000Z',
    notes: 'Nueva rutina avanzada para Laura'
  })
});
```

### **2. Laura Pausa sus Entrenamientos**

```javascript
// Laura se lesiona y necesita pausar sus entrenamientos
await deactivateAllUserRoutines('laura@gmail.com');

// Más tarde, cuando se recupere, se puede asignar una rutina de rehabilitación
await assignRoutineToUser({
  userId: 'user-laura-123',
  routineId: 'routine-rehabilitation',
  startDate: '2024-02-01T00:00:00.000Z',
  notes: 'Rutina de rehabilitación post-lesión'
});
```

### **3. Limpieza Administrativa**

```javascript
// Administrador limpia rutinas de usuarios inactivos
const usersToClean = [
  'laura@gmail.com',
  'juan@gmail.com',
  'maria@gmail.com'
];

for (const email of usersToClean) {
  try {
    const result = await deactivateAllUserRoutines(email);
    console.log(`${email}: ${result.message}`);
  } catch (error) {
    console.error(`Error con ${email}:`, error.message);
  }
}
```

## Ventajas del Nuevo Endpoint

### **✅ Eficiencia**
- Una sola llamada desasigna todas las rutinas
- No es necesario llamar múltiples endpoints

### **✅ Consistencia**
- Actualiza automáticamente el estado del usuario
- Mantiene fechas de finalización consistentes

### **✅ Simplicidad**
- API simple y fácil de usar
- Respuesta clara con información útil

### **✅ Seguridad**
- Requiere autenticación JWT
- Validación de existencia del usuario

### **✅ Flexibilidad**
- Funciona con cualquier número de rutinas (0, 1, o múltiples)
- No causa errores si el usuario no tiene rutinas activas

## Código de Ejemplo Completo

### **Función JavaScript**

```javascript
async function deactivateAllUserRoutines(email) {
  try {
    console.log(`Desasignando rutinas para: ${email}`);
    
    const response = await fetch(`/routines/user/email/${email}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Éxito:', result.message);
      console.log(`📊 Rutinas desasignadas: ${result.deactivatedRoutines}`);
      return result;
    } else {
      console.error('❌ Error:', result.message);
      throw new Error(result.message);
    }
  } catch (error) {
    console.error('💥 Error en la operación:', error);
    throw error;
  }
}

// Uso
deactivateAllUserRoutines('laura@gmail.com')
  .then(result => {
    console.log('Operación completada exitosamente');
  })
  .catch(error => {
    console.error('Operación falló:', error);
  });
```

### **React Hook**

```javascript
import { useState } from 'react';

const useRoutineDeactivation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deactivateAllRoutines = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/routines/user/email/${email}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    deactivateAllRoutines,
    loading,
    error
  };
};

// Uso en componente
const MyComponent = () => {
  const { deactivateAllRoutines, loading, error } = useRoutineDeactivation();

  const handleDeactivate = async (email) => {
    try {
      const result = await deactivateAllRoutines(email);
      alert(`✅ ${result.message}`);
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div>
      <button 
        onClick={() => handleDeactivate('laura@gmail.com')}
        disabled={loading}
      >
        {loading ? 'Desasignando...' : 'Desasignar Rutinas de Laura'}
      </button>
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
    </div>
  );
};
```

¡El endpoint está completamente funcional y listo para usar! 🎉
