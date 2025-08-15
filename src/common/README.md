# Sistema de Mensajes de Validación en Español

Este directorio contiene la implementación del sistema de mensajes de validación en español para la API de BLXCK Training.

## Estructura

```
src/common/
├── constants/
│   └── validation-messages.ts    # Constantes con todos los mensajes
├── interceptors/
│   └── validation.interceptor.ts # Interceptor para manejar errores
├── examples/
│   └── validation-examples.md    # Ejemplos de uso
├── index.ts                      # Exportaciones principales
└── README.md                     # Este archivo
```

## Cómo usar

### 1. Importar las constantes

```typescript
import { VALIDATION_MESSAGES } from '../common/constants/validation-messages';

export class MiDto {
  @IsString({ message: VALIDATION_MESSAGES.FULL_NAME_IS_STRING })
  @IsNotEmpty({ message: VALIDATION_MESSAGES.FULL_NAME_IS_NOT_EMPTY })
  fullName: string;
}
```

### 2. Agregar nuevos mensajes

Para agregar un nuevo mensaje de validación:

1. Abre `src/common/constants/validation-messages.ts`
2. Agrega la nueva constante en la sección apropiada
3. Usa la constante en tu DTO

```typescript
// En validation-messages.ts
export const VALIDATION_MESSAGES = {
  // ... mensajes existentes
  
  // Nuevo mensaje
  NEW_FIELD_IS_REQUIRED: 'El nuevo campo es obligatorio',
} as const;

// En tu DTO
@IsNotEmpty({ message: VALIDATION_MESSAGES.NEW_FIELD_IS_REQUIRED })
newField: string;
```

### 3. Mensajes personalizados

Si necesitas un mensaje muy específico que no está en las constantes, puedes usar un mensaje personalizado directamente:

```typescript
@Matches(/^[A-Z]{2}\d{4}$/, { 
  message: 'El código debe tener 2 letras mayúsculas seguidas de 4 números' 
})
code: string;
```

## Tipos de validación soportados

### Validadores básicos
- `@IsString()` - Valida que sea una cadena de texto
- `@IsNotEmpty()` - Valida que no esté vacío
- `@IsEmail()` - Valida formato de email
- `@IsOptional()` - Marca el campo como opcional

### Validadores de longitud
- `@MinLength(n)` - Longitud mínima
- `@MaxLength(n)` - Longitud máxima

### Validadores de patrón
- `@Matches(regex)` - Valida contra una expresión regular

### Validadores de tipo
- `@IsNumber()` - Valida que sea un número
- `@IsBoolean()` - Valida que sea un booleano
- `@IsDate()` - Valida que sea una fecha

## Personalización del ValidationPipe

El `ValidationPipe` está configurado en `src/main.ts` con:

- **whitelist: true** - Solo permite propiedades definidas en el DTO
- **forbidNonWhitelisted: true** - Rechaza propiedades no definidas
- **transform: true** - Transforma automáticamente los tipos
- **exceptionFactory personalizada** - Formatea errores en español

## Interceptor de Validación

El `ValidationInterceptor` se ejecuta globalmente y:

1. Captura errores de validación
2. Formatea mensajes en español
3. Mantiene la consistencia en el formato de respuesta

## Formato de respuesta de error

```json
{
  "message": "Error de validación",
  "errors": [
    "El nombre completo es obligatorio",
    "La contraseña debe tener al menos 8 caracteres"
  ],
  "statusCode": 400
}
```

## Mantenimiento

### Agregar nuevos idiomas

Para agregar soporte para otros idiomas:

1. Crea un nuevo archivo de constantes (ej: `validation-messages.en.ts`)
2. Modifica el interceptor para detectar el idioma del usuario
3. Selecciona el idioma apropiado basado en headers o configuración

### Actualizar mensajes existentes

1. Modifica la constante en `validation-messages.ts`
2. El cambio se aplicará automáticamente a todos los DTOs que la usen
3. No es necesario modificar cada DTO individualmente

## Pruebas

Para probar que los mensajes funcionan correctamente:

1. Ejecuta `npm run build` para verificar que no hay errores de compilación
2. Inicia el servidor con `npm run start:dev`
3. Haz peticiones con datos inválidos a los endpoints de registro/login
4. Verifica que los mensajes de error aparezcan en español

## Ejemplos de uso

Ver `src/common/examples/validation-examples.md` para ejemplos detallados de cómo se ven los mensajes de error en diferentes escenarios.
