# Ejemplos de Uso: Sistema de Seguimiento de Progreso

## Flujo Completo de Uso

### 1. **Obtener Rutina del Usuario**
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
    "startDate": "2024-01-20T00:00:00.000Z",
    "endDate": "2024-03-20T00:00:00.000Z",
    "routine": {
      "id": "routine-456",
      "name": "Rutina de Fuerza para Laura",
      "totalWeeks": 8,
      "weeks": [
        {
          "id": "week-1",
          "weekNumber": 1,
          "days": [
            {
              "id": "day-1",
              "dayNumber": 1,
              "name": "Día 1 - Tren Superior",
              "exercises": [
                {
                  "id": "exercise-1",
                  "name": "Press de Banca",
                  "sets": 3,
                  "repetitions": 10
                },
                {
                  "id": "exercise-2",
                  "name": "Remo con Barra",
                  "sets": 3,
                  "repetitions": 12
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
```

### 2. **Marcar Primer Ejercicio como Completado**
```bash
PATCH /routines/progress/exercise
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "exerciseId": "exercise-1",
  "isCompleted": true,
  "progressData": {
    "setsCompleted": 3,
    "weightUsed": 80,
    "notes": "Muy buen ejercicio, pude mantener el peso"
  }
}
```

**Respuesta:**
```json
{
  "id": "progress-exercise-1",
  "user_id": "user-123",
  "exercise_id": "exercise-1",
  "isCompleted": true,
  "completedAt": "2024-01-20T10:30:00.000Z",
  "progressData": {
    "setsCompleted": 3,
    "weightUsed": 80,
    "notes": "Muy buen ejercicio, pude mantener el peso"
  },
  "createdAt": "2024-01-20T10:30:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z"
}
```

### 3. **Marcar Segundo Ejercicio como Completado**
```bash
PATCH /routines/progress/exercise
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "exerciseId": "exercise-2",
  "isCompleted": true,
  "progressData": {
    "setsCompleted": 3,
    "weightUsed": 60,
    "notes": "Ejercicio desafiante pero lo completé"
  }
}
```

### 4. **Verificar Progreso del Día**
```bash
GET /routines/progress/routine-456
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta:**
```json
{
  "routine": {
    "id": "routine-progress-1",
    "user_id": "user-123",
    "routine_id": "routine-456",
    "isCompleted": false,
    "completedWeeks": 0,
    "completedDays": 1,
    "completedExercises": 2,
    "totalMinutes": null
  },
  "weeks": [],
  "days": [
    {
      "id": "day-progress-1",
      "user_id": "user-123",
      "day_id": "day-1",
      "isCompleted": true,
      "completedAt": "2024-01-20T10:35:00.000Z",
      "durationMinutes": null,
      "notes": null
    }
  ],
  "exercises": [
    {
      "id": "progress-exercise-1",
      "user_id": "user-123",
      "exercise_id": "exercise-1",
      "isCompleted": true,
      "completedAt": "2024-01-20T10:30:00.000Z",
      "progressData": {
        "setsCompleted": 3,
        "weightUsed": 80,
        "notes": "Muy buen ejercicio, pude mantener el peso"
      }
    },
    {
      "id": "progress-exercise-2",
      "user_id": "user-123",
      "exercise_id": "exercise-2",
      "isCompleted": true,
      "completedAt": "2024-01-20T10:35:00.000Z",
      "progressData": {
        "setsCompleted": 3,
        "weightUsed": 60,
        "notes": "Ejercicio desafiante pero lo completé"
      }
    }
  ]
}
```

**¡Nota importante!** Como todos los ejercicios del día fueron completados, el día se marcó automáticamente como completado.

### 5. **Marcar Día con Información Adicional**
```bash
PATCH /routines/progress/day
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "dayId": "day-1",
  "isCompleted": true,
  "notes": "Excelente entrenamiento, me sentí muy fuerte hoy",
  "durationMinutes": 45
}
```

### 6. **Completar Toda la Semana**
Supongamos que Laura completa todos los días de la primera semana. El sistema automáticamente marcará la semana como completada.

### 7. **Marcar Semana con Notas**
```bash
PATCH /routines/progress/week
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "weekId": "week-1",
  "isCompleted": true,
  "notes": "Primera semana completada exitosamente. Me siento más fuerte y motivada",
  "totalMinutes": 180
}
```

### 8. **Verificar Progreso de la Semana**
```bash
GET /routines/progress/routine-456
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta parcial:**
```json
{
  "routine": {
    "completedWeeks": 1,
    "completedDays": 3,
    "completedExercises": 6,
    "totalMinutes": 180
  },
  "weeks": [
    {
      "id": "week-progress-1",
      "week_id": "week-1",
      "isCompleted": true,
      "completedAt": "2024-01-27T18:00:00.000Z",
      "completedDays": 3,
      "totalMinutes": 180,
      "notes": "Primera semana completada exitosamente. Me siento más fuerte y motivada"
    }
  ]
}
```

### 9. **Completar Toda la Rutina**
Después de 8 semanas, cuando Laura complete todos los ejercicios, días y semanas:

```bash
PATCH /routines/progress/routine
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "routineId": "routine-456",
  "isCompleted": true,
  "notes": "¡Rutina completada con éxito! Me siento mucho más fuerte, saludable y motivada. Logré todos mis objetivos de fuerza y resistencia.",
  "totalMinutes": 1440
}
```

### 10. **Progreso Final**
```bash
GET /routines/progress/routine-456
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta:**
```json
{
  "routine": {
    "id": "routine-progress-1",
    "user_id": "user-123",
    "routine_id": "routine-456",
    "isCompleted": true,
    "completedAt": "2024-03-20T19:00:00.000Z",
    "completedWeeks": 8,
    "completedDays": 24,
    "completedExercises": 72,
    "totalMinutes": 1440,
    "notes": "¡Rutina completada con éxito! Me siento mucho más fuerte, saludable y motivada. Logré todos mis objetivos de fuerza y resistencia."
  },
  "weeks": [
    {
      "isCompleted": true,
      "completedDays": 3,
      "totalMinutes": 180
    }
    // ... 7 semanas más
  ],
  "days": [
    {
      "isCompleted": true,
      "durationMinutes": 45,
      "notes": "Excelente entrenamiento"
    }
    // ... 23 días más
  ],
  "exercises": [
    {
      "isCompleted": true,
      "progressData": {
        "setsCompleted": 3,
        "weightUsed": 80
      }
    }
    // ... 71 ejercicios más
  ]
}
```

## Casos de Uso en la Aplicación

### **Dashboard de Progreso**
```javascript
// Obtener progreso del usuario
const progress = await fetch(`/routines/progress/${routineId}`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Calcular porcentajes
const weekProgress = (progress.routine.completedWeeks / progress.routine.totalWeeks) * 100;
const dayProgress = (progress.routine.completedDays / totalDays) * 100;
const exerciseProgress = (progress.routine.completedExercises / totalExercises) * 100;

// Mostrar en la UI
updateProgressBars({
  weeks: weekProgress,
  days: dayProgress,
  exercises: exerciseProgress
});
```

### **Marcar Ejercicio en la App Móvil**
```javascript
async function markExerciseCompleted(exerciseId, progressData) {
  try {
    const response = await fetch('/routines/progress/exercise', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        exerciseId: exerciseId,
        isCompleted: true,
        progressData: {
          setsCompleted: progressData.sets,
          weightUsed: progressData.weight,
          notes: progressData.notes
        }
      })
    });

    if (response.ok) {
      showSuccessMessage('¡Ejercicio completado!');
      updateExerciseUI(exerciseId, true);
    }
  } catch (error) {
    showErrorMessage('Error al marcar ejercicio');
  }
}
```

### **Verificar Completado Automático**
```javascript
async function checkAutoCompletion(routineId) {
  const progress = await getUserProgress(routineId);
  
  // Verificar si el día se completó automáticamente
  const today = progress.days.find(day => isToday(day.completedAt));
  if (today && today.isCompleted) {
    showDayCompletedNotification();
  }
  
  // Verificar si la semana se completó automáticamente
  const thisWeek = progress.weeks.find(week => isThisWeek(week.completedAt));
  if (thisWeek && thisWeek.isCompleted) {
    showWeekCompletedNotification();
  }
  
  // Verificar si la rutina se completó automáticamente
  if (progress.routine.isCompleted) {
    showRoutineCompletedCelebration();
    unlockNextRoutine();
  }
}
```

## Beneficios del Sistema

1. **Motivación**: Los usuarios pueden ver su progreso en tiempo real
2. **Flexibilidad**: Pueden marcar manualmente cualquier nivel
3. **Automatización**: El sistema actualiza automáticamente los niveles superiores
4. **Historial**: Se mantiene un registro completo de todos los entrenamientos
5. **Estadísticas**: Datos detallados para análisis y mejoras
6. **Gamificación**: Sistema de logros y completado para mantener la motivación

¡El sistema está completamente funcional y listo para usar! 🎉
