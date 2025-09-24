# Ejemplo: Usuario con Rutina Asignada

## Descripción
El endpoint `GET /users/by-email` ahora incluye automáticamente la información completa de la rutina asignada cuando el usuario tiene `hasRoutine: true`.

## Endpoint
```
GET /users/by-email?email=laura@gmail.com
```

## Autenticación
- Requiere token JWT válido
- Solo el propio usuario o administradores pueden acceder

## Ejemplo de Uso

### Usuario con Rutina Asignada
```bash
curl -X GET "http://localhost:8000/users/by-email?email=laura%40gmail.com" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Respuesta Exitosa

### Usuario SIN Rutina Asignada
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "laura@gmail.com",
  "fullName": "Laura García",
  "role": "user",
  "age": 28,
  "weight": 65,
  "height": 165,
  "chronicDiseases": null,
  "dateOfBirth": "1995-03-15T00:00:00.000Z",
  "healthIssues": null,
  "phone": "+52 55 1234 5678",
  "trainerId": null,
  "hasRoutine": false,
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

### Usuario CON Rutina Asignada
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "laura@gmail.com",
  "fullName": "Laura García",
  "role": "user",
  "age": 28,
  "weight": 65,
  "height": 165,
  "chronicDiseases": null,
  "dateOfBirth": "1995-03-15T00:00:00.000Z",
  "healthIssues": null,
  "phone": "+52 55 1234 5678",
  "trainerId": "9ad642c2-15c1-4359-8139-b1964303014f",
  "hasRoutine": true,
  "isActive": true,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z",
  "routine": {
    "id": "456e7890-e89b-12d3-a456-426614174001",
    "routine_id": "789e0123-e89b-12d3-a456-426614174002",
    "startDate": "2024-01-20T00:00:00.000Z",
    "endDate": "2024-03-20T00:00:00.000Z",
    "notes": "Rutina personalizada para Laura",
    "isActive": true,
    "assignedAt": "2024-01-20T10:00:00.000Z",
    "routine": {
      "id": "789e0123-e89b-12d3-a456-426614174002",
      "name": "Rutina de Fuerza para Laura",
      "description": "Rutina personalizada para desarrollar fuerza muscular",
      "comments": "Realizar 3 veces por semana",
      "totalWeeks": 8,
      "isActive": true,
      "trainer_id": "9ad642c2-15c1-4359-8139-b1964303014f",
      "weeks": [
        {
          "id": "week-001",
          "weekNumber": 1,
          "name": "Semana 1 - Adaptación",
          "comments": "Enfoque en técnica básica",
          "days": [
            {
              "id": "day-001",
              "dayNumber": 1,
              "name": "Día 1 - Tren Superior",
              "comments": "Ejercicios básicos de pecho y espalda",
              "exercises": [
                {
                  "id": "exercise-001",
                  "name": "Press de Banca",
                  "exerciseId": "catalog-exercise-001",
                  "sets": 3,
                  "repetitions": 10,
                  "restBetweenSets": 90,
                  "restBetweenExercises": 120,
                  "comments": "Mantener buena forma",
                  "order": 1
                },
                {
                  "id": "exercise-002",
                  "name": "Remo con Barra",
                  "exerciseId": "catalog-exercise-002",
                  "sets": 3,
                  "repetitions": 12,
                  "restBetweenSets": 90,
                  "restBetweenExercises": 120,
                  "comments": "Contraer omóplatos",
                  "order": 2
                }
              ]
            },
            {
              "id": "day-002",
              "dayNumber": 2,
              "name": "Día 2 - Tren Inferior",
              "comments": "Ejercicios de piernas y glúteos",
              "exercises": [
                {
                  "id": "exercise-003",
                  "name": "Sentadilla",
                  "exerciseId": "catalog-exercise-003",
                  "sets": 4,
                  "repetitions": 8,
                  "restBetweenSets": 120,
                  "restBetweenExercises": 150,
                  "comments": "Bajar hasta paralelo",
                  "order": 1
                }
              ]
            }
          ]
        },
        {
          "id": "week-002",
          "weekNumber": 2,
          "name": "Semana 2 - Progresión",
          "comments": "Aumentar intensidad gradualmente",
          "days": [
            {
              "id": "day-003",
              "dayNumber": 1,
              "name": "Día 1 - Tren Superior Avanzado",
              "comments": "Mayor intensidad y volumen",
              "exercises": [
                {
                  "id": "exercise-004",
                  "name": "Press de Banca",
                  "exerciseId": "catalog-exercise-001",
                  "sets": 4,
                  "repetitions": 8,
                  "restBetweenSets": 120,
                  "restBetweenExercises": 150,
                  "comments": "Aumentar peso",
                  "order": 1
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

## Características de la Respuesta

### Información del Usuario
- Todos los campos básicos del usuario
- Campo `hasRoutine` indica si tiene rutina asignada
- Campo `routine` solo aparece si `hasRoutine` es `true`

### Información de la Rutina (si existe)
- **Datos de asignación**: fechas de inicio y fin, notas, estado
- **Rutina completa**: información detallada de la rutina
- **Estructura completa**: semanas, días y ejercicios
- **Ejercicios del catálogo**: referencias a ejercicios del sistema

## Casos de Uso

1. **Dashboard del usuario**: Mostrar la rutina actual asignada
2. **Aplicación móvil**: Cargar la rutina completa para el entrenamiento
3. **Seguimiento de progreso**: Acceso a la estructura completa de ejercicios
4. **Planificación**: Ver fechas de inicio y fin de la rutina

## Ventajas

- **Una sola consulta**: Obtienes toda la información necesaria
- **Información completa**: Incluye la estructura completa de la rutina
- **Optimizado**: Solo carga la rutina si el usuario la tiene asignada
- **Consistente**: Mantiene la misma estructura que otros endpoints de rutinas

## Notas Importantes

- El campo `routine` es `null` si `hasRoutine` es `false`
- La información incluye la rutina completa con todas sus relaciones
- Las fechas están en formato ISO con zona horaria UTC
- Los ejercicios pueden tener referencias al catálogo (`exerciseId`)
