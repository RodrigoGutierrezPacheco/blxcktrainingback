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
import { MuscleGroupsService } from './muscle-groups.service';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';
import { UpdateMuscleGroupDto } from './dto/update-muscle-group.dto';
import { JwtGuard } from '../../auth/guards/jwt/jwt.guard';

@ApiTags('💪 Gestión de Grupos Musculares')
@ApiBearerAuth()
@Controller('muscle-groups')
@UseGuards(JwtGuard)
export class MuscleGroupsController {
  constructor(private readonly muscleGroupsService: MuscleGroupsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear Nuevo Grupo Muscular',
    description: 'Crea un nuevo grupo muscular en el sistema para categorizar ejercicios.'
  })
  @ApiBody({
    type: CreateMuscleGroupDto,
    description: 'Datos del grupo muscular a crear',
    examples: {
      grupo1: {
        summary: 'Grupo Muscular Ejemplo',
        value: {
          title: 'Pecho',
          description: 'Grupo muscular del pecho que incluye pectoral mayor, pectoral menor y serrato anterior. Fundamental para ejercicios de empuje y desarrollo de la parte superior del cuerpo.'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Grupo muscular creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-generado' },
        title: { type: 'string', example: 'Pecho' },
        description: { type: 'string', example: 'Grupo muscular del pecho que incluye pectoral mayor, pectoral menor y serrato anterior. Fundamental para ejercicios de empuje y desarrollo de la parte superior del cuerpo.' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createDto: CreateMuscleGroupDto) {
    return this.muscleGroupsService.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener Todos los Grupos Musculares',
    description: 'Obtiene la lista completa de todos los grupos musculares, tanto activos como inactivos.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos musculares obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-grupo' },
          title: { type: 'string', example: 'Pecho' },
          description: { type: 'string', example: 'Grupo muscular del pecho que incluye pectoral mayor, pectoral menor y serrato anterior.' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  findAll() {
    return this.muscleGroupsService.findAll();
  }

  @Get('active')
  @ApiOperation({
    summary: 'Obtener Solo Grupos Musculares Activos',
    description: 'Obtiene la lista de grupos musculares que están activos (isActive = true).'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos musculares activos obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-grupo' },
          title: { type: 'string', example: 'Pecho' },
          description: { type: 'string', example: 'Grupo muscular del pecho que incluye pectoral mayor, pectoral menor y serrato anterior.' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  findAllActive() {
    return this.muscleGroupsService.findAllActive();
  }

  @Get('all')
  @ApiOperation({
    summary: 'Obtener Todos los Grupos Musculares (Incluyendo Inactivos)',
    description: 'Obtiene la lista completa de todos los grupos musculares, tanto activos como inactivos. Alias del endpoint principal.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista completa de grupos musculares obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-grupo' },
          title: { type: 'string', example: 'Pecho' },
          description: { type: 'string', example: 'Grupo muscular del pecho que incluye pectoral mayor, pectoral menor y serrato anterior.' },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  findAllIncludingInactive() {
    return this.muscleGroupsService.findAllIncludingInactive();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener Grupo Muscular por ID',
    description: 'Obtiene un grupo muscular específico por su ID único.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del grupo muscular',
    example: 'uuid-del-grupo',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo muscular encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-grupo' },
        title: { type: 'string', example: 'Pecho' },
        description: { type: 'string', example: 'Grupo muscular del pecho que incluye pectoral mayor, pectoral menor y serrato anterior. Fundamental para ejercicios de empuje y desarrollo de la parte superior del cuerpo.' },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Grupo muscular no encontrado' })
  findOne(@Param('id') id: string) {
    return this.muscleGroupsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar Grupo Muscular',
    description: 'Actualiza la información de un grupo muscular específico.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo muscular a actualizar',
    example: 'uuid-del-grupo',
    required: true
  })
  @ApiBody({
    type: UpdateMuscleGroupDto,
    description: 'Datos a actualizar del grupo muscular',
    examples: {
      actualizacion1: {
        summary: 'Actualización de Grupo Muscular',
        value: {
          title: 'Pecho Superior',
          description: 'Descripción actualizada del grupo muscular del pecho...'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo muscular actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-grupo' },
        title: { type: 'string', example: 'Pecho Superior' },
        description: { type: 'string', example: 'Descripción actualizada del grupo muscular del pecho...' },
        isActive: { type: 'boolean', example: true },
        updatedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Grupo muscular no encontrado' })
  update(@Param('id') id: string, @Body() updateDto: UpdateMuscleGroupDto) {
    return this.muscleGroupsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar Grupo Muscular (Soft Delete)',
    description: 'Elimina un grupo muscular del sistema. Esta operación realiza un soft delete, marcando el grupo como inactivo en lugar de eliminarlo permanentemente.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo muscular a eliminar',
    example: 'uuid-del-grupo',
    required: true
  })
  @ApiResponse({
    status: 204,
    description: 'Grupo muscular eliminado exitosamente'
  })
  @ApiResponse({ status: 404, description: 'Grupo muscular no encontrado' })
  remove(@Param('id') id: string) {
    return this.muscleGroupsService.remove(id);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activar Grupo Muscular',
    description: 'Activa un grupo muscular que estaba inactivo, marcándolo como activo (isActive = true).'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo muscular a activar',
    example: 'uuid-del-grupo',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Grupo muscular activado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-grupo' },
        title: { type: 'string', example: 'Pecho' },
        description: { type: 'string', example: 'Grupo muscular del pecho...' },
        isActive: { type: 'boolean', example: true },
        updatedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Grupo muscular no encontrado' })
  activate(@Param('id') id: string) {
    return this.muscleGroupsService.activate(id);
  }

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Cambiar Status de Grupo Muscular',
    description: 'Cambia el estado activo/inactivo de un grupo muscular. Si está activo lo desactiva, si está inactivo lo activa.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del grupo muscular',
    example: 'uuid-del-grupo',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Status del grupo muscular cambiado exitosamente',
    schema: {
      type: 'object',
      properties: {
        isActive: { type: 'boolean', example: false }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Grupo muscular no encontrado' })
  toggleStatus(@Param('id') id: string) {
    return this.muscleGroupsService.toggleStatus(id);
  }
}
