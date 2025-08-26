import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { MuscleGroup } from '../muscle-groups/entities/muscle-group.entity';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    
    @InjectRepository(MuscleGroup)
    private muscleGroupRepository: Repository<MuscleGroup>,
  ) {}

  async create(createDto: CreateExerciseDto): Promise<Exercise> {
    // Verificar que el grupo muscular existe
    const muscleGroup = await this.muscleGroupRepository.findOne({
      where: { id: createDto.muscleGroupId }
    });

    if (!muscleGroup) {
      throw new NotFoundException('Grupo muscular no encontrado');
    }

    // Verificar si ya existe un ejercicio con el mismo nombre
    const existingExercise = await this.exerciseRepository.findOne({
      where: { name: createDto.name }
    });

    if (existingExercise) {
      throw new ConflictException('Ya existe un ejercicio con este nombre');
    }

    const exercise = this.exerciseRepository.create({
      ...createDto,
      muscleGroupName: muscleGroup.title // Guardar el nombre del grupo muscular
    });

    return this.exerciseRepository.save(exercise);
  }

  async findAll(): Promise<Exercise[]> {
    return this.exerciseRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findAllActive(): Promise<Exercise[]> {
    return this.exerciseRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });
  }

  async findAllIncludingInactive(): Promise<Exercise[]> {
    return this.exerciseRepository.find({
      order: { name: 'ASC' }
    });
  }

  async findByMuscleGroup(muscleGroupId: string): Promise<Exercise[]> {
    return this.exerciseRepository.find({
      where: { muscleGroupId },
      order: { name: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id }
    });

    if (!exercise) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    return exercise;
  }

  async update(id: string, updateDto: UpdateExerciseDto): Promise<Exercise> {
    const exercise = await this.findOne(id);

    // Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
    if (updateDto.name && updateDto.name !== exercise.name) {
      const existingExercise = await this.exerciseRepository.findOne({
        where: { name: updateDto.name }
      });

      if (existingExercise) {
        throw new ConflictException('Ya existe un ejercicio con este nombre');
      }
    }

    // Si se está actualizando el grupo muscular, verificar que existe y actualizar el nombre
    if (updateDto.muscleGroupId && updateDto.muscleGroupId !== exercise.muscleGroupId) {
      const muscleGroup = await this.muscleGroupRepository.findOne({
        where: { id: updateDto.muscleGroupId }
      });

      if (!muscleGroup) {
        throw new NotFoundException('Grupo muscular no encontrado');
      }

      // Actualizar directamente en el objeto exercise
      exercise.muscleGroupName = muscleGroup.title;
    }

    Object.assign(exercise, updateDto);
    return this.exerciseRepository.save(exercise);
  }

  async remove(id: string): Promise<void> {
    const exercise = await this.findOne(id);
    
    // Soft delete: cambiar isActive a false
    exercise.isActive = false;
    await this.exerciseRepository.save(exercise);
  }

  async activate(id: string): Promise<void> {
    const exercise = await this.findOne(id);
    
    exercise.isActive = true;
    await this.exerciseRepository.save(exercise);
  }

  async toggleStatus(id: string): Promise<{ isActive: boolean }> {
    const exercise = await this.findOne(id);
    
    exercise.isActive = !exercise.isActive;
    await this.exerciseRepository.save(exercise);
    
    return { isActive: exercise.isActive };
  }
}
