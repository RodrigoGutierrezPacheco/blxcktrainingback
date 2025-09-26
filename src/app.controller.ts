import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('🏠 Información General')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'Información General de la API',
    description: 'Endpoint principal que proporciona información básica sobre la API de BLXCK Training'
  })
  @ApiResponse({
    status: 200,
    description: 'Información de la API obtenida exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Bienvenido a la API de BLXCK Training'
        },
        version: {
          type: 'string',
          example: '1.0.0'
        },
        status: {
          type: 'string',
          example: 'Activo'
        }
      }
    }
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Health Check',
    description: 'Endpoint para verificar el estado de la aplicación'
  })
  @ApiResponse({
    status: 200,
    description: 'Aplicación funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          example: 'ok'
        },
        timestamp: {
          type: 'string',
          example: '2024-01-01T10:00:00.000Z'
        }
      }
    }
  })
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}
