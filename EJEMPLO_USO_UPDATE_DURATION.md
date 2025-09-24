# Ejemplo de Uso: Endpoint para Cambiar Duración de Rutina

## Descripción
Este endpoint permite cambiar la duración de una rutina asignada a un usuario específico, modificando las fechas de inicio y fin sin cambiar la rutina en sí.

## Endpoint
```
PATCH /routines/user/update-duration
```

## Autenticación
- Requiere token JWT válido
- Solo usuarios autenticados pueden usar este endpoint

## Parámetros del Body

```json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "startDate": "2024-01-20",
  "endDate": "2024-03-20",
  "notes": "Rutina extendida por 2 semanas debido al buen progreso del usuario"
}
```

### Campos Requeridos:
- `userId` (string, UUID): ID del usuario al que se le cambiará la duración de la rutina
- `startDate` (string, formato fecha): Nueva fecha de inicio de la rutina (YYYY-MM-DD)

### Campos Opcionales:
- `endDate` (string, formato fecha): Nueva fecha de fin de la rutina (YYYY-MM-DD)
- `notes` (string): Notas adicionales sobre el cambio de duración

## Ejemplos de Uso

### 1. Cambio Completo de Duración
```bash
curl -X PATCH "http://localhost:3000/routines/user/update-duration" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "startDate": "2024-01-20",
    "endDate": "2024-03-20",
    "notes": "Rutina extendida por 2 semanas debido al buen progreso del usuario"
  }'
```

### 2. Solo Cambio de Fecha de Fin
```bash
curl -X PATCH "http://localhost:3000/routines/user/update-duration" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "startDate": "2024-01-15",
    "endDate": "2024-02-28",
    "notes": "Rutina acortada por cambio en objetivos"
  }'
```

### 3. Extensión de Rutina (sin fecha de fin específica)
```bash
curl -X PATCH "http://localhost:3000/routines/user/update-duration" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "123e4567-e89b-12d3-a456-426614174000",
    "startDate": "2024-02-01",
    "notes": "Rutina reiniciada desde nueva fecha"
  }'
```

## Respuesta Exitosa (200 OK)

```json
{
  "message": "Duración de rutina actualizada exitosamente",
  "userRoutine": {
    "id": "uuid-de-user-routine",
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "routine_id": "uuid-de-rutina",
    "startDate": "2024-01-20T00:00:00.000Z",
    "endDate": "2024-03-20T00:00:00.000Z",
    "notes": "Rutina extendida por 2 semanas debido al buen progreso del usuario",
    "isActive": true,
    "updatedAt": "2024-01-15T16:00:00.000Z"
  },
  "routine": {
    "id": "uuid-de-rutina",
    "name": "Rutina de Fuerza",
    "description": "Rutina para desarrollar fuerza muscular",
    "totalWeeks": 4
  }
}
```

## Respuestas de Error

### 400 Bad Request - Datos Inválidos
```json
{
  "statusCode": 400,
  "message": [
    "userId debe ser un UUID válido",
    "La fecha de inicio debe ser una fecha válida en formato ISO (YYYY-MM-DD)"
  ],
  "error": "Bad Request"
}
```

### 404 Not Found - Usuario No Encontrado
```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado o no tiene rutina activa",
  "error": "Not Found"
}
```

### 401 Unauthorized - Token Inválido
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Validaciones

1. **Usuario debe existir**: El userId debe corresponder a un usuario válido en el sistema
2. **Usuario debe tener rutina activa**: El usuario debe tener al menos una rutina asignada y activa
3. **Fechas válidas**: Las fechas deben estar en formato ISO (YYYY-MM-DD)
4. **Lógica de fechas**: La fecha de fin debe ser posterior a la fecha de inicio
5. **Autenticación**: Se requiere un token JWT válido

## Casos de Uso Comunes

1. **Extensión de rutina**: Cuando un usuario necesita más tiempo para completar su rutina
2. **Acortamiento de rutina**: Cuando se necesita acelerar el proceso por cambio de objetivos
3. **Reinicio de rutina**: Cuando se quiere empezar la rutina desde una nueva fecha
4. **Ajuste de fechas**: Cuando hay cambios en la disponibilidad del usuario

## Notas Importantes

- Este endpoint solo modifica las fechas de la rutina asignada, no cambia la rutina en sí
- La rutina debe estar activa (isActive: true) para poder ser modificada
- Las notas son opcionales pero recomendadas para mantener un historial de cambios
- La fecha de fin es opcional; si no se proporciona, la rutina no tendrá fecha de fin específica
