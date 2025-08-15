# Configuración del Proyecto

## Variables de Entorno

Para que el proyecto funcione correctamente, necesitas configurar las siguientes variables de entorno:

### 1. Crear archivo .env

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```bash
# JWT Configuration
JWT_SECRET=blxcktraining-super-secret-jwt-key-2024-change-in-production

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña_aqui
DB_NAME=blxcktraining_db
DB_SYNCHRONIZE=true
DB_LOGGING=false

# Server Configuration
PORT=8000
ALLOWED_ORIGINS=http://localhost:5173,https://tudominio.com
```

### 2. Configuración de Base de Datos

Asegúrate de tener PostgreSQL instalado y configurado con:
- Usuario: `postgres` (o el que configures)
- Contraseña: La que configures en `DB_PASSWORD`
- Base de datos: `blxcktraining_db` (se creará automáticamente si `DB_SYNCHRONIZE=true`)

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar el Proyecto

```bash
# Desarrollo
npm run start:dev

# Producción
npm run start:prod
```

## Solución de Problemas

### Error: "Cannot read properties of undefined (reading 'role')"

Este error ocurre cuando el JWT guard no está configurado correctamente. La solución incluye:

1. **Verificar que el archivo .env existe** y tiene `JWT_SECRET` configurado
2. **Asegurar que la base de datos esté funcionando**
3. **Verificar que el token JWT sea válido**

### Verificar Token JWT

Para probar el endpoint de actualización:

1. **Obtener un token JWT** usando el endpoint de login
2. **Usar el token** en el header Authorization: `Bearer <token>`
3. **Verificar que el token contenga** `sub`, `email`, y `role`

### Ejemplo de Token JWT

Un token JWT válido debe contener:
```json
{
  "sub": "user-id-here",
  "email": "user@example.com",
  "role": "user"
}
```

## Endpoints Disponibles

- **POST** `/auth/login-user` - Login de usuario normal
- **POST** `/auth/login-admin` - Login de administrador
- **PATCH** `/users/:id` - Actualizar información de usuario (requiere JWT)

## Campos Editables del Usuario

El endpoint de actualización permite editar los siguientes campos:

### Información Personal
- `fullName` - Nombre completo (2-100 caracteres)
- `dateOfBirth` - Fecha de nacimiento (formato YYYY-MM-DD)
- `age` - Edad (0-200 años)
- `weight` - Peso en kg (0-1000 kg)
- `height` - Altura en cm (0-500 cm)

### Seguridad y Salud
- `password` - Nueva contraseña (mínimo 6 caracteres)
- `healthIssues` - Problemas de salud (máximo 1000 caracteres)

## Ejemplos de Uso

### Actualización Básica
```json
{
  "fullName": "María González",
  "age": 28
}
```

### Actualización de Medidas
```json
{
  "weight": 65.5,
  "height": 162
}
```

### Actualización Completa
```json
{
  "fullName": "Carlos Rodríguez",
  "dateOfBirth": "1992-08-21",
  "age": 32,
  "weight": 78.0,
  "height": 180,
  "healthIssues": "Tengo asma leve controlada",
  "password": "nuevaContraseña2024"
}
```

## Notas de Seguridad

- **Cambia JWT_SECRET** en producción
- **No subas el archivo .env** al repositorio
- **Usa contraseñas fuertes** para la base de datos
- **Configura CORS** apropiadamente para tu dominio
