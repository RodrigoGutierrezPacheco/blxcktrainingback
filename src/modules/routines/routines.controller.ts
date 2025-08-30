import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AssignRoutineDto } from './dto/assign-routine.dto';
import { JwtGuard } from '../../auth/guards/jwt/jwt.guard';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('📋 Gestión de Rutinas')
@ApiBearerAuth()
@Controller('routines')
@UseGuards(JwtGuard)
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear Nueva Rutina',
    description: 'Crea una nueva rutina de entrenamiento con semanas, días y ejercicios.'
  })
  @ApiBody({
    type: CreateRoutineDto,
    description: 'Datos de la rutina a crear',
    examples: {
      rutina1: {
        summary: 'Rutina de Ejemplo',
        value: {
          name: 'Rutina de Fuerza',
          description: 'Rutina para desarrollar fuerza muscular',
          comments: 'Realizar 3 veces por semana',
          weeks: [
            {
              weekNumber: 1,
              name: 'Semana 1 - Adaptación',
              comments: 'Enfoque en técnica',
              days: [
                {
                  dayNumber: 1,
                  name: 'Día 1 - Pecho y Tríceps',
                  comments: 'Ejercicios básicos',
                  exercises: [
                    {
                      name: 'Press de Banca',
                      sets: 3,
                      repetitions: 10,
                      restBetweenSets: 90,
                      restBetweenExercises: 120,
                      comments: 'Mantener buena forma',
                      order: 1
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Rutina creada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-generado' },
        name: { type: 'string', example: 'Rutina de Fuerza' },
        description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
        comments: { type: 'string', example: 'Realizar 3 veces por semana' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routinesService.create(createRoutineDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener Todas las Rutinas Activas',
    description: 'Obtiene la lista de todas las rutinas activas en el sistema.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de rutinas activas obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-de-rutina' },
          name: { type: 'string', example: 'Rutina de Fuerza' },
          description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
          comments: { type: 'string', example: 'Realizar 3 veces por semana' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  async findAll() {
    return this.routinesService.findAll();
  }

  @Get('all')
  @ApiOperation({
    summary: 'Obtener Todas las Rutinas (Incluyendo Inactivas)',
    description: 'Obtiene la lista completa de todas las rutinas, tanto activas como inactivas.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de rutinas obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-de-rutina' },
          name: { type: 'string', example: 'Rutina de Fuerza' },
          description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
          comments: { type: 'string', example: 'Realizar 3 veces por semana' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  async findAllIncludingInactive() {
    return this.routinesService.findAllIncludingInactive();
  }

  @Get('trainer/:trainerId')
  @ApiOperation({
    summary: 'Obtener Rutinas por Entrenador',
    description: 'Obtiene todas las rutinas creadas por un entrenador específico.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador',
    example: 'uuid-del-entrenador',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Rutinas del entrenador obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-de-rutina' },
          name: { type: 'string', example: 'Rutina de Fuerza' },
          description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
          comments: { type: 'string', example: 'Realizar 3 veces por semana' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  findByTrainer(@Param('trainerId') trainerId: string) {
    return this.routinesService.findByTrainer(trainerId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener Rutina por ID',
    description: 'Obtiene una rutina específica con todos sus detalles, incluyendo semanas, días y ejercicios.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la rutina',
    example: 'uuid-de-rutina',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Rutina encontrada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-de-rutina' },
        name: { type: 'string', example: 'Rutina de Fuerza' },
        description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
        comments: { type: 'string', example: 'Realizar 3 veces por semana' },
        isActive: { type: 'boolean', example: true },
        weeks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              weekNumber: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Semana 1 - Adaptación' },
              comments: { type: 'string', example: 'Enfoque en técnica' },
              days: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    dayNumber: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'Día 1 - Pecho y Tríceps' },
                    comments: { type: 'string', example: 'Ejercicios básicos' },
                    exercises: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          name: { type: 'string', example: 'Press de Banca' },
                          sets: { type: 'number', example: 3 },
                          repetitions: { type: 'number', example: 10 },
                          restBetweenSets: { type: 'number', example: 90 },
                          restBetweenExercises: { type: 'number', example: 120 },
                          comments: { type: 'string', example: 'Mantener buena forma' },
                          order: { type: 'number', example: 1 }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada' })
  findOne(@Param('id') id: string) {
    return this.routinesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routinesService.update(id, updateRoutineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routinesService.remove(id);
  }

  // Endpoints para asignar rutinas a usuarios
  @Post('assign')
  @ApiOperation({
    summary: 'Asignar Rutina a Usuario',
    description: 'Asigna una rutina específica a un usuario, creando la relación entre ambos.'
  })
  @ApiBody({
    type: AssignRoutineDto,
    description: 'Datos para asignar rutina a usuario',
    examples: {
      asignacion1: {
        summary: 'Asignación de Rutina',
        value: {
          userId: 'uuid-del-usuario',
          routineId: 'uuid-de-rutina'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Rutina asignada al usuario exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Rutina asignada exitosamente' },
        userRoutine: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-generado' },
            userId: { type: 'string', example: 'uuid-del-usuario' },
            routineId: { type: 'string', example: 'uuid-de-rutina' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Usuario o rutina no encontrado' })
  assignRoutineToUser(@Body() assignRoutineDto: AssignRoutineDto) {
    return this.routinesService.assignRoutineToUser(assignRoutineDto);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Obtener Rutinas de un Usuario',
    description: 'Obtiene todas las rutinas asignadas a un usuario específico.'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: 'uuid-del-usuario',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Rutinas del usuario obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-de-rutina' },
          name: { type: 'string', example: 'Rutina de Fuerza' },
          description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
          comments: { type: 'string', example: 'Realizar 3 veces por semana' },
          isActive: { type: 'boolean', example: true },
          assignedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  getUserRoutines(@Param('userId') userId: string) {
    return this.routinesService.getUserRoutines(userId);
  }

  @Get('user/email/:email')
  getUserRoutinesByEmail(@Param('email') email: string) {
    return this.routinesService.getUserRoutinesByEmail(email);
  }

  @Get('user/by-email')
  getUserRoutinesByEmailQuery(@Query('email') email: string) {
    return this.routinesService.getUserRoutinesByEmail(email);
  }

  @Patch('user/:userId/routine/:routineId/deactivate')
  deactivateUserRoutine(
    @Param('userId') userId: string,
    @Param('routineId') routineId: string,
  ) {
    return this.routinesService.deactivateUserRoutine(userId, routineId);
  }

  @Delete('user/:userId/routine/:routineId')
  removeUserRoutine(
    @Param('userId') userId: string,
    @Param('routineId') routineId: string,
  ) {
    return this.routinesService.removeUserRoutine(userId, routineId);
  }

  @Post('sync-users-routine-status')
  @ApiOperation({
    summary: 'Sincronizar Estado de Rutinas de Usuarios',
    description: 'Sincroniza automáticamente el campo hasRoutine de todos los usuarios basándose en sus rutinas asignadas.'
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de rutinas sincronizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Estado de rutinas sincronizado exitosamente' },
        usersUpdated: { type: 'number', example: 25 },
        usersWithRoutine: { type: 'number', example: 20 },
        usersWithoutRoutine: { type: 'number', example: 5 }
      }
    }
  })
  syncAllUsersRoutineStatus() {
    return this.routinesService.syncAllUsersRoutineStatus();
  }

  @Get('users/with-routine-status')
  @ApiOperation({
    summary: 'Obtener Usuarios con Estado de Rutina',
    description: 'Obtiene la lista de usuarios con información sobre su estado de rutina (hasRoutine).'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios con estado de rutina obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-usuario' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          fullName: { type: 'string', example: 'Juan Pérez' },
          role: { type: 'string', example: 'user' },
          hasRoutine: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: true }
        }
      }
    }
  })
  getUsersWithRoutineStatus() {
    return this.routinesService.findAll();
  }

  @Get('users/with-routine-details')
  @ApiOperation({
    summary: 'Obtener Usuarios con Detalles de Rutina',
    description: 'Obtiene la lista de usuarios que tienen rutinas asignadas, incluyendo detalles completos de las rutinas.'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios con detalles de rutina obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-usuario' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          fullName: { type: 'string', example: 'Juan Pérez' },
          role: { type: 'string', example: 'user' },
          hasRoutine: { type: 'boolean', example: true },
          routine: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid-de-rutina' },
              name: { type: 'string', example: 'Rutina de Fuerza' },
              description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
              assignedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
            }
          }
        }
      }
    }
  })
  getUsersWithRoutineDetails() {
    return this.routinesService.getUsersWithRoutineDetails();
  }

  @Get('users/without-routine')
  @ApiOperation({
    summary: 'Obtener Usuarios Sin Rutina',
    description: 'Obtiene la lista de usuarios que no tienen rutinas asignadas (hasRoutine = false).'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios sin rutina obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-usuario' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          fullName: { type: 'string', example: 'Juan Pérez' },
          role: { type: 'string', example: 'user' },
          hasRoutine: { type: 'boolean', example: false },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  getUsersWithoutRoutine() {
    return this.routinesService.getUsersWithoutRoutine();
  }

  @Get('users/with-routine')
  @ApiOperation({
    summary: 'Obtener Usuarios Con Rutina',
    description: 'Obtiene la lista de usuarios que tienen rutinas asignadas (hasRoutine = true).'
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios con rutina obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-usuario' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          fullName: { type: 'string', example: 'Juan Pérez' },
          role: { type: 'string', example: 'user' },
          hasRoutine: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: true },
          routine: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid-de-rutina' },
              name: { type: 'string', example: 'Rutina de Fuerza' },
              description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' }
            }
          }
        }
      }
    }
  })
  getUsersWithRoutine() {
    return this.routinesService.getUsersWithRoutine();
  }
}
