# Ejemplos de Uso del Endpoint de Actualización

## Endpoints Disponibles

### 1. **Obtener Usuario por Email**
**GET** `/users/by-email?email=usuario@example.com`

### 2. **Actualizar Usuario**
**PATCH** `/users/:id`

## Autenticación
```
Authorization: Bearer <tu_token_jwt> (requerido para ambos endpoints)
Content-Type: application/json
```

## Ejemplos de Consulta por Email

### **Consulta Básica**
```bash
GET /users/by-email?email=juan@example.com
```

### **Respuesta Exitosa**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "fullName": "Juan Pérez",
  "email": "juan@example.com",
  "role": "user",
  "age": 34,
  "weight": 75.5,
  "height": 175,
  "chronicDiseases": null,
  "dateOfBirth": "1990-05-15T00:00:00.000Z",
  "healthIssues": "Tengo una lesión en la rodilla derecha por un accidente deportivo",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

### **Error - Usuario No Encontrado**
```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado"
}
```

### **Error - Email Inválido**
```json
{
  "message": "Error de validación",
  "errors": [
    "El formato del email no es válido"
  ],
  "statusCode": 400
}
```

### **Error - Sin Permisos para Consultar**
```json
{
  "statusCode": 403,
  "message": "No tienes permisos para consultar la información de este usuario"
}
```

### **Error - No Autenticado**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Ejemplos de Actualización

### 1. **Actualización Básica - Solo Nombre**
```json
{
  "fullName": "María González"
}
```

### 2. **Actualización de Medidas Físicas**
```json
{
  "age": 25,
  "weight": 65.5,
  "height": 162
}
```

### 3. **Actualización de Información Personal**
```json
{
  "fullName": "Carlos Rodríguez",
  "dateOfBirth": "1992-08-21",
  "age": 32
}
```

### 4. **Actualización de Salud**
```json
{
  "healthIssues": "Tengo asma leve controlada con medicamentos"
}
```

### 5. **Cambio de Contraseña**
```json
{
  "password": "nuevaContraseña2024"
}
```

### 6. **Actualización Completa**
```json
{
  "fullName": "Ana Martínez",
  "dateOfBirth": "1988-03-15",
  "age": 36,
  "weight": 58.0,
  "height": 165,
  "healthIssues": "No tengo enfermedades crónicas, pero tengo una lesión menor en el tobillo izquierdo por un esguince",
  "password": "Ana2024Segura!"
}
```

### 7. **Actualización de Solo Altura y Peso**
```json
{
  "weight": 72.0,
  "height": 178
}
```

### 8. **Actualización de Edad y Problemas de Salud**
```json
{
  "age": 28,
  "healthIssues": "Soy alérgico a los frutos secos"
}
```

## Rangos Permitidos

- **Edad**: 0 - 200 años
- **Peso**: 0 - 1000 kg
- **Altura**: 0 - 500 cm
- **Nombre**: 2 - 100 caracteres
- **Contraseña**: Mínimo 6 caracteres
- **Problemas de salud**: Máximo 1000 caracteres

## Respuestas de Error en Español

### Error de Validación
```json
{
  "message": "Error de validación",
  "errors": [
    "La contraseña debe tener al menos 6 caracteres",
    "La edad debe ser un número",
    "El peso debe ser un número",
    "La altura debe ser un número"
  ],
  "statusCode": 400
}
```

### Error de Permisos
```json
{
  "statusCode": 403,
  "message": "No tienes permisos para editar este usuario"
}
```

### Usuario No Encontrado
```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado"
}
```

## Notas Importantes

1. **Campos Opcionales**: Solo se actualizan los campos que envíes en el JSON
2. **Validación Automática**: Todos los campos pasan por validación con mensajes en español
3. **Seguridad**: Solo puedes editar tu propia información o ser administrador
4. **Contraseña**: Se hashea automáticamente si se proporciona
5. **Fecha**: Debe ser en formato ISO (YYYY-MM-DD)
6. **Endpoint Protegido**: Ambos endpoints requieren autenticación JWT
7. **Sin Contraseña**: La contraseña nunca se incluye en las respuestas
8. **Autorización**: Solo puedes consultar tu propia información o ser administrador

## Casos de Uso Comunes

### **Consulta de Perfil**
```bash
GET /users/by-email?email=usuario@example.com
```

### **Perfil Deportivo**
```json
{
  "age": 24,
  "weight": 68.5,
  "height": 175,
  "healthIssues": "Tengo una lesión antigua en la rodilla derecha"
}
```

### **Perfil Médico**
```json
{
  "healthIssues": "Sufro de diabetes tipo 2 controlada, hipertensión leve y alergia al polen"
}
```

### **Actualización de Seguridad**
```json
{
  "password": "ContraseñaSegura2024!"
}
```
