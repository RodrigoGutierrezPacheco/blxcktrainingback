# Módulo de Rutinas de Entrenamiento

Este módulo proporciona una API completa para gestionar rutinas de entrenamiento con una estructura jerárquica: Rutinas → Semanas → Días → Ejercicios.

## Estructura de Datos

### Rutina (Routine)
- **id**: UUID único
- **name**: Nombre de la rutina
- **description**: Descripción general
- **comments**: Comentarios del trainer
- **totalWeeks**: Número total de semanas
- **isActive**: Estado activo/inactivo
- **trainer_id**: ID del trainer que creó la rutina

### Semana (Week)
- **id**: UUID único
- **weekNumber**: Número de semana (1, 2, 3...)
- **name**: Nombre opcional de la semana
- **comments**: Comentarios específicos de la semana
- **routine_id**: ID de la rutina padre

### Día (Day)
- **id**: UUID único
- **dayNumber**: Número del día (1, 2, 3...)
- **name**: Nombre opcional del día
- **comments**: Comentarios específicos del día
- **week_id**: ID de la semana padre

### Ejercicio (Exercise)
- **id**: UUID único
- **name**: Nombre del ejercicio
- **sets**: Número de series
- **repetitions**: Número de repeticiones
- **restBetweenSets**: Descanso entre series (en segundos)
- **restBetweenExercises**: Descanso entre ejercicios (en segundos)
- **comments**: Comentarios del ejercicio
- **order**: Orden del ejercicio en el día
- **day_id**: ID del día padre

### Asignación de Usuario (UserRoutine)
- **id**: UUID único
- **user_id**: ID del usuario
- **routine_id**: ID de la rutina
- **startDate**: Fecha de inicio
- **endDate**: Fecha de fin (opcional)
- **isActive**: Estado activo/inactivo
- **notes**: Notas adicionales

## Endpoints de la API

### Gestión de Rutinas

#### Crear Rutina
```http
POST /routines
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Rutina de Fuerza",
  "description": "Rutina para aumentar la fuerza muscular",
  "comments": "Rutina intensa para usuarios avanzados",
  "totalWeeks": 4,
  "trainer_id": "uuid-del-trainer",
  "weeks": [
    {
      "weekNumber": 1,
      "name": "Semana de Adaptación",
      "comments": "Semana suave para adaptarse",
      "days": [
        {
          "dayNumber": 1,
          "name": "Día de Pecho y Tríceps",
          "comments": "Enfoque en ejercicios básicos",
          "exercises": [
            {
              "name": "Press de Banca",
              "sets": 3,
              "repetitions": 10,
              "restBetweenSets": 120,
              "restBetweenExercises": 180,
              "comments": "Mantener buena forma",
              "order": 1
            },
            {
              "name": "Fondos en Paralelas",
              "sets": 3,
              "repetitions": 12,
              "restBetweenSets": 90,
              "restBetweenExercises": 180,
              "comments": "Controlar el descenso",
              "order": 2
            }
          ]
        }
      ]
    }
  ]
}
```

#### Obtener Todas las Rutinas
```http
GET /routines
Authorization: Bearer <token>
```

#### Obtener Rutina por ID
```http
GET /routines/{id}
Authorization: Bearer <token>
```

#### Obtener Rutinas por Trainer
```http
GET /routines/trainer/{trainerId}
Authorization: Bearer <token>
```

#### Actualizar Rutina
```http
PATCH /routines/{id}
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "Rutina de Fuerza Actualizada",
  "description": "Descripción actualizada"
}
```

#### Eliminar Rutina
```http
DELETE /routines/{id}
Authorization: Bearer <token>
```

### Asignación de Rutinas a Usuarios

#### Asignar Rutina a Usuario
```http
POST /routines/assign
Content-Type: application/json
Authorization: Bearer <token>

{
  "user_id": "uuid-del-usuario",
  "routine_id": "uuid-de-la-rutina",
  "startDate": "2024-01-15",
  "endDate": "2024-02-15",
  "notes": "Rutina personalizada para el usuario"
}
```

#### Obtener Rutinas de un Usuario
```http
GET /routines/user/{userId}
Authorization: Bearer <token>
```

#### Desactivar Rutina de Usuario
```http
PATCH /routines/user/{userId}/routine/{routineId}/deactivate
Authorization: Bearer <token>
```

#### Eliminar Asignación de Rutina
```http
DELETE /routines/user/{userId}/routine/{routineId}
Authorization: Bearer <token>
```

## Ejemplos de Uso

### 1. Crear una Rutina Completa
```bash
curl -X POST http://localhost:3000/routines \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Rutina de Hipertrofia",
    "description": "Rutina para ganar masa muscular",
    "totalWeeks": 3,
    "trainer_id": "uuid-del-trainer",
    "weeks": [
      {
        "weekNumber": 1,
        "days": [
          {
            "dayNumber": 1,
            "name": "Push",
            "exercises": [
              {
                "name": "Press Militar",
                "sets": 4,
                "repetitions": 8,
                "restBetweenSets": 120,
                "restBetweenExercises": 180,
                "order": 1
              }
            ]
          }
        ]
      }
    ]
  }'
```

### 2. Asignar Rutina a Usuario
```bash
curl -X POST http://localhost:3000/routines/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "user_id": "uuid-del-usuario",
    "routine_id": "uuid-de-la-rutina",
    "startDate": "2024-01-15"
  }'
```

### 3. Obtener Rutinas de un Usuario
```bash
curl -X GET http://localhost:3000/routines/user/uuid-del-usuario \
  -H "Authorization: Bearer <token>"
```

## Características

- **Validación Completa**: Todos los DTOs incluyen validaciones con class-validator
- **Relaciones Anidadas**: Las entidades mantienen relaciones jerárquicas con cascade
- **Gestión de Estado**: Las rutinas y asignaciones pueden activarse/desactivarse
- **Comentarios Flexibles**: Cada nivel (rutina, semana, día, ejercicio) puede tener comentarios
- **Ordenamiento**: Los ejercicios mantienen un orden específico dentro de cada día
- **Fechas de Asignación**: Control de fechas de inicio y fin para las asignaciones
- **Seguridad**: Todos los endpoints están protegidos con JWT (excepto los marcados como @Public)

## Notas de Implementación

- Las entidades utilizan UUIDs como identificadores primarios
- Se implementa soft delete implícito a través del campo `isActive`
- Las relaciones utilizan cascade para mantener la integridad referencial
- El servicio incluye validaciones de existencia antes de crear relaciones
- Los endpoints de asignación verifican duplicados activos
