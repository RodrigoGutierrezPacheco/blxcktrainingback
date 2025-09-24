# Ejemplo: Desasignación Automática de Rutinas

## Descripción

Cuando se asigna una nueva rutina a un usuario que ya tiene rutinas activas, el sistema automáticamente desasigna todas las rutinas anteriores y solo mantiene la nueva asignación.

## Comportamiento Anterior vs Nuevo

### ❌ **Comportamiento Anterior**
- Si el usuario tenía una rutina activa, se lanzaba un error
- Era necesario desasignar manualmente la rutina anterior antes de asignar una nueva
- El usuario podía tener múltiples rutinas activas simultáneamente

### ✅ **Comportamiento Nuevo**
- Si el usuario tiene rutinas activas, se desasignan automáticamente
- Solo se mantiene la nueva rutina asignada
- El usuario siempre tiene exactamente una rutina activa
- Se preserva el historial de rutinas anteriores (marcadas como inactivas)

## Ejemplo Práctico

### 1. **Estado Inicial - Usuario con Rutina Activa**

```bash
GET /users/by-email?email=laura%40gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta:**
```json
{
  "id": "user-123",
  "email": "laura@gmail.com",
  "fullName": "Laura García",
  "hasRoutine": true,
  "routine": {
    "routine_id": "routine-456",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-02-01T00:00:00.000Z",
    "isActive": true,
    "routine": {
      "id": "routine-456",
      "name": "Rutina de Principiante",
      "description": "Rutina básica para comenzar"
    }
  }
}
```

### 2. **Asignar Nueva Rutina**

```bash
POST /routines/assign
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "user-123",
  "routineId": "routine-789",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-03-15T00:00:00.000Z",
  "notes": "Nueva rutina intermedia para Laura"
}
```

### 3. **Respuesta del Sistema**

```json
{
  "id": "user-routine-new-123",
  "user_id": "user-123",
  "routine_id": "routine-789",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-03-15T00:00:00.000Z",
  "notes": "Nueva rutina intermedia para Laura",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### 4. **Verificar Estado Actual**

```bash
GET /users/by-email?email=laura%40gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta:**
```json
{
  "id": "user-123",
  "email": "laura@gmail.com",
  "fullName": "Laura García",
  "hasRoutine": true,
  "routine": {
    "routine_id": "routine-789",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-03-15T00:00:00.000Z",
    "isActive": true,
    "routine": {
      "id": "routine-789",
      "name": "Rutina Intermedia",
      "description": "Rutina para usuarios con experiencia"
    }
  }
}
```

### 5. **Verificar Historial de Rutinas**

```bash
GET /routines/user/user-123
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta:**
```json
[
  {
    "id": "user-routine-old-456",
    "user_id": "user-123",
    "routine_id": "routine-456",
    "startDate": "2024-01-01T00:00:00.000Z",
    "endDate": "2024-01-15T10:00:00.000Z",
    "notes": null,
    "isActive": false,
    "createdAt": "2024-01-01T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "routine": {
      "id": "routine-456",
      "name": "Rutina de Principiante",
      "description": "Rutina básica para comenzar"
    }
  },
  {
    "id": "user-routine-new-123",
    "user_id": "user-123",
    "routine_id": "routine-789",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-03-15T00:00:00.000Z",
    "notes": "Nueva rutina intermedia para Laura",
    "isActive": true,
    "createdAt": "2024-01-15T10:00:00.000Z",
    "updatedAt": "2024-01-15T10:00:00.000Z",
    "routine": {
      "id": "routine-789",
      "name": "Rutina Intermedia",
      "description": "Rutina para usuarios con experiencia"
    }
  }
]
```

## Casos de Uso

### **Caso 1: Usuario sin Rutinas Previas**
```bash
# Usuario nuevo sin rutinas
POST /routines/assign
{
  "userId": "user-new",
  "routineId": "routine-123"
}
# Resultado: Se asigna la rutina normalmente
```

### **Caso 2: Usuario con Una Rutina Activa**
```bash
# Usuario con rutina activa
POST /routines/assign
{
  "userId": "user-with-routine",
  "routineId": "routine-456"
}
# Resultado: Se desasigna la rutina anterior y se asigna la nueva
```

### **Caso 3: Usuario con Múltiples Rutinas Activas**
```bash
# Usuario con múltiples rutinas activas (caso edge)
POST /routines/assign
{
  "userId": "user-multiple-routines",
  "routineId": "routine-789"
}
# Resultado: Se desasignan TODAS las rutinas anteriores y se asigna la nueva
```

### **Caso 4: Misma Rutina Ya Asignada**
```bash
# Usuario ya tiene esta rutina específica activa
POST /routines/assign
{
  "userId": "user-123",
  "routineId": "routine-789"
}
# Resultado: Error - "User already has an active assignment for this routine"
```

## Lógica del Sistema

### **Flujo de Desasignación Automática**

1. **Verificar Usuario y Rutina**: Se valida que ambos existan
2. **Verificar Asignación Específica**: Se comprueba que el usuario no tenga ya esta rutina específica activa
3. **Buscar Rutinas Activas**: Se encuentran todas las rutinas activas del usuario
4. **Desasignar Rutinas Anteriores**: Se marcan como inactivas y se establece fecha de finalización
5. **Crear Nueva Asignación**: Se asigna la nueva rutina como activa
6. **Actualizar Estado del Usuario**: Se mantiene `hasRoutine = true`

### **Ventajas del Nuevo Comportamiento**

✅ **Simplicidad**: No es necesario desasignar manualmente rutinas anteriores
✅ **Consistencia**: El usuario siempre tiene exactamente una rutina activa
✅ **Historial**: Se preserva el historial completo de rutinas asignadas
✅ **Automatización**: El proceso es completamente automático
✅ **Flexibilidad**: Se puede cambiar fácilmente de rutina sin pasos adicionales

## Código de Ejemplo para Frontend

### **JavaScript/TypeScript**
```javascript
async function assignNewRoutine(userId, routineId, startDate, endDate, notes) {
  try {
    const response = await fetch('/routines/assign', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        routineId: routineId,
        startDate: startDate,
        endDate: endDate,
        notes: notes
      })
    });

    if (response.ok) {
      const result = await response.json();
      showSuccessMessage('¡Nueva rutina asignada exitosamente!');
      
      // Actualizar la UI con la nueva rutina
      updateUserRoutine(result);
      
      // Mostrar notificación sobre rutinas anteriores desasignadas
      showInfoMessage('Las rutinas anteriores han sido desasignadas automáticamente');
    }
  } catch (error) {
    showErrorMessage('Error al asignar rutina');
  }
}
```

### **React Hook**
```javascript
const useRoutineAssignment = () => {
  const assignRoutine = async (assignmentData) => {
    try {
      const response = await fetch('/routines/assign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assignmentData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Actualizar estado local
        setCurrentRoutine(result);
        
        // Mostrar notificación
        toast.success('Rutina asignada exitosamente');
        
        return result;
      }
    } catch (error) {
      toast.error('Error al asignar rutina');
      throw error;
    }
  };

  return { assignRoutine };
};
```

## Notas Importantes

1. **Preservación de Datos**: Las rutinas anteriores no se eliminan, solo se marcan como inactivas
2. **Fecha de Finalización**: Se establece automáticamente la fecha actual como fecha de finalización
3. **Progreso del Usuario**: El progreso en rutinas anteriores se mantiene intacto
4. **Validaciones**: Se mantienen todas las validaciones existentes
5. **Compatibilidad**: El cambio es completamente compatible con el sistema existente

¡El sistema ahora maneja automáticamente la desasignación de rutinas anteriores! 🎉
