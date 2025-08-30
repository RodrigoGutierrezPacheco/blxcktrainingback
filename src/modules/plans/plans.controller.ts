import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { JwtGuard } from '../../auth/guards/jwt/jwt.guard';

@ApiTags('💰 Gestión de Planes')
@ApiBearerAuth()
@Controller('plans')
@UseGuards(JwtGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear Nuevo Plan',
    description: 'Crea un nuevo plan de suscripción en el sistema.'
  })
  @ApiBody({
    type: CreatePlanDto,
    description: 'Datos del plan a crear',
    examples: {
      plan1: {
        summary: 'Plan de Usuario',
        value: {
          name: 'Plan Básico',
          price: 29.99,
          duration: 'monthly',
          detail: 'Plan básico para usuarios que quieren empezar su entrenamiento',
          type: 'user',
          features: ['Acceso a rutinas básicas', 'Soporte por email'],
          badge: {
            color: 'blue',
            name: 'Básico'
          },
          image: {
            type: 'jpg',
            url: 'https://ejemplo.com/plan-basico.jpg'
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Plan creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-generado' },
        name: { type: 'string', example: 'Plan Básico' },
        price: { type: 'number', example: 29.99 },
        duration: { type: 'string', example: 'monthly' },
        detail: { type: 'string', example: 'Plan básico para usuarios que quieren empezar su entrenamiento' },
        type: { type: 'string', example: 'user' },
        features: { type: 'array', items: { type: 'string' }, example: ['Acceso a rutinas básicas', 'Soporte por email'] },
        badge: {
          type: 'object',
          properties: {
            color: { type: 'string', example: 'blue' },
            name: { type: 'string', example: 'Básico' }
          }
        },
        image: {
          type: 'object',
          properties: {
            type: { type: 'string', example: 'jpg' },
            url: { type: 'string', example: 'https://ejemplo.com/plan-basico.jpg' }
          }
        },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener Todos los Planes Activos',
    description: 'Obtiene la lista de todos los planes activos en el sistema.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de planes activos obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-plan' },
          name: { type: 'string', example: 'Plan Básico' },
          price: { type: 'number', example: 29.99 },
          duration: { type: 'string', example: 'monthly' },
          detail: { type: 'string', example: 'Plan básico para usuarios que quieren empezar su entrenamiento' },
          type: { type: 'string', example: 'user' },
          features: { type: 'array', items: { type: 'string' }, example: ['Acceso a rutinas básicas', 'Soporte por email'] },
          badge: {
            type: 'object',
            properties: {
              color: { type: 'string', example: 'blue' },
              name: { type: 'string', example: 'Básico' }
            }
          },
          image: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'jpg' },
              url: { type: 'string', example: 'https://ejemplo.com/plan-basico.jpg' }
            }
          },
          isActive: { type: 'boolean', example: true }
        }
      }
    }
  })
  findAll() {
    return this.plansService.findAll();
  }

  @Get('all')
  findAllIncludingInactive() {
    return this.plansService.findAllIncludingInactive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.plansService.softDelete(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.plansService.activate(id);
  }

  @Get('search/price-range')
  @ApiOperation({
    summary: 'Buscar Planes por Rango de Precio',
    description: 'Obtiene planes que se encuentran dentro de un rango de precios específico.'
  })
  @ApiQuery({
    name: 'minPrice',
    description: 'Precio mínimo del rango',
    example: '10.00',
    required: true
  })
  @ApiQuery({
    name: 'maxPrice',
    description: 'Precio máximo del rango',
    example: '100.00',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Planes encontrados por rango de precio',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-plan' },
          name: { type: 'string', example: 'Plan Básico' },
          price: { type: 'number', example: 29.99 },
          duration: { type: 'string', example: 'monthly' },
          type: { type: 'string', example: 'user' },
          isActive: { type: 'boolean', example: true }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Los precios deben ser números válidos' })
  findByPriceRange(
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    
    if (isNaN(min) || isNaN(max)) {
      throw new Error('minPrice and maxPrice must be valid numbers');
    }
    
    return this.plansService.findByPriceRange(min, max);
  }

  @Get('search/duration/:duration')
  @ApiOperation({
    summary: 'Buscar Planes por Duración',
    description: 'Obtiene planes que tienen una duración específica (monthly, yearly, etc.).'
  })
  @ApiParam({
    name: 'duration',
    description: 'Duración del plan',
    example: 'monthly',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Planes encontrados por duración',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-plan' },
          name: { type: 'string', example: 'Plan Básico' },
          price: { type: 'number', example: 29.99 },
          duration: { type: 'string', example: 'monthly' },
          type: { type: 'string', example: 'user' },
          isActive: { type: 'boolean', example: true }
        }
      }
    }
  })
  findByDuration(@Param('duration') duration: string) {
    return this.plansService.findByDuration(duration);
  }

  @Get('type/:type')
  @ApiOperation({
    summary: 'Buscar Planes por Tipo',
    description: 'Obtiene planes que son específicos para un tipo de usuario (user o trainer).'
  })
  @ApiParam({
    name: 'type',
    description: 'Tipo de plan (user o trainer)',
    example: 'user',
    required: true,
    enum: ['user', 'trainer']
  })
  @ApiResponse({
    status: 200,
    description: 'Planes encontrados por tipo',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-plan' },
          name: { type: 'string', example: 'Plan Básico' },
          price: { type: 'number', example: 29.99 },
          duration: { type: 'string', example: 'monthly' },
          type: { type: 'string', example: 'user' },
          isActive: { type: 'boolean', example: true }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'El tipo debe ser "user" o "trainer"' })
  findByType(@Param('type') type: 'user' | 'trainer') {
    if (!['user', 'trainer'].includes(type)) {
      throw new Error('Type must be either "user" or "trainer"');
    }
    return this.plansService.findByType(type);
  }

  @Get('search/type/:type/price-range')
  @ApiOperation({
    summary: 'Buscar Planes por Tipo y Rango de Precio',
    description: 'Obtiene planes de un tipo específico que se encuentran dentro de un rango de precios.'
  })
  @ApiParam({
    name: 'type',
    description: 'Tipo de plan (user o trainer)',
    example: 'user',
    required: true,
    enum: ['user', 'trainer']
  })
  @ApiQuery({
    name: 'minPrice',
    description: 'Precio mínimo del rango',
    example: '10.00',
    required: true
  })
  @ApiQuery({
    name: 'maxPrice',
    description: 'Precio máximo del rango',
    example: '100.00',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Planes encontrados por tipo y rango de precio',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-plan' },
          name: { type: 'string', example: 'Plan Básico' },
          price: { type: 'number', example: 29.99 },
          duration: { type: 'string', example: 'monthly' },
          type: { type: 'string', example: 'user' },
          isActive: { type: 'boolean', example: true }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'El tipo debe ser "user" o "trainer" o los precios deben ser números válidos' })
  findByTypeAndPriceRange(
    @Param('type') type: 'user' | 'trainer',
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    if (!['user', 'trainer'].includes(type)) {
      throw new Error('Type must be either "user" or "trainer"');
    }
    
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    
    if (isNaN(min) || isNaN(max)) {
      throw new Error('minPrice and maxPrice must be valid numbers');
    }
    
    return this.plansService.findByTypeAndPriceRange(type, min, max);
  }
}
