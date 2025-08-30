import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { JwtGuard } from '../../auth/guards/jwt/jwt.guard';

@ApiTags('🏋️ Gestión de Ejercicios')
@ApiBearerAuth()
@Controller('exercises')
@UseGuards(JwtGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear Nuevo Ejercicio',
    description: 'Crea un nuevo ejercicio en el sistema, asociándolo a un grupo muscular específico.'
  })
  @ApiBody({
    type: CreateExerciseDto,
    description: 'Datos del ejercicio a crear',
    examples: {
      ejercicio1: {
        summary: 'Ejercicio de Ejemplo',
        value: {
          name: 'Press de Banca',
          description: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores. Se realiza acostado en un banco plano.',
          image: {
            type: 'jpg',
            url: 'https://ejemplo.com/press-banca.jpg'
          },
          muscleGroupId: 'uuid-del-grupo-muscular'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Ejercicio creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-generado' },
        name: { type: 'string', example: 'Press de Banca' },
        description: { type: 'string', example: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores. Se realiza acostado en un banco plano.' },
        image: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'jpg' },
            url: { type: 'string', example: 'https://ejemplo.com/press-banca.jpg' }
          }
        },
        muscleGroupId: { type: 'string', example: 'uuid-del-grupo-muscular' },
        muscleGroupName: { type: 'string', example: 'Pecho' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Grupo muscular no encontrado' })
  create(@Body() createDto: CreateExerciseDto) {
    return this.exercisesService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener Todos los Ejercicios',
    description: 'Obtiene la lista completa de todos los ejercicios, tanto activos como inactivos.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ejercicios obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-ejercicio' },
          name: { type: 'string', example: 'Press de Banca' },
          description: { type: 'string', example: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores.' },
          image: {
            type: 'object',
            nullable: true,
            properties: {
              type: { type: 'string', example: 'jpg' },
              url: { type: 'string', example: 'https://ejemplo.com/press-banca.jpg' }
            }
          },
          muscleGroupId: { type: 'string', example: 'uuid-del-grupo-muscular' },
          muscleGroupName: { type: 'string', example: 'Pecho' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  findAll() {
    return this.exercisesService.findAll();
  }

  @Get('active')
  @ApiOperation({
    summary: 'Obtener Solo Ejercicios Activos',
    description: 'Obtiene la lista de ejercicios que están activos (isActive = true).'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ejercicios activos obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-ejercicio' },
          name: { type: 'string', example: 'Press de Banca' },
          description: { type: 'string', example: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores.' },
          image: {
            type: 'object',
            nullable: true,
            properties: {
              type: { type: 'string', example: 'jpg' },
              url: { type: 'string', example: 'https://ejemplo.com/press-banca.jpg' }
            }
          },
          muscleGroupId: { type: 'string', example: 'uuid-del-grupo-muscular' },
          muscleGroupName: { type: 'string', example: 'Pecho' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  findAllActive() {
    return this.exercisesService.findAllActive();
  }

  @Get('all')
  findAllIncludingInactive() {
    return this.exercisesService.findAllIncludingInactive();
  }

  @Get('muscle-group/:muscleGroupId')
  @ApiOperation({
    summary: 'Obtener Ejercicios por Grupo Muscular',
    description: 'Obtiene todos los ejercicios que pertenecen a un grupo muscular específico.'
  })
  @ApiParam({
    name: 'muscleGroupId',
    description: 'ID del grupo muscular',
    example: 'uuid-del-grupo-muscular',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Ejercicios del grupo muscular obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-ejercicio' },
          name: { type: 'string', example: 'Press de Banca' },
          description: { type: 'string', example: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores.' },
          image: {
            type: 'object',
            nullable: true,
            properties: {
              type: { type: 'string', example: 'jpg' },
              url: { type: 'string', example: 'https://ejemplo.com/press-banca.jpg' }
            }
          },
          muscleGroupId: { type: 'string', example: 'uuid-del-grupo-muscular' },
          muscleGroupName: { type: 'string', example: 'Pecho' },
          isActive: { type: 'boolean', example: true }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Grupo muscular no encontrado' })
  findByMuscleGroup(@Param('muscleGroupId') muscleGroupId: string) {
    return this.exercisesService.findByMuscleGroup(muscleGroupId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener Ejercicio por ID',
    description: 'Obtiene un ejercicio específico por su ID único.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del ejercicio',
    example: 'uuid-del-ejercicio',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Ejercicio encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-ejercicio' },
        name: { type: 'string', example: 'Press de Banca' },
        description: { type: 'string', example: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores. Se realiza acostado en un banco plano.' },
        image: {
          type: 'object',
          nullable: true,
          properties: {
            type: { type: 'string', example: 'jpg' },
            url: { type: 'string', example: 'https://ejemplo.com/press-banca.jpg' }
          }
        },
        muscleGroupId: { type: 'string', example: 'uuid-del-grupo-muscular' },
        muscleGroupName: { type: 'string', example: 'Pecho' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado' })
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar Ejercicio',
    description: 'Actualiza la información de un ejercicio específico.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del ejercicio a actualizar',
    example: 'uuid-del-ejercicio',
    required: true
  })
  @ApiBody({
    type: UpdateExerciseDto,
    description: 'Datos a actualizar del ejercicio',
    examples: {
      actualizacion1: {
        summary: 'Actualización de Ejercicio',
        value: {
          name: 'Press de Banca con Barra',
          description: 'Descripción actualizada del press de banca...',
          muscleGroupId: 'nuevo-uuid-grupo-muscular'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Ejercicio actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-ejercicio' },
        name: { type: 'string', example: 'Press de Banca con Barra' },
        description: { type: 'string', example: 'Descripción actualizada del press de banca...' },
        image: {
          type: 'object',
          nullable: true,
          properties: {
            type: { type: 'string', example: 'jpg' },
            url: { type: 'string', example: 'https://ejemplo.com/press-banca.jpg' }
          }
        },
        muscleGroupId: { type: 'string', example: 'nuevo-uuid-grupo-muscular' },
        muscleGroupName: { type: 'string', example: 'Pecho' },
        isActive: { type: 'boolean', example: true },
        updatedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Ejercicio o grupo muscular no encontrado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateExerciseDto) {
    return this.exercisesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar Ejercicio (Soft Delete)',
    description: 'Elimina un ejercicio del sistema. Esta operación realiza un soft delete, marcando el ejercicio como inactivo en lugar de eliminarlo permanentemente.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del ejercicio a eliminar',
    example: 'uuid-del-ejercicio',
    required: true
  })
  @ApiResponse({
    status: 204,
    description: 'Ejercicio eliminado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado' })
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activar Ejercicio',
    description: 'Activa un ejercicio que estaba inactivo, marcándolo como activo (isActive = true).'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del ejercicio a activar',
    example: 'uuid-del-ejercicio',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Ejercicio activado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-ejercicio' },
        name: { type: 'string', example: 'Press de Banca' },
        description: { type: 'string', example: 'Ejercicio compuesto para el pecho...' },
        muscleGroupId: { type: 'string', example: 'uuid-del-grupo-muscular' },
        muscleGroupName: { type: 'string', example: 'Pecho' },
        isActive: { type: 'boolean', example: true },
        updatedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado' })
  activate(@Param('id') id: string) {
    return this.exercisesService.activate(id);
  }

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cambiar Status de Ejercicio',
    description: 'Cambia el estado activo/inactivo de un ejercicio. Si está activo lo desactiva, si está inactivo lo activa.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del ejercicio',
    example: 'uuid-del-ejercicio',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Status del ejercicio cambiado exitosamente',
    schema: {
      type: 'object',
      properties: {
        isActive: { type: 'boolean', example: false }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado' })
  toggleStatus(@Param('id') id: string) {
    return this.exercisesService.toggleStatus(id);
  }
}
