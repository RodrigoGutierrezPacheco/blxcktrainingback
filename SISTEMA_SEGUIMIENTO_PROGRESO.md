# Sistema de Seguimiento de Progreso de Rutinas

## Descripción General

El sistema de seguimiento de progreso permite a los usuarios marcar el estado de completado de sus ejercicios, días, semanas y rutinas completas. Solo el usuario propietario puede marcar su propio progreso.

## Características Principales

### ✅ **Seguimiento Granular**
- **Ejercicios**: Marcar ejercicios individuales como completados
- **Días**: Marcar días de entrenamiento como completados
- **Semanas**: Marcar semanas completas como completadas
- **Rutinas**: Marcar rutinas completas como completadas

### ✅ **Progreso Automático**
- Al completar todos los ejercicios de un día, se marca automáticamente como completado
- Al completar todos los días de una semana, se marca automáticamente como completada
- Al completar todas las semanas de una rutina, se marca automáticamente como completada

### ✅ **Datos Adicionales**
- **Ejercicios**: Información de progreso (series, peso, notas)
- **Días**: Duración del entrenamiento y notas
- **Semanas**: Total de minutos entrenados y notas
- **Rutinas**: Estadísticas completas y notas finales

### ✅ **Seguridad**
- Solo el usuario puede marcar su propio progreso
- Validación de que el usuario tiene la rutina asignada
- Autenticación JWT requerida

## Endpoints Disponibles

### 1. Marcar Ejercicio como Completado
```http
PATCH /routines/progress/exercise
```

**Body:**
```json
{
  "exerciseId": "uuid-del-ejercicio",
  "isCompleted": true,
  "progressData": {
    "setsCompleted": 3,
    "weightUsed": 80,
    "notes": "Muy buen ejercicio"
  }
}
```

### 2. Marcar Día como Completado
```http
PATCH /routines/progress/day
```

**Body:**
```json
{
  "dayId": "uuid-del-dia",
  "isCompleted": true,
  "notes": "Excelente entrenamiento",
  "durationMinutes": 45
}
```

### 3. Marcar Semana como Completada
```http
PATCH /routines/progress/week
```

**Body:**
```json
{
  "weekId": "uuid-de-la-semana",
  "isCompleted": true,
  "notes": "Semana muy productiva",
  "totalMinutes": 180
}
```

### 4. Marcar Rutina como Completada
```http
PATCH /routines/progress/routine
```

**Body:**
```json
{
  "routineId": "uuid-de-la-rutina",
  "isCompleted": true,
  "notes": "¡Rutina completada con éxito!",
  "totalMinutes": 720
}
```

### 5. Obtener Progreso del Usuario
```http
GET /routines/progress/{routineId}
```

**Respuesta:**
```json
{
  "routine": {
    "id": "uuid-de-progreso",
    "user_id": "uuid-del-usuario",
    "routine_id": "uuid-de-la-rutina",
    "isCompleted": false,
    "completedWeeks": 2,
    "completedDays": 6,
    "completedExercises": 18,
    "totalMinutes": 360
  },
  "weeks": [
    {
      "id": "uuid-de-progreso-semana",
      "week_id": "uuid-de-la-semana",
      "isCompleted": true,
      "completedDays": 3,
      "totalMinutes": 180
    }
  ],
  "days": [
    {
      "id": "uuid-de-progreso-dia",
      "day_id": "uuid-del-dia",
      "isCompleted": true,
      "durationMinutes": 45,
      "notes": "Excelente entrenamiento"
    }
  ],
  "exercises": [
    {
      "id": "uuid-de-progreso-ejercicio",
      "exercise_id": "uuid-del-ejercicio",
      "isCompleted": true,
      "progressData": {
        "setsCompleted": 3,
        "weightUsed": 80
      },
      "completedAt": "2024-01-15T16:00:00.000Z"
    }
  ]
}
```

## Estructura de Base de Datos

### Tablas Creadas

1. **`user_exercise_progress`**
   - Seguimiento de ejercicios individuales
   - Datos de progreso personalizados
   - Timestamp de completado

2. **`user_day_progress`**
   - Seguimiento de días de entrenamiento
   - Duración y notas del día
   - Timestamp de completado

3. **`user_week_progress`**
   - Seguimiento de semanas completas
   - Contador de días completados
   - Total de minutos de la semana

4. **`user_routine_progress`**
   - Seguimiento de rutinas completas
   - Estadísticas agregadas
   - Contadores de progreso

### Índices y Restricciones

- **Índices únicos** en combinaciones `(user_id, exercise_id)`, `(user_id, day_id)`, etc.
- **Claves foráneas** con `CASCADE DELETE`
- **Índices** para optimizar consultas por usuario

## Lógica de Progreso Automático

### Flujo de Actualización

1. **Usuario marca ejercicio como completado**
   → Se actualiza `user_exercise_progress`
   → Se verifica si todos los ejercicios del día están completados
   → Si es así, se marca el día como completado automáticamente

2. **Día marcado como completado**
   → Se actualiza `user_day_progress`
   → Se verifica si todos los días de la semana están completados
   → Si es así, se marca la semana como completada automáticamente

3. **Semana marcada como completada**
   → Se actualiza `user_week_progress`
   → Se verifica si todas las semanas de la rutina están completadas
   → Si es así, se marca la rutina como completada automáticamente

### Contadores Automáticos

- **Días completados en semana**: Se actualiza automáticamente
- **Semanas completadas en rutina**: Se actualiza automáticamente
- **Ejercicios completados en rutina**: Se actualiza automáticamente
- **Minutos totales**: Se suman automáticamente

## Casos de Uso

### 1. **Aplicación Móvil de Entrenamiento**
```javascript
// Marcar ejercicio completado
await fetch('/routines/progress/exercise', {
  method: 'PATCH',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({
    exerciseId: 'exercise-123',
    isCompleted: true,
    progressData: {
      setsCompleted: 3,
      weightUsed: 80,
      notes: 'Pude aumentar el peso'
    }
  })
});
```

### 2. **Dashboard de Progreso**
```javascript
// Obtener progreso completo
const progress = await fetch(`/routines/progress/${routineId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Mostrar estadísticas
console.log(`Semanas completadas: ${progress.routine.completedWeeks}/${totalWeeks}`);
console.log(`Días completados: ${progress.routine.completedDays}`);
console.log(`Ejercicios completados: ${progress.routine.completedExercises}`);
```

### 3. **Seguimiento de Objetivos**
```javascript
// Verificar si la rutina está completada
if (progress.routine.isCompleted) {
  showCongratulations();
  unlockNextRoutine();
}
```

## Validaciones y Seguridad

### ✅ **Validaciones de Entrada**
- UUIDs válidos para todos los IDs
- Valores booleanos para estados de completado
- Números positivos para duraciones y contadores
- Texto válido para notas

### ✅ **Validaciones de Negocio**
- Usuario debe tener la rutina asignada
- Solo el usuario propietario puede marcar progreso
- Ejercicio/día/semana debe pertenecer a la rutina del usuario

### ✅ **Autenticación**
- Token JWT requerido en todos los endpoints
- Verificación de permisos por usuario
- Protección contra acceso no autorizado

## Ejemplos de Respuestas

### Ejercicio Completado
```json
{
  "id": "progress-123",
  "user_id": "user-456",
  "exercise_id": "exercise-789",
  "isCompleted": true,
  "completedAt": "2024-01-15T16:00:00.000Z",
  "progressData": {
    "setsCompleted": 3,
    "weightUsed": 80,
    "notes": "Muy buen ejercicio"
  },
  "createdAt": "2024-01-15T16:00:00.000Z",
  "updatedAt": "2024-01-15T16:00:00.000Z"
}
```

### Día Completado
```json
{
  "id": "day-progress-123",
  "user_id": "user-456",
  "day_id": "day-789",
  "isCompleted": true,
  "completedAt": "2024-01-15T16:00:00.000Z",
  "notes": "Excelente entrenamiento",
  "durationMinutes": 45,
  "createdAt": "2024-01-15T16:00:00.000Z",
  "updatedAt": "2024-01-15T16:00:00.000Z"
}
```

## Migración de Base de Datos

Para aplicar las nuevas tablas, ejecutar:

```bash
npm run migration:run
```

La migración creará:
- 4 nuevas tablas de progreso
- Índices para optimización
- Claves foráneas con CASCADE DELETE
- Restricciones de unicidad

## Notas Importantes

1. **Progreso Automático**: El sistema actualiza automáticamente los niveles superiores cuando se completan todos los elementos del nivel inferior.

2. **Flexibilidad**: Los usuarios pueden marcar manualmente cualquier nivel (ejercicio, día, semana, rutina) independientemente del progreso automático.

3. **Datos Históricos**: Se mantiene un historial completo de cuándo se completó cada elemento.

4. **Rendimiento**: Los índices están optimizados para consultas frecuentes por usuario y rutina.

5. **Escalabilidad**: El sistema puede manejar múltiples rutinas por usuario y múltiples usuarios simultáneamente.

¡El sistema está listo para usar! 🎉
