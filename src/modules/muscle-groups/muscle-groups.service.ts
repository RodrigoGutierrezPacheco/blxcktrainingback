import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MuscleGroup } from './entities/muscle-group.entity';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';
import { UpdateMuscleGroupDto } from './dto/update-muscle-group.dto';

@Injectable()
export class MuscleGroupsService {
  constructor(
    @InjectRepository(MuscleGroup)
    private muscleGroupRepository: Repository<MuscleGroup>,
  ) {}

  async create(createDto: CreateMuscleGroupDto): Promise<MuscleGroup> {
    // Verificar si ya existe un grupo muscular con el mismo título
    const existingGroup = await this.muscleGroupRepository.findOne({
      where: { title: createDto.title }
    });

    if (existingGroup) {
      throw new ConflictException('Ya existe un grupo muscular con este título');
    }

    const muscleGroup = this.muscleGroupRepository.create(createDto);
    return this.muscleGroupRepository.save(muscleGroup);
  }

  async findAll(): Promise<MuscleGroup[]> {
    return this.muscleGroupRepository.find({
      order: { title: 'ASC' }
    });
  }

  async findAllActive(): Promise<MuscleGroup[]> {
    return this.muscleGroupRepository.find({
      where: { isActive: true },
      order: { title: 'ASC' }
    });
  }

  async findAllIncludingInactive(): Promise<MuscleGroup[]> {
    return this.muscleGroupRepository.find({
      order: { title: 'ASC' }
    });
  }

  async findOne(id: string): Promise<MuscleGroup> {
    const muscleGroup = await this.muscleGroupRepository.findOne({
      where: { id }
    });

    if (!muscleGroup) {
      throw new NotFoundException('Grupo muscular no encontrado');
    }

    return muscleGroup;
  }

  async update(id: string, updateDto: UpdateMuscleGroupDto): Promise<MuscleGroup> {
    const muscleGroup = await this.findOne(id);

    // Si se está actualizando el título, verificar que no exista otro con el mismo título
    if (updateDto.title && updateDto.title !== muscleGroup.title) {
      const existingGroup = await this.muscleGroupRepository.findOne({
        where: { title: updateDto.title }
      });

      if (existingGroup) {
        throw new ConflictException('Ya existe un grupo muscular con este título');
      }
    }

    Object.assign(muscleGroup, updateDto);
    return this.muscleGroupRepository.save(muscleGroup);
  }

  async remove(id: string): Promise<void> {
    const muscleGroup = await this.findOne(id);
    
    // Soft delete: cambiar isActive a false
    muscleGroup.isActive = false;
    await this.muscleGroupRepository.save(muscleGroup);
  }

  async activate(id: string): Promise<void> {
    const muscleGroup = await this.findOne(id);
    
    muscleGroup.isActive = true;
    await this.muscleGroupRepository.save(muscleGroup);
  }

  async toggleStatus(id: string): Promise<{ isActive: boolean }> {
    const muscleGroup = await this.findOne(id);
    
    muscleGroup.isActive = !muscleGroup.isActive;
    await this.muscleGroupRepository.save(muscleGroup);
    
    return { isActive: muscleGroup.isActive };
  }
}
