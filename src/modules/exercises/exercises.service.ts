import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exercise } from './entities/exercise.entity';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { CreateExerciseWithImageDto } from './dto/create-exercise-with-image.dto';
import { CreateExerciseWithImageIdDto } from './dto/create-exercise-with-image-id.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { UpdateExerciseWithImageDto } from './dto/update-exercise-with-image.dto';
import { MuscleGroup } from '../muscle-groups/entities/muscle-group.entity';
import { MediaAsset } from '../media-assets/entities/media-asset.entity';
import { FirebaseStorageService } from '../../common/firebase/firebase-storage.service';
import { MediaAssetsService } from '../media-assets/media-assets.service';

@Injectable()
export class ExercisesService {
  constructor(
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    
    @InjectRepository(MuscleGroup)
    private muscleGroupRepository: Repository<MuscleGroup>,

    @InjectRepository(MediaAsset)
    private mediaAssetRepository: Repository<MediaAsset>,

    private firebaseStorageService: FirebaseStorageService,
    private mediaAssetsService: MediaAssetsService,
  ) {}

  // Función auxiliar para procesar imágenes de ejercicios
  private async processExerciseImages(exercises: Exercise[]): Promise<Exercise[]> {
    for (const exercise of exercises) {
      if (exercise.image && exercise.image.url) {
        // Extraer el filePath de la URL
        const filePathMatch = exercise.image.url.match(/\/Ejercicios\/[^?]+/);
        if (filePathMatch) {
          const filePath = filePathMatch[0].substring(1); // Remover la barra inicial
          try {
            // Buscar el MediaAsset correspondiente para obtener el imageId
            const mediaAsset = await this.mediaAssetRepository.findOne({
              where: { filePath: filePath }
            });
            
            if (mediaAsset) {
              exercise.image.imageId = mediaAsset.id;
            }
            
            const signedUrl = await this.firebaseStorageService.getSignedUrl(filePath, 3600); // 1 hora
            exercise.image.url = signedUrl || exercise.image.url;
          } catch (error) {
            console.warn(`No se pudo generar URL firmada para ${filePath}:`, error);
          }
        }
      }
    }
    return exercises;
  }

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

    let imageData: { type: string; url: string; imageId?: string; } | null = createDto.image || null;

    // Si se proporciona un imageId, buscar el MediaAsset correspondiente
    if (createDto.imageId) {
      const mediaAsset = await this.mediaAssetRepository.findOne({
        where: { id: createDto.imageId }
      });

      if (mediaAsset) {
        // Obtener URL firmada de Firebase
        const signedUrl = await this.firebaseStorageService.getSignedUrl(mediaAsset.filePath, 60);
        
        imageData = {
          type: mediaAsset.filePath.split('.').pop()?.toLowerCase() || 'gif',
          url: signedUrl || mediaAsset.url,
          imageId: mediaAsset.id
        };
      } else {
        throw new NotFoundException('Imagen no encontrada en la base de datos de media assets');
      }
    }

    const exercise = this.exerciseRepository.create({
      name: createDto.name,
      description: createDto.description,
      muscleGroupId: createDto.muscleGroupId,
      muscleGroupName: muscleGroup.title,
      image: imageData
    });

    const savedExercise = await this.exerciseRepository.save(exercise);

    // Manejar isAssigned para ambos casos (imageId o image.url)
    if (createDto.imageId) {
      // Caso 1: Se usó imageId
      const mediaAsset = await this.mediaAssetRepository.findOne({
        where: { id: createDto.imageId }
      });
      if (mediaAsset) {
        await this.mediaAssetsService.markAsAssigned(mediaAsset.filePath);
      }
    } else if (savedExercise.image && savedExercise.image.url) {
      // Caso 2: Se usó image.url (comportamiento anterior)
      const url = savedExercise.image.url;
      const filePathMatch = url.match(/\/Ejercicios\/[^?]+/);
      
      if (filePathMatch) {
        const filePath = filePathMatch[0];
        const mediaAsset = await this.mediaAssetRepository.findOne({
          where: { filePath: filePath }
        });
        
        if (mediaAsset) {
          await this.mediaAssetsService.markAsAssigned(mediaAsset.filePath);
        }
      }
    }

    return savedExercise;
  }

  async createWithImage(createDto: CreateExerciseWithImageDto): Promise<Exercise> {
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

    let imageData: { type: string; url: string; } | null = null;

    // Si se proporciona una ruta de imagen, buscar el MediaAsset correspondiente
    if (createDto.imagePath) {
      const mediaAsset = await this.mediaAssetRepository.findOne({
        where: { filePath: createDto.imagePath }
      });

      if (mediaAsset) {
        // Obtener URL firmada de Firebase
        const signedUrl = await this.firebaseStorageService.getSignedUrl(createDto.imagePath, 60);
        
        imageData = {
          type: createDto.imagePath.split('.').pop()?.toLowerCase() || 'gif',
          url: signedUrl || mediaAsset.url
        };
      } else {
        throw new NotFoundException('Imagen no encontrada en la base de datos de media assets');
      }
    }

    const exercise = this.exerciseRepository.create({
      name: createDto.name,
      description: createDto.description,
      muscleGroupId: createDto.muscleGroupId,
      muscleGroupName: muscleGroup.title,
      image: imageData
    });

    const savedExercise = await this.exerciseRepository.save(exercise);

    // Marcar la imagen como asignada si se usó una
    if (createDto.imagePath) {
      await this.mediaAssetsService.markAsAssigned(createDto.imagePath);
    }

    return savedExercise;
  }

  async createWithImageId(createDto: CreateExerciseWithImageIdDto): Promise<Exercise> {
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

    let imageData: { type: string; url: string; imageId?: string; } | null = null;

    // Si se proporciona un imageId, buscar el MediaAsset correspondiente
    if (createDto.imageId) {
      const mediaAsset = await this.mediaAssetRepository.findOne({
        where: { id: createDto.imageId }
      });

      if (mediaAsset) {
        // Obtener URL firmada de Firebase
        const signedUrl = await this.firebaseStorageService.getSignedUrl(mediaAsset.filePath, 60);
        
        imageData = {
          type: mediaAsset.filePath.split('.').pop()?.toLowerCase() || 'gif',
          url: signedUrl || mediaAsset.url,
          imageId: mediaAsset.id
        };
      } else {
        throw new NotFoundException('Imagen no encontrada en la base de datos de media assets');
      }
    }

    const exercise = this.exerciseRepository.create({
      name: createDto.name,
      description: createDto.description,
      muscleGroupId: createDto.muscleGroupId,
      muscleGroupName: muscleGroup.title,
      image: imageData
    });

    const savedExercise = await this.exerciseRepository.save(exercise);

    // Marcar la imagen como asignada si se usó una
    if (createDto.imageId) {
      const mediaAsset = await this.mediaAssetRepository.findOne({
        where: { id: createDto.imageId }
      });
      if (mediaAsset) {
        await this.mediaAssetsService.markAsAssigned(mediaAsset.filePath);
      }
    }

    return savedExercise;
  }

  async findAll(): Promise<Exercise[]> {
    const exercises = await this.exerciseRepository.find({
      order: { name: 'ASC' }
    });

    return this.processExerciseImages(exercises);
  }

  async findAllActive(): Promise<Exercise[]> {
    const exercises = await this.exerciseRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' }
    });

    return this.processExerciseImages(exercises);
  }

  async findAllIncludingInactive(): Promise<Exercise[]> {
    const exercises = await this.exerciseRepository.find({
      order: { name: 'ASC' }
    });

    return this.processExerciseImages(exercises);
  }

  async findByMuscleGroup(muscleGroupId: string): Promise<Exercise[]> {
    const exercises = await this.exerciseRepository.find({
      where: { muscleGroupId },
      order: { name: 'ASC' }
    });

    return this.processExerciseImages(exercises);
  }

  async findOne(id: string): Promise<Exercise> {
    const exercise = await this.exerciseRepository.findOne({
      where: { id }
    });

    if (!exercise) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    // Procesar la imagen del ejercicio
    await this.processExerciseImages([exercise]);

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

    // Guardar la imagen anterior para comparar
    const previousImage = exercise.image;

    Object.assign(exercise, updateDto);
    const savedExercise = await this.exerciseRepository.save(exercise);

    // Manejar el estado isAssigned de las imágenes
    if (updateDto.image) {
      // Si se está actualizando la imagen, desmarcar la anterior y marcar la nueva
      if (previousImage && previousImage.url !== updateDto.image.url) {
        const previousUrl = previousImage.url;
        const previousFilePathMatch = previousUrl.match(/\/Ejercicios\/[^?]+/);
        
        if (previousFilePathMatch) {
          const previousFilePath = previousFilePathMatch[0];
          const previousAsset = await this.mediaAssetRepository.findOne({
            where: { filePath: previousFilePath }
          });
          if (previousAsset) {
            await this.mediaAssetsService.markAsUnassigned(previousAsset.filePath);
          }
        }
      }

      // Marcar la nueva imagen como asignada
      const newUrl = updateDto.image.url;
      const newFilePathMatch = newUrl.match(/\/Ejercicios\/[^?]+/);
      
      if (newFilePathMatch) {
        const newFilePath = newFilePathMatch[0];
        const newAsset = await this.mediaAssetRepository.findOne({
          where: { filePath: newFilePath }
        });
        if (newAsset) {
          await this.mediaAssetsService.markAsAssigned(newAsset.filePath);
        }
      }
    }

    return savedExercise;
  }

  async updateWithImage(id: string, updateDto: UpdateExerciseWithImageDto): Promise<Exercise> {
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

      exercise.muscleGroupName = muscleGroup.title;
    }

    // Si se proporciona una nueva imagen, buscar el MediaAsset correspondiente
    if (updateDto.imagePath) {
      // Desmarcar la imagen anterior si existía
      if (exercise.image && exercise.image.url) {
        // Buscar el MediaAsset anterior por la URL
        const previousAsset = await this.mediaAssetRepository.findOne({
          where: { url: exercise.image.url }
        });
        if (previousAsset) {
          await this.mediaAssetsService.markAsUnassigned(previousAsset.filePath);
        }
      }

      const mediaAsset = await this.mediaAssetRepository.findOne({
        where: { filePath: updateDto.imagePath }
      });

      if (mediaAsset) {
        // Obtener URL firmada de Firebase
        const signedUrl = await this.firebaseStorageService.getSignedUrl(updateDto.imagePath, 60);
        
        exercise.image = {
          type: updateDto.imagePath.split('.').pop()?.toLowerCase() || 'gif',
          url: signedUrl || mediaAsset.url
        };

        // Marcar la nueva imagen como asignada
        await this.mediaAssetsService.markAsAssigned(updateDto.imagePath);
      } else {
        throw new NotFoundException('Imagen no encontrada en la base de datos de media assets');
      }
    }

    // Actualizar otros campos
    if (updateDto.name) exercise.name = updateDto.name;
    if (updateDto.description) exercise.description = updateDto.description;
    if (updateDto.muscleGroupId) exercise.muscleGroupId = updateDto.muscleGroupId;

    return this.exerciseRepository.save(exercise);
  }

  async remove(id: string): Promise<void> {
    const exercise = await this.findOne(id);
    
    // Desmarcar la imagen como no asignada si existía
    if (exercise.image && exercise.image.url) {
      const url = exercise.image.url;
      const filePathMatch = url.match(/\/Ejercicios\/[^?]+/);
      
      if (filePathMatch) {
        const filePath = filePathMatch[0].substring(1); // Remover la barra inicial
        const asset = await this.mediaAssetRepository.findOne({
          where: { filePath: filePath }
        });
        if (asset) {
          await this.mediaAssetsService.markAsUnassigned(asset.filePath);
        }
      }
    }
    
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

  async removeByImageId(imageId: string): Promise<{ message: string; exerciseId: string; imageId: string }> {
    // Buscar el ejercicio que tiene esta imagen asignada
    const exercises = await this.exerciseRepository.find({
      where: { isActive: true }
    });

    let exerciseToDelete: Exercise | null = null;
    for (const exercise of exercises) {
      if (exercise.image && exercise.image.imageId === imageId) {
        exerciseToDelete = exercise;
        break;
      }
    }

    if (!exerciseToDelete) {
      throw new NotFoundException('No se encontró un ejercicio activo con esta imagen asignada');
    }

    // Marcar la imagen como no asignada
    await this.mediaAssetsService.markAsUnassignedById(imageId);

    // Soft delete del ejercicio
    exerciseToDelete.isActive = false;
    await this.exerciseRepository.save(exerciseToDelete);

    return {
      message: 'Ejercicio eliminado exitosamente y imagen marcada como no asignada',
      exerciseId: exerciseToDelete.id,
      imageId: imageId
    };
  }

  async unassignImageFromExercise(exerciseId: string, imageId: string): Promise<{ message: string; exerciseId: string; imageId: string }> {
    // SIEMPRE marcar la imagen como no asignada primero
    await this.mediaAssetsService.markAsUnassignedById(imageId);

    // Verificar que el ejercicio existe y está activo
    const exercise = await this.exerciseRepository.findOne({
      where: { id: exerciseId, isActive: true }
    });

    if (!exercise) {
      return {
        message: 'Imagen desasignada exitosamente. Ejercicio no encontrado o inactivo.',
        exerciseId: exerciseId,
        imageId: imageId
      };
    }

    // Verificar que la imagen está asignada a este ejercicio
    if (!exercise.image || exercise.image.imageId !== imageId) {
      return {
        message: 'Imagen desasignada exitosamente. La imagen no estaba asignada a este ejercicio.',
        exerciseId: exerciseId,
        imageId: imageId
      };
    }

    // Eliminar el ejercicio completamente de la base de datos (hard delete)
    await this.exerciseRepository.remove(exercise);

    return {
      message: 'Imagen desasignada exitosamente y ejercicio eliminado permanentemente',
      exerciseId: exerciseId,
      imageId: imageId
    };
  }

  async getExerciseFolders(): Promise<Array<{
    id: string;
    title: string;
    description: string;
    exerciseCount: number;
    isActive: boolean;
  }>> {
    // Obtener todos los grupos musculares activos
    const muscleGroups = await this.muscleGroupRepository.find({
      where: { isActive: true },
      order: { title: 'ASC' }
    });

    // Para cada grupo muscular, contar los ejercicios activos
    const foldersWithCounts = await Promise.all(
      muscleGroups.map(async (muscleGroup) => {
        const exerciseCount = await this.exerciseRepository.count({
          where: { 
            muscleGroupId: muscleGroup.id,
            isActive: true 
          }
        });

        return {
          id: muscleGroup.id,
          title: muscleGroup.title,
          description: muscleGroup.description,
          exerciseCount,
          isActive: muscleGroup.isActive
        };
      })
    );

    return foldersWithCounts;
  }
}
