# Módulo de Usuarios

## Endpoints Disponibles

### 1. Registro de Usuario Normal
- **POST** `/users/normal/register`
- **Descripción**: Registra un nuevo usuario normal
- **Body**: `CreateNormalUserDto`

### 2. Obtener Usuario por Email
- **GET** `/users/by-email?email=usuario@example.com`
- **Descripción**: Obtiene toda la información de un usuario por su correo electrónico
- **Autenticación**: Requiere JWT token
- **Permisos**: 
  - Usuarios solo pueden consultar su propia información
  - Administradores pueden consultar cualquier usuario
- **Parámetros**: `email` (query parameter)

### 3. Actualización de Usuario
- **PATCH** `/users/:id`
- **Descripción**: Permite a usuarios y administradores editar información del usuario
- **Autenticación**: Requiere JWT token
- **Permisos**: 
  - Usuarios solo pueden editar su propia información
  - Administradores pueden editar cualquier usuario
- **Body**: `UpdateUserDto`

## Campos Editables

### UpdateUserDto
- `fullName` (opcional): Nombre completo del usuario (2-100 caracteres)
- `dateOfBirth` (opcional): Fecha de nacimiento en formato ISO string (YYYY-MM-DD)
- `healthIssues` (opcional): Descripción de enfermedades, lesiones o molestias (máximo 1000 caracteres)
- `password` (opcional): Nueva contraseña (mínimo 6 caracteres)
- `age` (opcional): Edad del usuario (0-200 años)
- `weight` (opcional): Peso del usuario en kg (0-1000 kg)
- `height` (opcional): Altura del usuario en cm (0-500 cm)

## Ejemplos de Uso

### Obtener Usuario por Email
```bash
GET /users/by-email?email=juan@example.com
```

### Respuesta Exitosa - Usuario por Email
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

### Actualizar Información del Usuario
```bash
PATCH /users/123e4567-e89b-12d3-a456-426614174000
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "fullName": "Juan Pérez",
  "dateOfBirth": "1990-05-15",
  "healthIssues": "Tengo una lesión en la rodilla derecha por un accidente deportivo",
  "password": "nuevaContraseña123",
  "age": 34,
  "weight": 75.5,
  "height": 175
}
```

### Respuesta Exitosa - Actualización
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

## Notas Importantes

1. **Seguridad**: Solo se puede editar la información propia o ser administrador
2. **Contraseña**: Si se proporciona una nueva contraseña, se hasheará automáticamente
3. **Fecha de Nacimiento**: Se debe enviar en formato ISO string (YYYY-MM-DD)
4. **Campos Opcionales**: Solo se actualizan los campos que se envían en el body
5. **Validación**: Todos los campos pasan por validación automática con mensajes en español
6. **Edad**: Debe estar entre 0 y 200 años
7. **Peso**: Debe estar entre 0 y 1000 kg
8. **Altura**: Debe estar entre 0 y 500 cm
9. **Endpoint Protegido**: El endpoint de consulta por email requiere autenticación JWT
10. **Sin Contraseña**: La contraseña nunca se incluye en las respuestas por seguridad
11. **Autorización**: Solo puedes consultar tu propia información o ser administrador
