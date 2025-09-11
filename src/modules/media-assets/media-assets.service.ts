import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaAsset } from './entities/media-asset.entity';
import { UpsertMediaAssetDto } from './dto/upsert-media-asset.dto';
import { FirebaseStorageService } from '../../common/firebase/firebase-storage.service';

@Injectable()
export class MediaAssetsService {
  constructor(
    @InjectRepository(MediaAsset)
    private mediaRepo: Repository<MediaAsset>,
    private firebaseStorageService: FirebaseStorageService,
  ) {}

  async upsert(dto: UpsertMediaAssetDto): Promise<MediaAsset> {
    let asset = await this.mediaRepo.findOne({ where: { filePath: dto.filePath } });
    if (!asset) {
      asset = this.mediaRepo.create(dto);
    } else {
      Object.assign(asset, dto);
    }
    return this.mediaRepo.save(asset);
  }

  async getByFolder(folder: string): Promise<MediaAsset[]> {
    return this.mediaRepo.find({ where: { folder }, order: { name: 'ASC' } });
  }

  async getAll(): Promise<MediaAsset[]> {
    return this.mediaRepo.find({ order: { folder: 'ASC', name: 'ASC' } });
  }

  async deleteByFilePath(filePath: string): Promise<void> {
    const asset = await this.mediaRepo.findOne({ where: { filePath } });
    if (!asset) throw new NotFoundException('Recurso no encontrado');
    await this.mediaRepo.remove(asset);
  }

  async getByFolderWithSignedUrls(folder: string, expirationMinutes: number = 60): Promise<MediaAsset[]> {
    const assets = await this.mediaRepo.find({ 
      where: { folder }, 
      order: { name: 'ASC' } 
    });

    if (assets.length === 0) {
      throw new NotFoundException(`No se encontraron imágenes en la carpeta '${folder}'`);
    }

    // Generar URLs firmadas para cada asset
    const assetsWithSignedUrls = await Promise.all(
      assets.map(async (asset) => {
        try {
          const signedUrl = await this.firebaseStorageService.getSignedUrl(
            asset.filePath, 
            expirationMinutes
          );
          
          return {
            ...asset,
            url: signedUrl || asset.url // Fallback a URL original si falla la firmada
          };
        } catch (error) {
          console.warn(`No se pudo generar URL firmada para ${asset.filePath}:`, error);
          return asset; // Retornar con URL original si falla
        }
      })
    );

    return assetsWithSignedUrls;
  }

  async markAsAssigned(filePath: string): Promise<void> {
    const asset = await this.mediaRepo.findOne({ where: { filePath } });
    if (asset) {
      asset.isAssigned = true;
      await this.mediaRepo.save(asset);
    }
  }

  async markAsUnassigned(filePath: string): Promise<void> {
    const asset = await this.mediaRepo.findOne({ where: { filePath } });
    if (asset) {
      asset.isAssigned = false;
      await this.mediaRepo.save(asset);
    }
  }

  async markAsUnassignedById(imageId: string): Promise<void> {
    const asset = await this.mediaRepo.findOne({ where: { id: imageId } });
    if (asset) {
      asset.isAssigned = false;
      await this.mediaRepo.save(asset);
    }
  }

  async markAllAsUnassigned(): Promise<{ message: string; updatedCount: number }> {
    const result = await this.mediaRepo.update(
      { isAssigned: true },
      { isAssigned: false }
    );
    
    return {
      message: 'Todas las imágenes marcadas como no asignadas',
      updatedCount: result.affected || 0
    };
  }

  async getByFolderWithAssignmentStatus(folder: string, expirationMinutes: number = 60): Promise<MediaAsset[]> {
    const assets = await this.mediaRepo.find({ 
      where: { folder }, 
      order: { name: 'ASC' } 
    });

    if (assets.length === 0) {
      throw new NotFoundException(`No se encontraron imágenes en la carpeta '${folder}'`);
    }

    // Generar URLs firmadas para cada asset
    const assetsWithSignedUrls = await Promise.all(
      assets.map(async (asset) => {
        try {
          const signedUrl = await this.firebaseStorageService.getSignedUrl(
            asset.filePath, 
            expirationMinutes
          );
          
          return {
            ...asset,
            url: signedUrl || asset.url // Fallback a URL original si falla la firmada
          };
        } catch (error) {
          console.warn(`No se pudo generar URL firmada para ${asset.filePath}:`, error);
          return asset; // Retornar con URL original si falla
        }
      })
    );

    return assetsWithSignedUrls;
  }
}




