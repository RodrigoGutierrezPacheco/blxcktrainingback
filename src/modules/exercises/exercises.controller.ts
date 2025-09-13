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
import { CreateExerciseWithImageDto } from './dto/create-exercise-with-image.dto';
import { CreateExerciseWithImageIdDto } from './dto/create-exercise-with-image-id.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { UpdateExerciseWithImageDto } from './dto/update-exercise-with-image.dto';
import { DeleteExerciseByImageDto } from './dto/delete-exercise-by-image.dto';
import { UnassignImageFromExerciseDto } from './dto/unassign-image-from-exercise.dto';
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
    description: 'Crea un nuevo ejercicio en el sistema, asociándolo a un grupo muscular específico. Puede usar imageId para asignar una imagen de media_assets o image para URL personalizada.'
  })
  @ApiBody({
    type: CreateExerciseDto,
    description: 'Datos del ejercicio a crear',
    examples: {
      ejercicioConImageId: {
        summary: 'Ejercicio con ID de Imagen',
        value: {
          name: 'Press de Banca',
          description: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores.',
          imageId: 'ef2e0482-95a2-43e7-a6e8-46450b0ccc2d',
          muscleGroupId: '123e4567-e89b-12d3-a456-426614174000'
        }
      },
      ejercicioConImageUrl: {
        summary: 'Ejercicio con URL de Imagen',
        value: {
          name: 'Flexiones',
          description: 'Ejercicio de peso corporal para el pecho, tríceps y deltoides anteriores.',
          image: {
            type: 'jpg',
            url: 'https://ejemplo.com/flexiones.jpg'
          },
          muscleGroupId: '123e4567-e89b-12d3-a456-426614174000'
        }
      },
      ejercicioSinImagen: {
        summary: 'Ejercicio sin Imagen',
        value: {
          name: 'Plancha',
          description: 'Ejercicio isométrico para fortalecer el core.',
          muscleGroupId: '123e4567-e89b-12d3-a456-426614174000'
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

  @Post('with-image')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear Ejercicio con Imagen de Firebase',
    description: 'Crea un nuevo ejercicio asociándolo a un grupo muscular y una imagen existente en Firebase Storage. La imagen debe estar registrada en la base de datos de media assets.'
  })
  @ApiBody({
    type: CreateExerciseWithImageDto,
    description: 'Datos del ejercicio a crear con imagen de Firebase',
    examples: {
      ejercicioConImagen: {
        summary: 'Ejercicio con Imagen de Firebase',
        value: {
          name: 'Press de Banca',
          description: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores. Se realiza acostado en un banco plano.',
          muscleGroupId: '123e4567-e89b-12d3-a456-426614174000',
          imagePath: 'Ejercicios/Pecho/press-banca.gif'
        }
      },
      ejercicioSinImagen: {
        summary: 'Ejercicio sin Imagen',
        value: {
          name: 'Flexiones',
          description: 'Ejercicio de peso corporal para el pecho, tríceps y deltoides anteriores.',
          muscleGroupId: '123e4567-e89b-12d3-a456-426614174000'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Ejercicio creado exitosamente con imagen de Firebase',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-generado' },
        name: { type: 'string', example: 'Press de Banca' },
        description: { type: 'string', example: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores. Se realiza acostado en un banco plano.' },
        image: {
          type: 'object',
          nullable: true,
          properties: {
            type: { type: 'string', example: 'gif' },
            url: { type: 'string', example: 'https://storage.googleapis.com/...&X-Goog-Expires=...' }
          }
        },
        muscleGroupId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        muscleGroupName: { type: 'string', example: 'Pecho' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Grupo muscular o imagen no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe un ejercicio con este nombre' })
  createWithImage(@Body() createDto: CreateExerciseWithImageDto) {
    return this.exercisesService.createWithImage(createDto);
  }

  @Post('with-image-id')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear Ejercicio con ID de Imagen',
    description: 'Crea un nuevo ejercicio usando el ID de una imagen existente en media_assets. La imagen se marcará automáticamente como asignada (isAssigned: true).'
  })
  @ApiBody({
    type: CreateExerciseWithImageIdDto,
    description: 'Datos del ejercicio a crear con ID de imagen',
    examples: {
      ejercicioConImagenId: {
        summary: 'Ejercicio con ID de Imagen',
        value: {
          name: 'Press de Banca',
          description: 'Ejercicio compuesto para el pecho que involucra pectoral mayor, tríceps y deltoides anteriores.',
          muscleGroupId: '123e4567-e89b-12d3-a456-426614174000',
          imageId: 'ef2e0482-95a2-43e7-a6e8-46450b0ccc2d'
        }
      },
      ejercicioSinImagen: {
        summary: 'Ejercicio sin Imagen',
        value: {
          name: 'Flexiones',
          description: 'Ejercicio de peso corporal para el pecho, tríceps y deltoides anteriores.',
          muscleGroupId: '123e4567-e89b-12d3-a456-426614174000'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Ejercicio creado exitosamente con imagen por ID',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-generado' },
        name: { type: 'string', example: 'Press de Banca' },
        description: { type: 'string', example: 'Ejercicio compuesto para el pecho...' },
        image: {
          type: 'object',
          nullable: true,
          properties: {
            type: { type: 'string', example: 'gif' },
            url: { type: 'string', example: 'https://storage.googleapis.com/...&X-Goog-Expires=...' }
          }
        },
        muscleGroupId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        muscleGroupName: { type: 'string', example: 'Pecho' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Grupo muscular o imagen no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un ejercicio con este nombre' })
  createWithImageId(@Body() createDto: CreateExerciseWithImageIdDto) {
    return this.exercisesService.createWithImageId(createDto);
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

  @Get('folders')
  @ApiOperation({
    summary: 'Obtener Carpetas de Ejercicios con Conteo',
    description: 'Obtiene todas las carpetas (grupos musculares) existentes y el número de ejercicios en cada una.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de carpetas de ejercicios con conteo obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-grupo-muscular' },
          title: { type: 'string', example: 'Pecho' },
          description: { type: 'string', example: 'Grupo muscular del pecho' },
          exerciseCount: { type: 'number', example: 15 },
          isActive: { type: 'boolean', example: true }
        }
      }
    }
  })
  getExerciseFolders() {
    return this.exercisesService.getExerciseFolders();
  }

  @Get('folders/:folderId/exercises')
  @ApiOperation({
    summary: 'Obtener Ejercicios por ID de Carpeta',
    description: 'Obtiene todos los ejercicios activos de una carpeta específica usando su UUID.'
  })
  @ApiParam({
    name: 'folderId',
    description: 'ID (UUID) de la carpeta (grupo muscular)',
    example: 'uuid-del-grupo-muscular',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Ejercicios de la carpeta obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-ejercicio' },
          name: { type: 'string', example: 'Press de Banca' },
          description: { type: 'string', example: 'Ejercicio compuesto para el pecho...' },
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
  @ApiResponse({ status: 404, description: 'Carpeta no encontrada' })
  getExercisesByFolderId(@Param('folderId') folderId: string) {
    return this.exercisesService.getExercisesByFolderId(folderId);
  }

  @Get('folders/by-name/:folderName/exercises')
  @ApiOperation({
    summary: 'Obtener Ejercicios por Nombre de Carpeta',
    description: 'Obtiene todos los ejercicios activos de una carpeta específica usando su nombre (título).'
  })
  @ApiParam({
    name: 'folderName',
    description: 'Nombre de la carpeta (grupo muscular)',
    example: 'Pecho',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Ejercicios de la carpeta obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-ejercicio' },
          name: { type: 'string', example: 'Press de Banca' },
          description: { type: 'string', example: 'Ejercicio compuesto para el pecho...' },
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
  @ApiResponse({ status: 404, description: 'Carpeta no encontrada' })
  getExercisesByFolderName(@Param('folderName') folderName: string) {
    return this.exercisesService.getExercisesByFolderName(folderName);
  }

  @Get(':id/image')
  @ApiOperation({
    summary: 'Obtener Imagen de Ejercicio',
    description: 'Obtiene la imagen de un ejercicio específico por su UUID. Devuelve la información completa de la imagen incluyendo URL firmada.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del ejercicio',
    example: 'uuid-del-ejercicio',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen del ejercicio obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        exerciseId: { type: 'string', example: 'uuid-del-ejercicio' },
        exerciseName: { type: 'string', example: 'Press de Banca' },
        image: {
          type: 'object',
          nullable: true,
          properties: {
            type: { type: 'string', example: 'jpg' },
            url: { type: 'string', example: 'https://storage.googleapis.com/...' },
            imageId: { type: 'string', example: 'uuid-de-la-imagen' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Ejercicio no encontrado' })
  @ApiResponse({ status: 404, description: 'El ejercicio no tiene imagen asociada' })
  getExerciseImage(@Param('id') id: string) {
    return this.exercisesService.getExerciseImage(id);
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

  @Patch('unassign-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desasignar Imagen y Eliminar Ejercicio',
    description: 'SIEMPRE desasigna la imagen (isAssigned: false) y elimina el ejercicio si existe y está activo. La imagen se marca como no asignada independientemente del estado del ejercicio.'
  })
  @ApiBody({
    type: UnassignImageFromExerciseDto,
    description: 'IDs del ejercicio y la imagen a desasignar y eliminar',
    examples: {
      desasignarImagen: {
        summary: 'Desasignar imagen y eliminar ejercicio',
        value: {
          exerciseId: '16505f64-d83c-47f0-8bc9-325a1402debc',
          imageId: 'b59d7cbb-87df-4484-b000-4af622e7038b'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen desasignada exitosamente. El ejercicio se elimina si existe y está activo.',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Imagen desasignada exitosamente y ejercicio eliminado permanentemente',
          description: 'Mensaje que varía según el escenario: imagen desasignada + estado del ejercicio'
        },
        exerciseId: {
          type: 'string',
          format: 'uuid',
          example: '16505f64-d83c-47f0-8bc9-325a1402debc',
          description: 'ID del ejercicio proporcionado'
        },
        imageId: {
          type: 'string',
          format: 'uuid',
          example: 'b59d7cbb-87df-4484-b000-4af622e7038b',
          description: 'ID de la imagen que fue marcada como no asignada'
        }
      }
    }
  })
  unassignImageFromExercise(@Body() unassignDto: UnassignImageFromExerciseDto) {
    return this.exercisesService.unassignImageFromExercise(unassignDto.exerciseId, unassignDto.imageId);
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

  @Patch(':id/with-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar Ejercicio con Imagen de Firebase',
    description: 'Actualiza un ejercicio existente, incluyendo la posibilidad de cambiar su imagen por una de Firebase Storage. La imagen debe estar registrada en la base de datos de media assets.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del ejercicio a actualizar',
    example: 'uuid-del-ejercicio',
    required: true
  })
  @ApiBody({
    type: UpdateExerciseWithImageDto,
    description: 'Datos a actualizar del ejercicio con imagen de Firebase',
    examples: {
      actualizacionConImagen: {
        summary: 'Actualización con Nueva Imagen',
        value: {
          name: 'Press de Banca Inclinado',
          description: 'Ejercicio compuesto para el pecho en banco inclinado que involucra pectoral mayor, tríceps y deltoides anteriores.',
          muscleGroupId: '123e4567-e89b-12d3-a456-426614174000',
          imagePath: 'Ejercicios/Pecho/press-banca-inclinado.gif'
        }
      },
      actualizacionSinImagen: {
        summary: 'Actualización sin Cambiar Imagen',
        value: {
          name: 'Press de Banca con Barra',
          description: 'Descripción actualizada del press de banca con barra...',
          muscleGroupId: '123e4567-e89b-12d3-a456-426614174000'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Ejercicio actualizado exitosamente con imagen de Firebase',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-ejercicio' },
        name: { type: 'string', example: 'Press de Banca Inclinado' },
        description: { type: 'string', example: 'Ejercicio compuesto para el pecho en banco inclinado...' },
        image: {
          type: 'object',
          nullable: true,
          properties: {
            type: { type: 'string', example: 'gif' },
            url: { type: 'string', example: 'https://storage.googleapis.com/...&X-Goog-Expires=...' }
          }
        },
        muscleGroupId: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
        muscleGroupName: { type: 'string', example: 'Pecho' },
        isActive: { type: 'boolean', example: true },
        updatedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Ejercicio, grupo muscular o imagen no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un ejercicio con este nombre' })
  updateWithImage(@Param('id') id: string, @Body() updateDto: UpdateExerciseWithImageDto) {
    return this.exercisesService.updateWithImage(id, updateDto);
  }

  @Delete('by-image')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Eliminar Ejercicio por ImageId',
    description: 'Elimina un ejercicio del sistema basándose en el ID de la imagen asociada. Marca la imagen como no asignada (isAssigned: false) y realiza soft delete del ejercicio.'
  })
  @ApiBody({
    type: DeleteExerciseByImageDto,
    description: 'ID de la imagen asociada al ejercicio a eliminar',
    examples: {
      eliminarPorImagen: {
        summary: 'Eliminar ejercicio por ID de imagen',
        value: {
          imageId: 'b59d7cbb-87df-4484-b000-4af622e7038b'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Ejercicio eliminado exitosamente y imagen marcada como no asignada',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Ejercicio eliminado exitosamente y imagen marcada como no asignada'
        },
        exerciseId: {
          type: 'string',
          format: 'uuid',
          example: '16505f64-d83c-47f0-8bc9-325a1402debc',
          description: 'ID del ejercicio eliminado'
        },
        imageId: {
          type: 'string',
          format: 'uuid',
          example: 'b59d7cbb-87df-4484-b000-4af622e7038b',
          description: 'ID de la imagen que fue marcada como no asignada'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'No se encontró un ejercicio activo con esta imagen asignada' 
  })
  removeByImageId(@Body() deleteDto: DeleteExerciseByImageDto) {
    return this.exercisesService.removeByImageId(deleteDto.imageId);
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
