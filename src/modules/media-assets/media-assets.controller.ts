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
  @ApiOperation({ summary: 'Listar metadatos por carpeta' })
  @ApiQuery({ name: 'folder', example: 'Pecho', required: true })
  @ApiResponse({ status: 200, description: 'Listado por carpeta', type: [MediaAsset] })
  getByFolder(@Query('folder') folder: string) {
    return this.mediaService.getByFolder(folder);
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
}


