# Ejemplo: Asignación de Rutina con Desasignación Automática

## Descripción

El endpoint `POST /routines/assign` ya está implementado para desasignar automáticamente todas las rutinas anteriores cuando se asigna una nueva rutina a un usuario.

## Comportamiento Actual

✅ **Funcionalidad Implementada:**
- Si el usuario tiene rutinas activas → Se desasignan automáticamente
- Solo se mantiene la nueva rutina asignada
- El usuario siempre tiene exactamente una rutina activa
- Se preserva el historial completo de rutinas anteriores

## Ejemplo Práctico: Laura con Múltiples Rutinas

### **Estado Inicial - Laura con 2 Rutinas Activas**

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
    "routine": {
      "id": "routine-456",
      "name": "Rutina de Principiante"
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
    "routine": {
      "id": "routine-789",
      "name": "Rutina Intermedia"
    }
  }
]
```

### **Asignar Nueva Rutina (Desasigna Automáticamente las Anteriores)**

```bash
POST /routines/assign
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "user-laura-123",
  "routineId": "routine-advanced-999",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-03-15T00:00:00.000Z",
  "notes": "Nueva rutina avanzada para Laura"
}
```

**Respuesta:**
```json
{
  "id": "user-routine-new-123",
  "user_id": "user-laura-123",
  "routine_id": "routine-advanced-999",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-03-15T00:00:00.000Z",
  "notes": "Nueva rutina avanzada para Laura",
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### **Verificar Estado Después de la Asignación**

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
    "endDate": "2024-01-15T10:00:00.000Z",
    "notes": "Rutina de principiante",
    "isActive": false,
    "routine": {
      "id": "routine-456",
      "name": "Rutina de Principiante"
    }
  },
  {
    "id": "user-routine-2",
    "user_id": "user-laura-123",
    "routine_id": "routine-789",
    "startDate": "2024-01-10T00:00:00.000Z",
    "endDate": "2024-01-15T10:00:00.000Z",
    "notes": "Rutina intermedia",
    "isActive": false,
    "routine": {
      "id": "routine-789",
      "name": "Rutina Intermedia"
    }
  },
  {
    "id": "user-routine-new-123",
    "user_id": "user-laura-123",
    "routine_id": "routine-advanced-999",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-03-15T00:00:00.000Z",
    "notes": "Nueva rutina avanzada para Laura",
    "isActive": true,
    "routine": {
      "id": "routine-advanced-999",
      "name": "Rutina Avanzada"
    }
  }
]
```

## Lo que Sucedió Automáticamente

### **✅ Rutinas Anteriores Desasignadas:**
- **Rutina 1**: `isActive: true` → `isActive: false`
- **Rutina 2**: `isActive: true` → `isActive: false`
- **Ambas**: `endDate: null` → `endDate: "2024-01-15T10:00:00.000Z"`

### **✅ Nueva Rutina Asignada:**
- **Rutina 3**: `isActive: true` (nueva rutina activa)

### **✅ Historial Preservado:**
- Todas las rutinas anteriores siguen en la base de datos
- Se mantiene el historial completo
- Solo cambia el estado de activación

## Código del Sistema (Ya Implementado)

```typescript
// En routines.service.ts - método assignRoutineToUser()

// Desasignar TODAS las rutinas activas anteriores del usuario
const activeRoutines = await this.userRoutineRepository.find({
  where: {
    user_id: assignRoutineDto.user_id,
    isActive: true,
  },
});

// Desactivar todas las rutinas anteriores
for (const activeRoutine of activeRoutines) {
  activeRoutine.isActive = false;
  activeRoutine.endDate = new Date(); // Marcar fecha de finalización
  await this.userRoutineRepository.save(activeRoutine);
}

// Crear la nueva asignación
const userRoutine = this.userRoutineRepository.create({
  user_id: assignRoutineDto.user_id,
  routine_id: assignRoutineDto.routine_id,
  startDate: new Date(assignRoutineDto.startDate),
  endDate: assignRoutineDto.endDate ? new Date(assignRoutineDto.endDate) : null,
  notes: assignRoutineDto.notes,
  isActive: true,
});
```

## Casos de Uso

### **Caso 1: Usuario sin Rutinas Previas**
```bash
POST /routines/assign
{
  "userId": "user-new",
  "routineId": "routine-123"
}
# Resultado: Se asigna la rutina normalmente (no hay rutinas anteriores que desasignar)
```

### **Caso 2: Usuario con Una Rutina Activa**
```bash
POST /routines/assign
{
  "userId": "user-with-one-routine",
  "routineId": "routine-456"
}
# Resultado: Se desasigna la rutina anterior automáticamente y se asigna la nueva
```

### **Caso 3: Usuario con Múltiples Rutinas Activas**
```bash
POST /routines/assign
{
  "userId": "user-with-multiple-routines",
  "routineId": "routine-789"
}
# Resultado: Se desasignan TODAS las rutinas anteriores automáticamente y se asigna la nueva
```

### **Caso 4: Misma Rutina Ya Asignada**
```bash
POST /routines/assign
{
  "userId": "user-123",
  "routineId": "routine-789"
}
# Resultado: Error - "User already has an active assignment for this routine"
```

## Ventajas del Sistema Actual

### **✅ Automático**
- No requiere pasos manuales adicionales
- El sistema maneja todo automáticamente

### **✅ Consistente**
- El usuario siempre tiene exactamente una rutina activa
- No puede tener múltiples rutinas activas simultáneamente

### **✅ Histórico**
- Se preserva el historial completo de rutinas
- Las rutinas anteriores no se eliminan, solo se desactivan

### **✅ Flexible**
- Permite cambios rápidos de rutina
- Funciona con cualquier número de rutinas anteriores

### **✅ Seguro**
- Mantiene todas las validaciones existentes
- No rompe funcionalidad existente

## Ejemplo de Uso en Aplicación

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
      console.log('✅ Nueva rutina asignada exitosamente');
      console.log('📊 Todas las rutinas anteriores fueron desasignadas automáticamente');
      
      // Actualizar la UI con la nueva rutina
      updateUserRoutine(result);
    }
  } catch (error) {
    console.error('❌ Error al asignar rutina:', error);
  }
}

// Uso
assignNewRoutine(
  'user-laura-123',
  'routine-advanced-999',
  '2024-01-15T00:00:00.000Z',
  '2024-03-15T00:00:00.000Z',
  'Nueva rutina avanzada para Laura'
);
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
        toast.success('¡Rutina asignada exitosamente! Las rutinas anteriores fueron desasignadas automáticamente');
        
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

## Resumen

🎉 **¡El endpoint ya está funcionando perfectamente!**

El endpoint `POST /routines/assign` ya implementa exactamente lo que solicitas:

1. ✅ **Desasigna automáticamente** todas las rutinas anteriores del usuario
2. ✅ **Asigna la nueva rutina** como activa
3. ✅ **Preserva el historial** completo de rutinas
4. ✅ **Mantiene la consistencia** del sistema
5. ✅ **Es completamente automático** - no requiere pasos adicionales

### **Para usar el endpoint:**

```bash
POST /routines/assign
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "user-laura-123",
  "routineId": "routine-advanced-999",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-03-15T00:00:00.000Z",
  "notes": "Nueva rutina avanzada"
}
```

¡El sistema ya está listo y funcionando como lo necesitas! 🚀
