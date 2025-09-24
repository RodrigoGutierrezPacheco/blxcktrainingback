# 🚨 SOLUCIÓN INMEDIATA PARA LAURA

## Problema Actual

Laura tiene **8 rutinas** cuando debería tener **solo 1**. El endpoint `POST /routines/assign` no está eliminando las rutinas anteriores correctamente.

## Solución Paso a Paso

### **Paso 1: Limpiar TODAS las Rutinas de Laura**

```bash
DELETE /routines/user/email/laura@gmail.com/delete-all
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta esperada:**
```json
{
  "message": "Se eliminaron 8 rutina(s) del usuario exitosamente",
  "deletedRoutines": 8
}
```

### **Paso 2: Verificar que Laura NO tiene Rutinas**

```bash
GET /routines/user/email/laura@gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta esperada:**
```json
[]
```

### **Paso 3: Asignar UNA SOLA Rutina a Laura**

```bash
POST /routines/assign
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "userId": "06f71800-6342-43f5-82a0-64774657ceed",
  "routineId": "rutina-limpia-123",
  "startDate": "2025-01-15T00:00:00.000Z",
  "endDate": "2025-03-15T00:00:00.000Z",
  "notes": "Rutina limpia para Laura"
}
```

### **Paso 4: Verificar que Laura tiene SOLO 1 Rutina**

```bash
GET /routines/user/email/laura@gmail.com
Authorization: Bearer YOUR_JWT_TOKEN
```

**Respuesta esperada:**
```json
[
  {
    "id": "nueva-user-routine-123",
    "user_id": "06f71800-6342-43f5-82a0-64774657ceed",
    "routine_id": "rutina-limpia-123",
    "isActive": true,
    "routine": {
      "id": "rutina-limpia-123",
      "name": "Rutina Limpia para Laura"
    }
  }
]
```

## Código JavaScript para Ejecutar

```javascript
async function limpiarRutinasDeLaura() {
  const token = 'YOUR_JWT_TOKEN';
  
  try {
    console.log('🧹 Paso 1: Eliminando TODAS las rutinas de Laura...');
    
    // Paso 1: Eliminar todas las rutinas
    const deleteResponse = await fetch('/routines/user/email/laura@gmail.com/delete-all', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const deleteResult = await deleteResponse.json();
    console.log('✅ Resultado:', deleteResult);
    
    // Paso 2: Verificar que no tiene rutinas
    console.log('🔍 Paso 2: Verificando que Laura no tiene rutinas...');
    const checkResponse = await fetch('/routines/user/email/laura@gmail.com', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const checkResult = await checkResponse.json();
    console.log('📋 Rutinas actuales:', checkResult);
    
    if (checkResult.length === 0) {
      console.log('✅ Laura no tiene rutinas. Procediendo a asignar una nueva...');
      
      // Paso 3: Asignar nueva rutina
      const assignResponse = await fetch('/routines/assign', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: '06f71800-6342-43f5-82a0-64774657ceed',
          routineId: 'rutina-limpia-123',
          startDate: '2025-01-15T00:00:00.000Z',
          endDate: '2025-03-15T00:00:00.000Z',
          notes: 'Rutina limpia para Laura'
        })
      });
      
      const assignResult = await assignResponse.json();
      console.log('✅ Nueva rutina asignada:', assignResult);
      
      // Paso 4: Verificar resultado final
      const finalCheckResponse = await fetch('/routines/user/email/laura@gmail.com', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const finalResult = await finalCheckResponse.json();
      console.log('🎉 Resultado final:', finalResult);
      console.log(`📊 Laura ahora tiene ${finalResult.length} rutina(s)`);
      
    } else {
      console.log('❌ Laura aún tiene rutinas. El proceso falló.');
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

// Ejecutar la limpieza
limpiarRutinasDeLaura();
```

## Comandos cURL

### **1. Eliminar TODAS las rutinas de Laura:**
```bash
curl -X DELETE \
  "http://localhost:8000/routines/user/email/laura@gmail.com/delete-all" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### **2. Verificar que no tiene rutinas:**
```bash
curl -X GET \
  "http://localhost:8000/routines/user/email/laura@gmail.com" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **3. Asignar nueva rutina:**
```bash
curl -X POST \
  "http://localhost:8000/routines/assign" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "06f71800-6342-43f5-82a0-64774657ceed",
    "routineId": "rutina-limpia-123",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-03-15T00:00:00.000Z",
    "notes": "Rutina limpia para Laura"
  }'
```

## Verificación Final

Después de ejecutar estos pasos, Laura debería tener **exactamente 1 rutina**:

```bash
GET /routines/user/email/laura@gmail.com
```

**Resultado esperado:**
```json
[
  {
    "id": "nueva-user-routine-123",
    "user_id": "06f71800-6342-43f5-82a0-64774657ceed",
    "routine_id": "rutina-limpia-123",
    "isActive": true,
    "routine": {
      "id": "rutina-limpia-123",
      "name": "Rutina Limpia para Laura"
    }
  }
]
```

## ¿Por qué Falló el Endpoint Original?

El endpoint `POST /routines/assign` debería eliminar las rutinas anteriores, pero puede fallar por:

1. **Servidor no reiniciado** - Los cambios no se aplicaron
2. **Transacción no completada** - Error en la base de datos
3. **Caché** - Los datos están en caché
4. **Error en el código** - Bug en la implementación

## Solución Definitiva

El nuevo endpoint `DELETE /routines/user/email/laura@gmail.com/delete-all` **garantiza** que se eliminen TODAS las rutinas de Laura antes de asignar una nueva.

## Pasos Adicionales

### **1. Reiniciar el Servidor**
```bash
# Detener el servidor
Ctrl + C

# Reiniciar el servidor
npm run start:dev
```

### **2. Verificar Logs**
Busca en la consola del servidor estos mensajes:
```
🗑️ Eliminando 8 rutinas del usuario 06f71800-6342-43f5-82a0-64774657ceed
✅ 8 rutinas eliminadas exitosamente
```

### **3. Verificar Base de Datos**
```sql
-- Verificar rutinas de Laura
SELECT COUNT(*) FROM user_routine WHERE user_id = '06f71800-6342-43f5-82a0-64774657ceed';

-- Debería devolver 0 después de la limpieza
-- Debería devolver 1 después de asignar nueva rutina
```

## Resumen

🎯 **Objetivo:** Laura debe tener exactamente 1 rutina
🔧 **Solución:** Usar el endpoint de eliminación completa
✅ **Resultado:** Laura con 1 rutina limpia

¡Ejecuta estos pasos y Laura tendrá solo una rutina! 🚀
