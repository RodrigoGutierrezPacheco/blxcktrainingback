# Endpoint: Desasignar Todas las Rutinas de un Usuario

## Descripción

Nuevo endpoint que permite desasignar todas las rutinas activas de un usuario específico por su email. Marca todas las rutinas como inactivas y actualiza el estado `hasRoutine` del usuario a `false`.

## Endpoint

```http
DELETE /routines/user/email/{email}
```

### Parámetros

- **`email`** (string, requerido): Email del usuario al que se le desasignarán todas las rutinas

### Autenticación

- **Token JWT** requerido en el header `Authorization: Bearer {token}`

## Ejemplos de Uso

### 1. **Desasignar Todas las Rutinas de Laura**

```bash
DELETE /routines/user/email/laura@gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta Exitosa (Usuario con Rutinas Activas):**
```json
{
  "message": "Se desasignaron 2 rutina(s) del usuario exitosamente",
  "deactivatedRoutines": 2
}
```

**Respuesta (Usuario sin Rutinas Activas):**
```json
{
  "message": "El usuario no tiene rutinas activas para desasignar",
  "deactivatedRoutines": 0
}
```

### 2. **Respuesta de Error (Usuario no Encontrado)**

```json
{
  "statusCode": 404,
  "message": "Usuario no encontrado",
  "error": "Not Found"
}
```

## Casos de Uso

### **Caso 1: Usuario con Múltiples Rutinas Activas**

**Estado Inicial:**
- Usuario tiene 3 rutinas activas
- `hasRoutine = true`

**Request:**
```bash
DELETE /routines/user/email/juan@gmail.com
```

**Resultado:**
- Las 3 rutinas se marcan como inactivas
- Se establece `endDate = fecha_actual` en todas las rutinas
- `hasRoutine = false`
- Respuesta: `"Se desasignaron 3 rutina(s) del usuario exitosamente"`

### **Caso 2: Usuario con Una Rutina Activa**

**Estado Inicial:**
- Usuario tiene 1 rutina activa
- `hasRoutine = true`

**Request:**
```bash
DELETE /routines/user/email/maria@gmail.com
```

**Resultado:**
- La rutina se marca como inactiva
- Se establece `endDate = fecha_actual`
- `hasRoutine = false`
- Respuesta: `"Se desasignaron 1 rutina(s) del usuario exitosamente"`

### **Caso 3: Usuario sin Rutinas Activas**

**Estado Inicial:**
- Usuario no tiene rutinas activas
- `hasRoutine = false`

**Request:**
```bash
DELETE /routines/user/email/pedro@gmail.com
```

**Resultado:**
- No se realizan cambios
- `hasRoutine` permanece en `false`
- Respuesta: `"El usuario no tiene rutinas activas para desasignar"`

## Lógica del Sistema

### **Flujo de Desasignación**

1. **Buscar Usuario**: Se busca el usuario por email usando `getUserByEmail()`
2. **Validar Existencia**: Si no existe, se retorna error 404
3. **Buscar Rutinas Activas**: Se buscan todas las rutinas con `isActive = true`
4. **Verificar Estado**: Si no hay rutinas activas, se retorna mensaje informativo
5. **Desasignar Rutinas**: Se marcan todas las rutinas como inactivas
6. **Actualizar Fechas**: Se establece `endDate = fecha_actual` en todas las rutinas
7. **Actualizar Usuario**: Se establece `hasRoutine = false`
8. **Retornar Resultado**: Se retorna mensaje con número de rutinas desasignadas

### **Cambios en Base de Datos**

#### **Tabla `user_routine`:**
```sql
-- Antes
user_id: 'user-123', routine_id: 'routine-1', isActive: true, endDate: null
user_id: 'user-123', routine_id: 'routine-2', isActive: true, endDate: null

-- Después
user_id: 'user-123', routine_id: 'routine-1', isActive: false, endDate: '2024-01-15T10:00:00.000Z'
user_id: 'user-123', routine_id: 'routine-2', isActive: false, endDate: '2024-01-15T10:00:00.000Z'
```

#### **Tabla `user`:**
```sql
-- Antes
id: 'user-123', hasRoutine: true

-- Después
id: 'user-123', hasRoutine: false
```

## Código de Ejemplo

### **JavaScript/TypeScript**
```javascript
async function deactivateAllUserRoutines(email) {
  try {
    const response = await fetch(`/routines/user/email/${email}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
      console.log(`Rutinas desasignadas: ${result.deactivatedRoutines}`);
    } else if (response.status === 404) {
      console.error('Usuario no encontrado');
    }
  } catch (error) {
    console.error('Error al desasignar rutinas:', error);
  }
}

// Uso
deactivateAllUserRoutines('laura@gmail.com');
```

### **React Hook**
```javascript
const useRoutineDeactivation = () => {
  const deactivateAllRoutines = async (email) => {
    try {
      const response = await fetch(`/routines/user/email/${email}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message);
        return result;
      } else {
        toast.error(result.message);
        throw new Error(result.message);
      }
    } catch (error) {
      toast.error('Error al desasignar rutinas');
      throw error;
    }
  };

  return { deactivateAllRoutines };
};
```

### **cURL**
```bash
curl -X DELETE \
  "http://localhost:8000/routines/user/email/laura@gmail.com" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

## Comparación con Otros Endpoints

| Endpoint | Propósito | Alcance |
|----------|-----------|---------|
| `DELETE /routines/user/email/{email}` | Desasignar TODAS las rutinas del usuario | Todas las rutinas activas |
| `DELETE /routines/user/{userId}/routine/{routineId}` | Desasignar UNA rutina específica | Una rutina específica |
| `PATCH /routines/user/{userId}/routine/{routineId}/deactivate` | Desactivar UNA rutina específica | Una rutina específica |

## Casos de Uso Comunes

### **1. Usuario Termina su Programa de Entrenamiento**
```javascript
// Cuando un usuario completa su programa y quiere empezar uno nuevo
await deactivateAllUserRoutines('laura@gmail.com');
// Luego asignar nueva rutina
await assignNewRoutine('laura@gmail.com', 'new-routine-id');
```

### **2. Usuario Pausa Temporalmente sus Entrenamientos**
```javascript
// Usuario pausa por lesión o vacaciones
await deactivateAllUserRoutines('juan@gmail.com');
// Más tarde se puede reactivar o asignar nueva rutina
```

### **3. Limpieza Administrativa**
```javascript
// Administrador limpia rutinas de usuarios inactivos
const inactiveUsers = ['user1@gmail.com', 'user2@gmail.com'];
for (const email of inactiveUsers) {
  await deactivateAllUserRoutines(email);
}
```

## Ventajas del Endpoint

✅ **Simplicidad**: Un solo endpoint para desasignar todas las rutinas
✅ **Eficiencia**: Operación atómica que maneja múltiples rutinas
✅ **Consistencia**: Actualiza automáticamente el estado del usuario
✅ **Flexibilidad**: Funciona con usuarios con 0, 1 o múltiples rutinas
✅ **Seguridad**: Requiere autenticación JWT
✅ **Documentación**: Swagger completo con ejemplos

## Notas Importantes

1. **Preservación de Datos**: Las rutinas no se eliminan, solo se marcan como inactivas
2. **Historial**: Se mantiene el historial completo de rutinas asignadas
3. **Fecha de Finalización**: Se establece automáticamente la fecha actual
4. **Estado del Usuario**: Se actualiza automáticamente `hasRoutine = false`
5. **Idempotencia**: Llamar múltiples veces no causa errores

¡El endpoint está listo y funcionando! 🎉
