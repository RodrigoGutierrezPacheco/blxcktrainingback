import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiResponseProperty } from '@nestjs/swagger';
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
}
