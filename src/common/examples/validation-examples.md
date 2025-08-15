# Ejemplos de Mensajes de Validación en Español

## Registro de Usuario Normal

### Campos requeridos faltantes:
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Respuesta de error:**
```json
{
  "message": "Error de validación",
  "errors": [
    "El nombre completo es obligatorio",
    "La contraseña debe ser una cadena de texto",
    "La rutina debe ser una cadena de texto"
  ],
  "statusCode": 400
}
```

### Email inválido:
```json
{
  "fullName": "Juan Pérez",
  "email": "email-invalido",
  "password": "12345678",
  "routine": "Principiante"
}
```

**Respuesta de error:**
```json
{
  "message": "Error de validación",
  "errors": [
    "El email debe tener un formato válido"
  ],
  "statusCode": 400
}
```

### Contraseña muy corta:
```json
{
  "fullName": "Juan Pérez",
  "email": "usuario@ejemplo.com",
  "password": "123",
  "routine": "Principiante"
}
```

**Respuesta de error:**
```json
{
  "message": "Error de validación",
  "errors": [
    "La contraseña debe tener al menos 8 caracteres"
  ],
  "statusCode": 400
}
```

## Login de Usuario

### Email faltante:
```json
{
  "password": "123456"
}
```

**Respuesta de error:**
```json
{
  "message": "Error de validación",
  "errors": [
    "El correo electrónico es requerido"
  ],
  "statusCode": 400
}
```

### Contraseña muy corta:
```json
{
  "email": "usuario@ejemplo.com",
  "password": "123"
}
```

**Respuesta de error:**
```json
{
  "message": "Error de validación",
  "errors": [
    "La contraseña debe tener al menos 6 caracteres"
  ],
  "statusCode": 400
}
```

## Beneficios de esta implementación:

1. **Mensajes consistentes**: Todos los mensajes de error están centralizados en un solo archivo
2. **Fácil mantenimiento**: Cambiar un mensaje solo requiere modificar el archivo de constantes
3. **Reutilización**: Los mismos mensajes se usan en diferentes DTOs
4. **Internacionalización**: Fácil de extender para otros idiomas en el futuro
5. **Experiencia de usuario**: Los usuarios hispanohablantes entienden claramente qué está mal
