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
import { ReassignRoutineDto } from './dto/reassign-routine.dto';
import { CreateRoutineForUserDto } from './dto/create-routine-for-user.dto';
import { UpdateRoutineDurationDto } from './dto/update-routine-duration.dto';
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
    description: 'Crea una nueva rutina de entrenamiento con semanas, días y ejercicios. Opcionalmente puede incluir fechas sugeridas de inicio y finalización.'
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
          totalWeeks: 4,
          trainer_id: 'uuid-del-entrenador',
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
      },
      rutinaConFechas: {
        summary: 'Rutina con Fechas Sugeridas',
        value: {
          name: 'Rutina de Fuerza Avanzada',
          description: 'Rutina para desarrollar fuerza muscular avanzada',
          comments: 'Realizar 4 veces por semana',
          totalWeeks: 6,
          trainer_id: 'uuid-del-entrenador',
          suggestedStartDate: '2024-01-15T00:00:00.000Z',
          suggestedEndDate: '2024-03-15T00:00:00.000Z',
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
                      sets: 4,
                      repetitions: 8,
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
        totalWeeks: { type: 'number', example: 4 },
        isActive: { type: 'boolean', example: true },
        trainer_id: { type: 'string', example: 'uuid-del-entrenador' },
        suggestedStartDate: { type: 'string', example: '2024-01-15T00:00:00.000Z', nullable: true },
        suggestedEndDate: { type: 'string', example: '2024-03-15T00:00:00.000Z', nullable: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routinesService.create(createRoutineDto);
  }

  @Post('create-for-user')
  @ApiOperation({
    summary: 'Crear Rutina Directamente para Usuario',
    description: 'Crea una nueva rutina personalizada y la asigna directamente a un usuario específico. Esta operación crea la rutina, la estructura completa (semanas, días, ejercicios) y la asigna al usuario en una sola operación.'
  })
  @ApiBody({
    type: CreateRoutineForUserDto,
    description: 'Datos de la rutina personalizada para el usuario',
    examples: {
      rutinaPersonalizada: {
        summary: 'Rutina Personalizada para Usuario',
        value: {
          user_id: '123e4567-e89b-12d3-a456-426614174000',
          trainer_id: '123e4567-e89b-12d3-a456-426614174001',
          name: 'Rutina Personalizada para Juan',
          description: 'Rutina específica para los objetivos de Juan',
          comments: 'Realizar 3 veces por semana',
          totalWeeks: 4,
          startDate: '2024-01-15T00:00:00.000Z',
          endDate: '2024-02-15T00:00:00.000Z',
          notes: 'Rutina creada específicamente para este usuario',
          suggestedStartDate: '2024-01-15T00:00:00.000Z',
          suggestedEndDate: '2024-03-15T00:00:00.000Z',
          weeks: [
            {
              weekNumber: 1,
              name: 'Semana 1 - Adaptación',
              comments: 'Enfoque en la técnica',
              days: [
                {
                  dayNumber: 1,
                  name: 'Día de Pecho y Tríceps',
                  comments: 'Trabajo de fuerza',
                  exercises: [
                    {
                      name: 'Press de banca',
                      sets: 4,
                      repetitions: 8,
                      restBetweenSets: 90,
                      restBetweenExercises: 120,
                      comments: 'Mantener la espalda recta',
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
    description: 'Rutina creada y asignada al usuario exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string', 
          example: 'Rutina creada y asignada al usuario exitosamente' 
        },
        routine: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-generado' },
            name: { type: 'string', example: 'Rutina Personalizada para Juan' },
            description: { type: 'string', example: 'Rutina específica para los objetivos de Juan' },
            totalWeeks: { type: 'number', example: 4 },
            trainer_id: { type: 'string', example: 'uuid-entrenador' },
            suggestedStartDate: { type: 'string', example: '2024-01-15T00:00:00.000Z', nullable: true },
            suggestedEndDate: { type: 'string', example: '2024-03-15T00:00:00.000Z', nullable: true },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
          }
        },
        userRoutine: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-generado' },
            user_id: { type: 'string', example: 'uuid-usuario' },
            routine_id: { type: 'string', example: 'uuid-rutina' },
            startDate: { type: 'string', example: '2024-01-15T00:00:00.000Z' },
            endDate: { type: 'string', example: '2024-02-15T00:00:00.000Z' },
            notes: { type: 'string', example: 'Rutina creada específicamente para este usuario' },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['user_id debe ser un UUID válido'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario o entrenador no encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuario no encontrado' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  async createRoutineForUser(@Body() createRoutineForUserDto: CreateRoutineForUserDto) {
    const result = await this.routinesService.createRoutineForUser(createRoutineForUserDto);
    
    return {
      message: 'Rutina creada y asignada al usuario exitosamente',
      routine: result.routine,
      userRoutine: result.userRoutine
    };
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
          totalWeeks: { type: 'number', example: 4 },
          isActive: { type: 'boolean', example: true },
          trainer_id: { type: 'string', example: 'uuid-del-entrenador' },
          suggestedStartDate: { type: 'string', example: '2024-01-15T00:00:00.000Z', nullable: true },
          suggestedEndDate: { type: 'string', example: '2024-03-15T00:00:00.000Z', nullable: true },
          isAssigned: { type: 'boolean', example: true, description: 'Indica si la rutina está asignada a algún usuario' },
          assignmentCount: { type: 'number', example: 2, description: 'Número de usuarios que tienen esta rutina asignada' },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
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
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  findByTrainer(@Param('trainerId') trainerId: string) {
    return this.routinesService.findByTrainer(trainerId);
  }

  @Get('trainer/:trainerId/unassigned')
  @ApiOperation({
    summary: 'Obtener Rutinas No Asignadas por Entrenador',
    description: 'Obtiene todas las rutinas creadas por un entrenador específico que NO están asignadas a ningún usuario.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador',
    example: 'uuid-del-entrenador',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Rutinas no asignadas del entrenador obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-de-rutina' },
          name: { type: 'string', example: 'Rutina de Fuerza' },
          description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
          comments: { type: 'string', example: 'Realizar 3 veces por semana' },
          totalWeeks: { type: 'number', example: 4 },
          isActive: { type: 'boolean', example: true },
          trainer_id: { type: 'string', example: 'uuid-del-entrenador' },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
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
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  findUnassignedRoutinesByTrainer(@Param('trainerId') trainerId: string) {
    return this.routinesService.findUnassignedRoutinesByTrainer(trainerId);
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
  @ApiOperation({
    summary: 'Actualizar Rutina',
    description: 'Actualiza una rutina existente. Puede actualizar campos básicos y/o reemplazar completamente la estructura de semanas, días y ejercicios. Los ejercicios pueden incluir exerciseId para referenciar ejercicios del catálogo.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la rutina a actualizar',
    example: 'uuid-de-rutina',
    required: true
  })
  @ApiBody({
    type: UpdateRoutineDto,
    description: 'Datos de la rutina a actualizar',
    examples: {
      actualizacion1: {
        summary: 'Actualización Básica',
        value: {
          name: 'Rutina de Fuerza Actualizada',
          description: 'Rutina actualizada para desarrollar fuerza muscular',
          comments: 'Realizar 4 veces por semana'
        }
      },
      actualizacion2: {
        summary: 'Actualización Completa con Ejercicios',
        value: {
          name: 'Rutina de Fuerza Actualizada',
          description: 'Rutina actualizada para desarrollar fuerza muscular',
          comments: 'Realizar 4 veces por semana',
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
                      exerciseId: 'uuid-del-ejercicio-del-catalogo',
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
    status: 200,
    description: 'Rutina actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-de-rutina' },
        name: { type: 'string', example: 'Rutina de Fuerza Actualizada' },
        description: { type: 'string', example: 'Rutina actualizada para desarrollar fuerza muscular' },
        comments: { type: 'string', example: 'Realizar 4 veces por semana' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Rutina no encontrada' })
  update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routinesService.update(id, updateRoutineDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar Rutina',
    description: 'Elimina permanentemente una rutina del sistema. Esta acción también eliminará todas las semanas, días y ejercicios asociados, así como las asignaciones de usuarios a esta rutina. Esta acción no se puede deshacer.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la rutina a eliminar',
    example: 'uuid-de-rutina',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Rutina eliminada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string', 
          example: 'Rutina eliminada exitosamente',
          description: 'Mensaje de confirmación de eliminación'
        },
        deletedRoutine: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-de-rutina' },
            name: { type: 'string', example: 'Rutina de Fuerza' },
            description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
            comments: { type: 'string', example: 'Realizar 3 veces por semana' },
            totalWeeks: { type: 'number', example: 4 },
            isActive: { type: 'boolean', example: true },
            trainer_id: { type: 'string', example: 'uuid-del-entrenador' },
            createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
          },
          description: 'Información de la rutina eliminada'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rutina no encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Rutina no encontrada' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - Solo el creador de la rutina o administradores pueden eliminarla' 
  })
  async remove(@Param('id') id: string) {
    const deletedRoutine = await this.routinesService.findOne(id);
    await this.routinesService.remove(id);
    
    return {
      message: 'Rutina eliminada exitosamente',
      deletedRoutine: {
        id: deletedRoutine.id,
        name: deletedRoutine.name,
        description: deletedRoutine.description,
        comments: deletedRoutine.comments,
        totalWeeks: deletedRoutine.totalWeeks,
        isActive: deletedRoutine.isActive,
        trainer_id: deletedRoutine.trainer_id,
        createdAt: deletedRoutine.createdAt,
        updatedAt: deletedRoutine.updatedAt
      }
    };
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

  @Post('reassign')
  @ApiOperation({
    summary: 'Reasignar Rutina a Usuario',
    description: 'Reasigna una nueva rutina a un usuario que ya tiene rutinas asignadas. Desactiva automáticamente todas las rutinas activas anteriores y asigna la nueva rutina.'
  })
  @ApiBody({
    type: ReassignRoutineDto,
    description: 'Datos para reasignar rutina a usuario',
    examples: {
      reasignacion1: {
        summary: 'Reasignación de Rutina',
        value: {
          user_id: 'uuid-del-usuario',
          routine_id: 'uuid-de-nueva-rutina',
          startDate: '2024-01-15T00:00:00.000Z',
          endDate: '2024-04-15T00:00:00.000Z',
          notes: 'Rutina actualizada por cambio de objetivos del usuario'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Rutina reasignada al usuario exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string', 
          example: 'Rutina reasignada exitosamente',
          description: 'Mensaje de confirmación de reasignación'
        },
        userRoutine: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-generado' },
            user_id: { type: 'string', example: 'uuid-del-usuario' },
            routine_id: { type: 'string', example: 'uuid-de-nueva-rutina' },
            startDate: { type: 'string', example: '2024-01-15T00:00:00.000Z' },
            endDate: { type: 'string', example: '2024-04-15T00:00:00.000Z', nullable: true },
            notes: { type: 'string', example: 'Rutina actualizada por cambio de objetivos', nullable: true },
            isActive: { type: 'boolean', example: true },
            createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
          },
          description: 'Información de la nueva asignación de rutina'
        },
        previousRoutines: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'uuid-rutina-anterior' },
              routine_id: { type: 'string', example: 'uuid-rutina-anterior' },
              isActive: { type: 'boolean', example: false }
            }
          },
          description: 'Lista de rutinas anteriores que fueron desactivadas'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['user_id debe ser un UUID válido'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario o rutina no encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuario no encontrado' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  async reassignRoutineToUser(@Body() reassignRoutineDto: ReassignRoutineDto) {
    const result = await this.routinesService.reassignRoutineToUser(reassignRoutineDto);
    
    // Obtener las rutinas anteriores que fueron desactivadas
    const previousRoutines = await this.routinesService.getUserRoutines(reassignRoutineDto.user_id);
    const deactivatedRoutines = previousRoutines.filter(routine => !routine.isActive);
    
    return {
      message: 'Rutina reasignada exitosamente',
      userRoutine: {
        id: result.id,
        user_id: result.user_id,
        routine_id: result.routine_id,
        startDate: result.startDate,
        endDate: result.endDate,
        notes: result.notes,
        isActive: result.isActive,
        createdAt: result.createdAt
      },
      previousRoutines: deactivatedRoutines.map(routine => ({
        id: routine.id,
        routine_id: routine.routine_id,
        isActive: routine.isActive
      }))
    };
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

  @Patch('user/update-duration')
  @ApiOperation({
    summary: 'Cambiar Duración de Rutina Asignada a Usuario',
    description: 'Actualiza las fechas de inicio y fin de una rutina asignada a un usuario específico. Permite modificar la duración de la rutina sin cambiar la rutina en sí.'
  })
  @ApiBody({
    type: UpdateRoutineDurationDto,
    description: 'Datos para cambiar la duración de la rutina del usuario',
    examples: {
      cambioDuracion1: {
        summary: 'Cambio de Duración de Rutina',
        value: {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          startDate: '2024-01-20',
          endDate: '2024-03-20',
          notes: 'Rutina extendida por 2 semanas debido al buen progreso del usuario'
        }
      },
      cambioDuracion2: {
        summary: 'Solo Cambio de Fecha de Fin',
        value: {
          userId: '123e4567-e89b-12d3-a456-426614174000',
          startDate: '2024-01-15',
          endDate: '2024-02-28',
          notes: 'Rutina acortada por cambio en objetivos'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Duración de rutina actualizada exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string', 
          example: 'Duración de rutina actualizada exitosamente',
          description: 'Mensaje de confirmación de actualización'
        },
        userRoutine: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-de-user-routine' },
            user_id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            routine_id: { type: 'string', example: 'uuid-de-rutina' },
            startDate: { type: 'string', example: '2024-01-20T00:00:00.000Z' },
            endDate: { type: 'string', example: '2024-03-20T00:00:00.000Z' },
            notes: { type: 'string', example: 'Rutina extendida por 2 semanas debido al buen progreso del usuario' },
            isActive: { type: 'boolean', example: true },
            updatedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z' }
          },
          description: 'Información actualizada de la rutina del usuario'
        },
        routine: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-de-rutina' },
            name: { type: 'string', example: 'Rutina de Fuerza' },
            description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
            totalWeeks: { type: 'number', example: 4 }
          },
          description: 'Información de la rutina asignada'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Datos de entrada inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['userId debe ser un UUID válido'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado o sin rutina activa',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuario no encontrado o no tiene rutina activa' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  async updateRoutineDuration(@Body() updateDurationDto: UpdateRoutineDurationDto) {
    const result = await this.routinesService.updateRoutineDuration(updateDurationDto);
    
    return {
      message: 'Duración de rutina actualizada exitosamente',
      userRoutine: {
        id: result.userRoutine.id,
        user_id: result.userRoutine.user_id,
        routine_id: result.userRoutine.routine_id,
        startDate: result.userRoutine.startDate,
        endDate: result.userRoutine.endDate,
        notes: result.userRoutine.notes,
        isActive: result.userRoutine.isActive,
        updatedAt: result.userRoutine.updatedAt
      },
      routine: {
        id: result.routine.id,
        name: result.routine.name,
        description: result.routine.description,
        totalWeeks: result.routine.totalWeeks
      }
    };
  }
}
