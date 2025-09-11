import { Controller, Post, Body, Get, Query, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MediaAssetsService } from './media-assets.service';
import { UpsertMediaAssetDto } from './dto/upsert-media-asset.dto';
import { MediaAsset } from './entities/media-asset.entity';
import { FirebaseStorageService } from '../../common/firebase/firebase-storage.service';

@ApiTags('🖼️ Media Assets')
@ApiBearerAuth()
@Controller('media-assets')
export class MediaAssetsController {
  constructor(
    private readonly mediaService: MediaAssetsService,
    private readonly storage: FirebaseStorageService,
  ) {}

  @Post('upsert')
  @ApiOperation({ summary: 'Crear/Actualizar metadatos de imagen/GIF', description: 'Guarda nombre y descripción para un archivo (separado por folder). Si el filePath ya existe, actualiza los datos.' })
  @ApiBody({ type: UpsertMediaAssetDto })
  @ApiResponse({ status: 200, description: 'Metadatos guardados', type: MediaAsset })
  upsert(@Body() dto: UpsertMediaAssetDto) {
    return this.mediaService.upsert(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar metadatos de todos los archivos' })
  @ApiResponse({ status: 200, description: 'Listado de metadatos', type: [MediaAsset] })
  getAll() {
    return this.mediaService.getAll();
  }

  @Get('by-folder')
  @ApiOperation({ 
    summary: 'Listar metadatos por carpeta con URLs firmadas', 
    description: 'Obtiene todas las imágenes de una carpeta específica con URLs firmadas temporales de Firebase Storage'
  })
  @ApiQuery({ name: 'folder', example: 'Biceps', required: true, description: 'Nombre de la carpeta (ej: Biceps, Pecho, Cardio, etc.)' })
  @ApiQuery({ name: 'expirationMinutes', example: 60, required: false, description: 'Minutos de expiración para las URLs firmadas (por defecto 60)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de imágenes de la carpeta con URLs firmadas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'ef2e0482-95a2-43e7-a6e8-46450b0ccc2d' },
          folder: { type: 'string', example: 'Biceps' },
          filePath: { type: 'string', example: 'Ejercicios/Biceps/Barbell-Curl-On-Arm-Blaster.gif' },
          url: { type: 'string', example: 'https://storage.googleapis.com/...&X-Goog-Expires=...' },
          name: { type: 'string', example: 'Curl con Barra en Arm Blaster' },
          description: { type: 'string', example: 'Ejercicio para bíceps con barra en arm blaster' },
          isAssigned: { type: 'boolean', example: false },
          createdAt: { type: 'string', example: '2025-09-05T03:53:56.958Z' },
          updatedAt: { type: 'string', example: '2025-09-05T03:53:56.958Z' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Carpeta no encontrada' })
  async getByFolder(
    @Query('folder') folder: string, 
    @Query('expirationMinutes') expirationMinutes = 60
  ) {
    return this.mediaService.getByFolderWithAssignmentStatus(folder, Number(expirationMinutes) || 60);
  }

  @Get('by-folder-with-signed-urls')
  @ApiOperation({ 
    summary: 'Listar imágenes de una carpeta con URLs firmadas', 
    description: 'Obtiene todas las imágenes de una carpeta específica con URLs firmadas temporales de Firebase Storage'
  })
  @ApiQuery({ name: 'folder', example: 'Biceps', required: true, description: 'Nombre de la carpeta (ej: Biceps, Pecho, Cardio, etc.)' })
  @ApiQuery({ name: 'expirationMinutes', example: 60, required: false, description: 'Minutos de expiración para las URLs firmadas (por defecto 60)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de imágenes de la carpeta con URLs firmadas',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'ef2e0482-95a2-43e7-a6e8-46450b0ccc2d' },
          folder: { type: 'string', example: 'Biceps' },
          filePath: { type: 'string', example: 'Ejercicios/Biceps/Barbell-Curl-On-Arm-Blaster.gif' },
          url: { type: 'string', example: 'https://storage.googleapis.com/...&X-Goog-Expires=...' },
          name: { type: 'string', example: 'Curl con Barra en Arm Blaster' },
          description: { type: 'string', example: 'Ejercicio para bíceps con barra en arm blaster' },
          isAssigned: { type: 'boolean', example: false },
          createdAt: { type: 'string', example: '2025-09-05T03:53:56.958Z' },
          updatedAt: { type: 'string', example: '2025-09-05T03:53:56.958Z' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Carpeta no encontrada' })
  async getByFolderWithSignedUrls(
    @Query('folder') folder: string, 
    @Query('expirationMinutes') expirationMinutes = 60
  ) {
    return this.mediaService.getByFolderWithAssignmentStatus(folder, Number(expirationMinutes) || 60);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar metadatos por filePath' })
  @ApiQuery({ name: 'filePath', example: 'Ejercicios/Pecho/press-banca.gif', required: true })
  @ApiResponse({ status: 200, description: 'Eliminado' })
  async delete(@Query('filePath') filePath: string) {
    await this.mediaService.deleteByFilePath(filePath);
    return { success: true };
  }

  @Get('missing')
  @ApiOperation({ summary: 'Listar archivos sin nombre/descripcion', description: 'Compara los archivos del root con los guardados en media_assets y devuelve los que no tienen metadatos (o los que tienen descripcion vacía) agrupados por carpeta. La URL devuelta es una URL firmada temporal.' })
  @ApiQuery({ name: 'root', example: 'Ejercicios', required: true })
  @ApiQuery({ name: 'expirationMinutes', example: 60, required: false, description: 'Minutos de expiración para la URL firmada (por defecto 60)' })
  @ApiResponse({ status: 200, description: 'Listado de faltantes' })
  async missing(@Query('root') root: string, @Query('expirationMinutes') expirationMinutes = 60) {
    const filesByFolder = await this.storage.listImagesAndGifsByRoot(root);
    const allAssets = await this.mediaService.getAll();
    const byPath = new Map(allAssets.map(a => [a.filePath, a]));

    const groups = await Promise.all(filesByFolder.map(async (group) => {
      const candidates = group.files.filter(f => {
        const meta = byPath.get(f.path);
        return !meta || !meta.description || !meta.name;
      });

      const filesWithSigned = await Promise.all(candidates.map(async (f) => {
        const signed = await this.storage.getSignedUrl(f.path, Number(expirationMinutes) || 60);
        return { name: f.name, path: f.path, url: signed || f.url };
      }));

      return { folder: group.folder, files: filesWithSigned };
    }));

    return groups;
  }

  @Post('mark-all-unassigned')
  @ApiOperation({ 
    summary: 'Marcar todas las imágenes como no asignadas', 
    description: 'Cambia el estado isAssigned a false para todas las imágenes que estén marcadas como asignadas (isAssigned: true).' 
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Todas las imágenes marcadas como no asignadas',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Todas las imágenes marcadas como no asignadas'
        },
        updatedCount: {
          type: 'number',
          example: 15,
          description: 'Número de imágenes que fueron actualizadas'
        }
      }
    }
  })
  markAllAsUnassigned() {
    return this.mediaService.markAllAsUnassigned();
  }
}


