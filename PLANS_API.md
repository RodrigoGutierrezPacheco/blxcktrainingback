# API de Planes - Documentación Completa

## Descripción
Sistema CRUD completo para gestionar planes de entrenamiento con nombre, precio, duración, detalle y características.

## Estructura de la Base de Datos

### Tabla: `plans`
- `id` (UUID, Primary Key)
- `name` (VARCHAR 255) - Nombre del plan
- `price` (DECIMAL 10,2) - Precio del plan
- `duration` (VARCHAR 100) - Duración del plan
- `type` (ENUM: 'user' | 'trainer') - Tipo de plan (usuario o entrenador, opcional)
- `detail` (TEXT) - Detalle/descripción del plan
- `features` (JSON) - Array de características del plan
- `badge` (JSON) - Badge del plan con color y nombre (opcional)
- `image` (JSON) - Imagen del plan con tipo y URL (opcional)
- `isActive` (BOOLEAN) - Estado activo/inactivo
- `createdAt` (TIMESTAMP) - Fecha de creación
- `updatedAt` (TIMESTAMP) - Fecha de última actualización

## Endpoints Disponibles

### 1. Crear Plan
**POST** `/plans`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Plan Básico",
  "price": 29.99,
  "duration": "1 mes",
  "type": "user",
  "detail": "Plan básico de entrenamiento para principiantes",
  "features": [
    "Acceso a rutinas básicas",
    "Soporte por email",
    "App móvil incluida"
  ],
  "badge": {
    "color": "#FF6B6B",
    "name": "Popular"
  },
  "image": {
    "type": "jpg",
    "url": "https://example.com/images/plan-basico.jpg"
  },
  "isActive": true
}
```

**Respuesta:**
```json
{
  "id": "uuid-generado",
  "name": "Plan Básico",
  "price": 29.99,
  "duration": "1 mes",
  "type": "user",
  "detail": "Plan básico de entrenamiento para principiantes",
  "features": [
    "Acceso a rutinas básicas",
    "Soporte por email",
    "App móvil incluida"
  ],
  "badge": {
    "color": "#FF6B6B",
    "name": "Popular"
  },
  "image": {
    "type": "jpg",
    "url": "https://example.com/images/plan-basico.jpg"
  },
  "isActive": true,
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

### 2. Obtener Todos los Planes Activos
**GET** `/plans`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta:**
```json
[
  {
    "id": "uuid-1",
    "name": "Plan Básico",
    "price": 29.99,
    "duration": "1 mes",
    "features": [...],
    "isActive": true,
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
]
```

### 3. Obtener Todos los Planes (Incluyendo Inactivos)
**GET** `/plans/all`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

### 4. Obtener Plan por ID
**GET** `/plans/{id}`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Respuesta:**
```json
{
  "id": "uuid-específico",
  "name": "Plan Básico",
  "price": 29.99,
  "duration": "1 mes",
  "detail": "Plan básico de entrenamiento para principiantes",
  "features": [...],
  "isActive": true,
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

### 5. Actualizar Plan
**PATCH** `/plans/{id}`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Body (campos opcionales):**
```json
{
  "price": 39.99,
  "features": [
    "Acceso a rutinas básicas",
    "Soporte por email",
    "App móvil incluida",
    "Entrenador personal"
  ]
}
```

### 6. Eliminar Plan (Hard Delete)
**DELETE** `/plans/{id}`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

### 7. Desactivar Plan (Soft Delete)
**PATCH** `/plans/{id}/deactivate`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

### 8. Activar Plan
**PATCH** `/plans/{id}/activate`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

### 9. Buscar Planes por Rango de Precio
**GET** `/plans/search/price-range?minPrice={min}&maxPrice={max}`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Ejemplo:**
```
GET /plans/search/price-range?minPrice=20&maxPrice=50
```

### 10. Buscar Planes por Duración
**GET** `/plans/search/duration/{duration}`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Ejemplo:**
```
GET /plans/search/duration/1%20mes
```

### 11. Buscar Planes por Tipo
**GET** `/plans/type/{type}`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Parámetros:**
- `type`: `user` o `trainer`

**Ejemplo:**
```
GET /plans/type/user
GET /plans/type/trainer
```

### 12. Buscar Planes por Tipo y Rango de Precio
**GET** `/plans/search/type/{type}/price-range?minPrice={min}&maxPrice={max}`

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Parámetros:**
- `type`: `user` o `trainer`
- `minPrice`: Precio mínimo
- `maxPrice`: Precio máximo

**Ejemplo:**
```
GET /plans/search/type/user/price-range?minPrice=20&maxPrice=50
GET /plans/search/type/trainer/price-range?minPrice=100&maxPrice=200
```

## Ejemplos de Uso con cURL

### Crear Plan
```bash
curl -X POST http://localhost:8000/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Plan Premium",
    "price": 79.99,
    "duration": "3 meses",
    "type": "user",
    "detail": "Plan premium con acceso completo a todas las funcionalidades",
    "features": [
      "Rutinas personalizadas",
      "Entrenador personal 24/7",
      "App móvil premium",
      "Análisis de progreso",
      "Soporte prioritario"
    ],
    "badge": {
      "color": "#4ECDC4",
      "name": "Premium"
    },
    "image": {
      "type": "png",
      "url": "https://example.com/images/plan-premium.png"
    }
  }'
```

### Obtener Todos los Planes
```bash
curl -X GET http://localhost:8000/plans \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Actualizar Plan
```bash
curl -X PATCH http://localhost:8000/plans/UUID_DEL_PLAN \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "price": 89.99,
    "features": [
      "Rutinas personalizadas",
      "Entrenador personal 24/7",
      "App móvil premium",
      "Análisis de progreso",
      "Soporte prioritario",
      "Acceso a eventos exclusivos"
    ]
  }'
```

### Desactivar Plan
```bash
curl -X PATCH http://localhost:8000/plans/UUID_DEL_PLAN/deactivate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Buscar por Rango de Precio
```bash
curl -X GET "http://localhost:8000/plans/search/price-range?minPrice=30&maxPrice=100" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Buscar Planes por Tipo
```bash
curl -X GET http://localhost:8000/plans/type/user \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X GET http://localhost:8000/plans/type/trainer \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Buscar Planes por Tipo y Rango de Precio
```bash
curl -X GET "http://localhost:8000/plans/search/type/user/price-range?minPrice=20&maxPrice=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

curl -X GET "http://localhost:8000/plans/search/type/trainer/price-range?minPrice=100&maxPrice=200" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Validaciones

### CreatePlanDto
- `name`: String obligatorio
- `price`: Número obligatorio, mínimo 0
- `duration`: String obligatorio
- `type`: Enum opcional ('user' o 'trainer')
- `detail`: String opcional
- `features`: Array obligatorio con al menos 1 elemento, todos deben ser strings
- `badge`: Objeto opcional con `color` (string) y `name` (string)
- `image`: Objeto opcional con `type` (string) y `url` (string)
- `isActive`: Boolean opcional (por defecto true)

### UpdatePlanDto
- Todos los campos son opcionales
- Hereda las validaciones de CreatePlanDto

## Características Especiales

1. **Soft Delete**: Los planes se pueden desactivar en lugar de eliminar completamente
2. **Búsquedas Avanzadas**: Por rango de precio y duración
3. **Validación de Datos**: Uso de class-validator para validar entradas
4. **Autenticación**: Todos los endpoints requieren JWT token válido
5. **Timestamps**: Control automático de fechas de creación y actualización
6. **UUIDs**: Identificadores únicos para cada plan

## Estructura de Campos JSON

### Badge
```json
{
  "color": "#FF6B6B",    // Color en formato hexadecimal
  "name": "Popular"      // Nombre del badge
}
```

### Image
```json
{
  "type": "jpg",         // Tipo de imagen (jpg, png, webp, etc.)
  "url": "https://..."   // URL de la imagen
}
```

## Notas de Implementación

- La entidad `Plan` usa `@Entity('plans')` para especificar el nombre de la tabla
- Los campos `features`, `badge` e `image` se almacenan como JSON en PostgreSQL
- El campo `price` usa DECIMAL(10,2) para precisión en precios
- Se incluyen métodos adicionales como `findByPriceRange` y `findByDuration`
- El servicio maneja tanto eliminación física como lógica (soft delete)
- Los campos `badge` e `image` son opcionales y pueden ser `null`
