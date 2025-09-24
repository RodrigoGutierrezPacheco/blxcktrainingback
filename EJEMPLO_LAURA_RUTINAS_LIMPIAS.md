# Ejemplo Práctico: Limpieza de Rutinas de Laura

## Problema Original

Laura tenía **7 rutinas asignadas** (5 inactivas y 2 activas), lo cual es incorrecto ya que un usuario debe tener **solo una rutina activa**.

### **Estado Inicial de Laura:**

```bash
GET /routines/user/email/laura@gmail.com
```

**Respuesta (ANTES del cambio):**
```json
[
  {
    "id": "1b1b8c08-83d5-4b93-b06f-0ca30db7a790",
    "user_id": "06f71800-6342-43f5-82a0-64774657ceed",
    "routine_id": "rutina-1",
    "isActive": false,
    "routine": { "name": "Rutina 1" }
  },
  {
    "id": "910b75b5-d03b-42b1-b5e8-bf05233b580c",
    "user_id": "06f71800-6342-43f5-82a0-64774657ceed", 
    "routine_id": "rutina-2",
    "isActive": false,
    "routine": { "name": "Rutina 2" }
  },
  {
    "id": "5ab33205-499e-47e9-aa80-60581f965292",
    "user_id": "06f71800-6342-43f5-82a0-64774657ceed",
    "routine_id": "rutina-3",
    "isActive": false,
    "routine": { "name": "Rutina 3" }
  },
  {
    "id": "4940b68f-2f09-40a0-bac3-b75ec0042b9d",
    "user_id": "06f71800-6342-43f5-82a0-64774657ceed",
    "routine_id": "rutina-4",
    "isActive": false,
    "routine": { "name": "Rutina 4" }
  },
  {
    "id": "f548f70b-77a6-4937-b981-d9ad42f9c9a8",
    "user_id": "06f71800-6342-43f5-82a0-64774657ceed",
    "routine_id": "c525bb86-6c5b-4b83-a0d9-4238c85ecf74",
    "startDate": "2025-09-23",
    "endDate": "2025-10-23",
    "isActive": true,
    "notes": "Rutina asignada por el entrenador",
    "routine": {
      "id": "c525bb86-6c5b-4b83-a0d9-4238c85ecf74",
      "name": "Laura nueva",
      "description": "Laura nueva"
    }
  },
  {
    "id": "2149498c-14fd-453f-99bd-d0fe747efad7",
    "user_id": "06f71800-6342-43f5-82a0-64774657ceed",
    "routine_id": "rutina-6",
    "isActive": true,
    "routine": { "name": "Rutina 6" }
  },
  {
    "id": "cd87a61f-b120-4b74-a70b-874821e93d12",
    "user_id": "06f71800-6342-43f5-82a0-64774657ceed",
    "routine_id": "rutina-7",
    "isActive": false,
    "routine": { "name": "Rutina 7" }
  }
]
```

**Problema:** Laura tiene 7 rutinas (5 inactivas + 2 activas) ❌

## Solución: Asignar Nueva Rutina (Elimina Todas las Anteriores)

### **Request para Limpiar las Rutinas de Laura:**

```bash
POST /routines/assign
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "06f71800-6342-43f5-82a0-64774657ceed",
  "routineId": "rutina-limpia-123",
  "startDate": "2025-01-15T00:00:00.000Z",
  "endDate": "2025-03-15T00:00:00.000Z",
  "notes": "Rutina limpia para Laura - todas las anteriores eliminadas"
}
```

### **Lo que Sucede Internamente:**

1. **Sistema busca todas las rutinas de Laura:**
   ```sql
   SELECT * FROM user_routine WHERE user_id = '06f71800-6342-43f5-82a0-64774657ceed'
   -- Encuentra: 7 rutinas
   ```

2. **Sistema elimina completamente todas las rutinas:**
   ```sql
   DELETE FROM user_routine WHERE user_id = '06f71800-6342-43f5-82a0-64774657ceed'
   -- Elimina: 7 rutinas completamente
   ```

3. **Sistema asigna nueva rutina:**
   ```sql
   INSERT INTO user_routine (user_id, routine_id, isActive, ...)
   VALUES ('06f71800-6342-43f5-82a0-64774657ceed', 'rutina-limpia-123', true, ...)
   -- Crea: 1 nueva rutina activa
   ```

### **Respuesta del Sistema:**

```json
{
  "id": "nueva-user-routine-123",
  "user_id": "06f71800-6342-43f5-82a0-64774657ceed",
  "routine_id": "rutina-limpia-123",
  "startDate": "2025-01-15T00:00:00.000Z",
  "endDate": "2025-03-15T00:00:00.000Z",
  "notes": "Rutina limpia para Laura - todas las anteriores eliminadas",
  "isActive": true,
  "createdAt": "2025-01-15T10:00:00.000Z",
  "updatedAt": "2025-01-15T10:00:00.000Z"
}
```

## Verificación: Estado Final de Laura

### **Verificar Rutinas de Laura (DESPUÉS):**

```bash
GET /routines/user/email/laura@gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta (DESPUÉS del cambio):**
```json
[
  {
    "id": "nueva-user-routine-123",
    "user_id": "06f71800-6342-43f5-82a0-64774657ceed",
    "routine_id": "rutina-limpia-123",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-03-15T00:00:00.000Z",
    "notes": "Rutina limpia para Laura - todas las anteriores eliminadas",
    "isActive": true,
    "routine": {
      "id": "rutina-limpia-123",
      "name": "Rutina Limpia para Laura",
      "description": "Rutina completamente nueva y limpia"
    }
  }
]
```

**Resultado:** Laura tiene exactamente 1 rutina ✅

## Comparación: Antes vs Después

### **❌ ANTES (Problema):**
```json
// Laura tenía 7 rutinas
[
  { "id": "1b1b8c08-83d5-4b93-b06f-0ca30db7a790", "isActive": false },
  { "id": "910b75b5-d03b-42b1-b5e8-bf05233b580c", "isActive": false },
  { "id": "5ab33205-499e-47e9-aa80-60581f965292", "isActive": false },
  { "id": "4940b68f-2f09-40a0-bac3-b75ec0042b9d", "isActive": false },
  { "id": "f548f70b-77a6-4937-b981-d9ad42f9c9a8", "isActive": true },
  { "id": "2149498c-14fd-453f-99bd-d0fe747efad7", "isActive": true },
  { "id": "cd87a61f-b120-4b74-a70b-874821e93d12", "isActive": false }
]
// Total: 7 rutinas (5 inactivas + 2 activas)
```

### **✅ DESPUÉS (Solucionado):**
```json
// Laura tiene 1 rutina
[
  {
    "id": "nueva-user-routine-123",
    "isActive": true,
    "routine": { "name": "Rutina Limpia para Laura" }
  }
]
// Total: 1 rutina (1 activa)
```

## Beneficios Obtenidos

### **✅ Limpieza Completa:**
- **Antes**: 7 rutinas acumuladas
- **Después**: 1 rutina limpia
- **Beneficio**: Base de datos más eficiente

### **✅ Rutinas Liberadas:**
- Las 7 rutinas eliminadas están disponibles para otros usuarios
- Mejor gestión de recursos
- Reutilización de rutinas existentes

### **✅ Consistencia del Sistema:**
- Laura tiene exactamente una rutina activa
- No hay confusión con múltiples rutinas
- Estado predecible y correcto

### **✅ Simplicidad:**
- No hay rutinas históricas que mantener
- Lógica más simple
- Menos complejidad en el código

## Código de Ejemplo para Limpiar Rutinas

### **JavaScript/TypeScript**
```javascript
async function cleanUserRoutines(userId, newRoutineId) {
  try {
    console.log(`🧹 Limpiando rutinas del usuario: ${userId}`);
    
    const response = await fetch('/routines/assign', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        routineId: newRoutineId,
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 días
        notes: 'Rutina limpia - todas las anteriores eliminadas'
      })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Rutinas limpiadas exitosamente');
      console.log('🗑️ Todas las rutinas anteriores fueron eliminadas');
      console.log('🔄 Rutinas disponibles para reasignación');
      
      return result;
    }
  } catch (error) {
    console.error('❌ Error al limpiar rutinas:', error);
    throw error;
  }
}

// Uso específico para Laura
cleanUserRoutines(
  '06f71800-6342-43f5-82a0-64774657ceed',
  'rutina-limpia-123'
);
```

### **React Hook para Limpieza**
```javascript
const useRoutineCleanup = () => {
  const [cleaning, setCleaning] = useState(false);
  const [error, setError] = useState(null);

  const cleanUserRoutines = async (userId, routineId) => {
    setCleaning(true);
    setError(null);

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
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Limpieza automática de rutinas'
        })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('✅ Rutinas limpiadas exitosamente');
        return result;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
      toast.error(`❌ Error: ${err.message}`);
      throw err;
    } finally {
      setCleaning(false);
    }
  };

  return {
    cleanUserRoutines,
    cleaning,
    error
  };
};

// Uso en componente
const CleanupButton = ({ userId, routineId }) => {
  const { cleanUserRoutines, cleaning } = useRoutineCleanup();

  return (
    <button 
      onClick={() => cleanUserRoutines(userId, routineId)}
      disabled={cleaning}
      style={{
        backgroundColor: '#ff6b6b',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px'
      }}
    >
      {cleaning ? '🧹 Limpiando...' : '🧹 Limpiar Rutinas de Usuario'}
    </button>
  );
};
```

## Casos de Uso Comunes

### **1. Limpieza de Usuario con Múltiples Rutinas**
```javascript
// Usuario como Laura con muchas rutinas acumuladas
await cleanUserRoutines('06f71800-6342-43f5-82a0-64774657ceed', 'rutina-limpia');
```

### **2. Reasignación de Rutina a Usuario Existente**
```javascript
// Usuario que ya tiene rutina, asignar nueva
await assignNewRoutine('user-123', 'nueva-rutina');
// Automáticamente elimina la rutina anterior
```

### **3. Limpieza Administrativa Masiva**
```javascript
const usersWithMultipleRoutines = [
  'user-1', 'user-2', 'user-3'
];

for (const userId of usersWithMultipleRoutines) {
  await cleanUserRoutines(userId, 'rutina-estandar');
}
```

## Resumen del Cambio

🎉 **¡Problema de Laura Solucionado!**

### **Antes:**
- Laura tenía 7 rutinas (5 inactivas + 2 activas)
- Sistema acumulaba rutinas innecesariamente
- Base de datos crecía sin control

### **Después:**
- Laura tiene exactamente 1 rutina (la nueva)
- Sistema elimina completamente todas las rutinas anteriores
- Base de datos se mantiene limpia y eficiente

### **Resultado:**
- ✅ Usuario tiene exactamente una rutina
- ✅ Rutinas anteriores eliminadas completamente
- ✅ Rutinas disponibles para reasignación
- ✅ Sistema más eficiente y limpio

¡El endpoint `POST /routines/assign` ahora funciona correctamente y Laura tendrá solo una rutina! 🚀
