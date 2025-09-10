import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MediaAsset } from './entities/media-asset.entity';
import { UpsertMediaAssetDto } from './dto/upsert-media-asset.dto';

@Injectable()
export class MediaAssetsService {
  constructor(
    @InjectRepository(MediaAsset)
    private mediaRepo: Repository<MediaAsset>,
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
}




