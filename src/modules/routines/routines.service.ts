import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine } from './entities/routine.entity';
import { Week } from './entities/week.entity';
import { Day } from './entities/day.entity';
import { Exercise } from './entities/exercise.entity';
import { UserRoutine } from './entities/user-routine.entity';
import { UserExerciseProgress } from './entities/user-exercise-progress.entity';
import { UserDayProgress } from './entities/user-day-progress.entity';
import { UserWeekProgress } from './entities/user-week-progress.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AssignRoutineDto } from './dto/assign-routine.dto';
import { ReassignRoutineDto } from './dto/reassign-routine.dto';
import { CreateRoutineForUserDto } from './dto/create-routine-for-user.dto';
import { UpdateRoutineDurationDto } from './dto/update-routine-duration.dto';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/entities/user.entity';

// Interfaces para extender las entidades con información de progreso
interface WeekWithProgress extends Week {
  isCompleted?: boolean;
  completedAt?: Date | null;
}

interface DayWithProgress extends Day {
  isCompleted?: boolean;
  completedAt?: Date | null;
}

interface ExerciseWithProgress extends Exercise {
  isCompleted?: boolean;
  completedAt?: Date | null;
}

interface RoutineIdResult {
  routine_id: string;
}

@Injectable()
export class RoutinesService {
  constructor(
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
    @InjectRepository(Week)
    private weekRepository: Repository<Week>,
    @InjectRepository(Day)
    private dayRepository: Repository<Day>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(UserRoutine)
    private userRoutineRepository: Repository<UserRoutine>,
    @InjectRepository(UserExerciseProgress)
    private exerciseProgressRepository: Repository<UserExerciseProgress>,
    @InjectRepository(UserDayProgress)
    private dayProgressRepository: Repository<UserDayProgress>,
    @InjectRepository(UserWeekProgress)
    private weekProgressRepository: Repository<UserWeekProgress>,
    private usersService: UsersService,
  ) {}

  async create(createRoutineDto: CreateRoutineDto): Promise<Routine> {
    // Verificar que el trainer existe
    const trainer = await this.usersService.findTrainerById(createRoutineDto.trainer_id);
    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }

    const routine = this.routineRepository.create({
      name: createRoutineDto.name,
      description: createRoutineDto.description,
      comments: createRoutineDto.comments,
      totalWeeks: createRoutineDto.totalWeeks,
      isActive: createRoutineDto.isActive ?? true,
      trainer_id: createRoutineDto.trainer_id,
      suggestedStartDate: createRoutineDto.suggestedStartDate ? new Date(createRoutineDto.suggestedStartDate) : null,
      suggestedEndDate: createRoutineDto.suggestedEndDate ? new Date(createRoutineDto.suggestedEndDate) : null,
    });

    const savedRoutine = await this.routineRepository.save(routine);

    // Crear semanas, días y ejercicios
    for (const weekDto of createRoutineDto.weeks) {
      const week = this.weekRepository.create({
        weekNumber: weekDto.weekNumber,
        name: weekDto.name,
        comments: weekDto.comments,
        routine_id: savedRoutine.id,
      });

      const savedWeek = await this.weekRepository.save(week);

      for (const dayDto of weekDto.days) {
        const day = this.dayRepository.create({
          dayNumber: dayDto.dayNumber,
          name: dayDto.name,
          comments: dayDto.comments,
          week_id: savedWeek.id,
        });

        const savedDay = await this.dayRepository.save(day);

        for (const exerciseDto of dayDto.exercises) {
          const exercise = this.exerciseRepository.create({
            name: exerciseDto.name,
            exerciseId: exerciseDto.exerciseId,
            sets: exerciseDto.sets,
            repetitions: exerciseDto.repetitions,
            restBetweenSets: exerciseDto.restBetweenSets,
            restBetweenExercises: exerciseDto.restBetweenExercises,
            comments: exerciseDto.comments,
            order: exerciseDto.order,
            day_id: savedDay.id,
          });

          await this.exerciseRepository.save(exercise);
        }
      }
    }

    return this.findOne(savedRoutine.id);
  }

  async findAll(): Promise<Routine[]> {
    return this.routineRepository.find({
      where: { isActive: true },
      relations: ['weeks', 'weeks.days', 'weeks.days.exercises'],
      order: {
        createdAt: 'DESC',
        weeks: {
          weekNumber: 'ASC',
          days: {
            dayNumber: 'ASC',
            exercises: {
              order: 'ASC'
            }
          }
        }
      }
    });
  }

  async findAllIncludingInactive(): Promise<Routine[]> {
    return this.routineRepository.find({
      relations: ['weeks', 'weeks.days', 'weeks.days.exercises'],
      order: {
        createdAt: 'DESC',
        weeks: {
          weekNumber: 'ASC',
          days: {
            dayNumber: 'ASC',
            exercises: {
              order: 'ASC'
            }
          }
        }
      }
    });
  }

  async findOne(id: string): Promise<Routine> {
    const routine = await this.routineRepository.findOne({
      where: { id },
      relations: ['trainer', 'weeks', 'weeks.days', 'weeks.days.exercises'],
    });

    if (!routine) {
      throw new NotFoundException(`Routine with ID ${id} not found`);
    }

    return routine;
  }

  async findByTrainer(trainerId: string): Promise<any[]> {
    const routines = await this.routineRepository.find({
      where: { trainer_id: trainerId },
      relations: ['weeks', 'weeks.days', 'weeks.days.exercises'],
    });

    // Para cada rutina, verificar si está asignada a algún usuario
    const routinesWithAssignmentStatus = await Promise.all(
      routines.map(async (routine) => {
        // Verificar si la rutina está asignada a algún usuario activo
        const assignmentCount = await this.userRoutineRepository.count({
          where: {
            routine_id: routine.id,
            isActive: true
          }
        });

        return {
          ...routine,
          isAssigned: assignmentCount > 0,
          assignmentCount: assignmentCount
        };
      })
    );

    return routinesWithAssignmentStatus;
  }

  async findUnassignedRoutinesByTrainer(trainerId: string): Promise<Routine[]> {
    // Obtener todas las rutinas del entrenador
    const allRoutines = await this.routineRepository.find({
      where: { 
        trainer_id: trainerId,
        isActive: true 
      },
      relations: ['weeks', 'weeks.days', 'weeks.days.exercises'],
    });

    // Obtener todas las rutinas que están asignadas a usuarios
    const assignedRoutineIds = await this.userRoutineRepository
      .createQueryBuilder('userRoutine')
      .select('DISTINCT userRoutine.routine_id', 'routine_id')
      .where('userRoutine.isActive = :isActive', { isActive: true })
      .getRawMany();

    const assignedIds = assignedRoutineIds.map((item: RoutineIdResult) => item.routine_id);

    // Filtrar las rutinas que NO están asignadas
    const unassignedRoutines = allRoutines.filter(routine => 
      !assignedIds.includes(routine.id)
    );

    return unassignedRoutines;
  }

  async update(id: string, updateRoutineDto: UpdateRoutineDto): Promise<Routine> {
    const routine = await this.findOne(id);

    // Actualizar campos básicos de la rutina
    if (updateRoutineDto.name !== undefined) routine.name = updateRoutineDto.name;
    if (updateRoutineDto.description !== undefined) routine.description = updateRoutineDto.description;
    if (updateRoutineDto.comments !== undefined) routine.comments = updateRoutineDto.comments;
    if (updateRoutineDto.totalWeeks !== undefined) routine.totalWeeks = updateRoutineDto.totalWeeks;
    if (updateRoutineDto.isActive !== undefined) routine.isActive = updateRoutineDto.isActive;

    await this.routineRepository.save(routine);

    // Si se proporcionan semanas, actualizar toda la estructura
    if (updateRoutineDto.weeks) {
      // Eliminar semanas existentes (cascade eliminará días y ejercicios)
      await this.weekRepository.delete({ routine_id: id });

      // Crear nuevas semanas
      for (const weekDto of updateRoutineDto.weeks) {
        const week = this.weekRepository.create({
          weekNumber: weekDto.weekNumber,
          name: weekDto.name,
          comments: weekDto.comments,
          routine_id: id,
        });

        const savedWeek = await this.weekRepository.save(week);

        for (const dayDto of weekDto.days) {
          const day = this.dayRepository.create({
            dayNumber: dayDto.dayNumber,
            name: dayDto.name,
            comments: dayDto.comments,
            week_id: savedWeek.id,
          });

          const savedDay = await this.dayRepository.save(day);

          for (const exerciseDto of dayDto.exercises) {
            const exercise = this.exerciseRepository.create({
              name: exerciseDto.name,
              exerciseId: exerciseDto.exerciseId,
              sets: exerciseDto.sets,
              repetitions: exerciseDto.repetitions,
              restBetweenSets: exerciseDto.restBetweenSets,
              restBetweenExercises: exerciseDto.restBetweenExercises,
              comments: exerciseDto.comments,
              order: exerciseDto.order,
              day_id: savedDay.id,
            });

            await this.exerciseRepository.save(exercise);
          }
        }
      }
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const routine = await this.findOne(id);
    await this.routineRepository.remove(routine);
  }

  // Métodos para asignar rutinas a usuarios
  async assignRoutineToUser(assignRoutineDto: AssignRoutineDto): Promise<UserRoutine> {
    // Verificar que el usuario y la rutina existen
    const user = await this.usersService.findUserById(assignRoutineDto.user_id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    await this.findOne(assignRoutineDto.routine_id);

    // Verificar que no haya una asignación activa para esta rutina específica
    const existingAssignment = await this.userRoutineRepository.findOne({
      where: {
        user_id: assignRoutineDto.user_id,
        routine_id: assignRoutineDto.routine_id,
        isActive: true,
      },
    });

    if (existingAssignment) {
      throw new BadRequestException('User already has an active assignment for this routine');
    }

    // Buscar TODAS las rutinas del usuario (activas e inactivas)
    const allUserRoutines = await this.userRoutineRepository.find({
      where: {
        user_id: assignRoutineDto.user_id,
      },
    });

    // Eliminar completamente TODAS las rutinas anteriores del usuario
    if (allUserRoutines.length > 0) {
      console.log(`🗑️ Eliminando ${allUserRoutines.length} rutinas del usuario ${assignRoutineDto.user_id}`);
      
      // Eliminar todas las rutinas anteriores
      await this.userRoutineRepository.delete({
        user_id: assignRoutineDto.user_id,
      });
      
      console.log(`✅ ${allUserRoutines.length} rutinas eliminadas exitosamente`);
    }

    // Crear la nueva asignación
    const userRoutine = this.userRoutineRepository.create({
      user_id: assignRoutineDto.user_id,
      routine_id: assignRoutineDto.routine_id,
      startDate: new Date(assignRoutineDto.startDate),
      endDate: assignRoutineDto.endDate ? new Date(assignRoutineDto.endDate) : null,
      notes: assignRoutineDto.notes,
      isActive: true,
    });

    const savedUserRoutine = await this.userRoutineRepository.save(userRoutine);

    // Actualizar la columna hasRoutine del usuario
    await this.usersService.updateUserRoutineStatus(assignRoutineDto.user_id, true);

    return savedUserRoutine;
  }

  /**
   * Ordena las semanas y días de las rutinas del usuario
   * @param userRoutines Array de rutinas del usuario
   */
  private sortUserRoutines(userRoutines: UserRoutine[]): void {
    userRoutines.forEach(userRoutine => {
      if (userRoutine.routine && userRoutine.routine.weeks) {
        // Ordenar las semanas por weekNumber (de 1 a la última)
        userRoutine.routine.weeks.sort((a, b) => a.weekNumber - b.weekNumber);
        
        // Ordenar los días dentro de cada semana por dayNumber
        userRoutine.routine.weeks.forEach(week => {
          if (week.days) {
            week.days.sort((a, b) => a.dayNumber - b.dayNumber);
          }
        });
      }
    });
  }

  async getUserRoutines(userId: string): Promise<UserRoutine[]> {
    const userRoutines = await this.userRoutineRepository.find({
      where: { user_id: userId },
      relations: ['routine', 'routine.weeks', 'routine.weeks.days', 'routine.weeks.days.exercises'],
    });

    // Ordenar las semanas y días
    this.sortUserRoutines(userRoutines);

    return userRoutines;
  }

  async getUserRoutinesByEmail(email: string): Promise<UserRoutine[]> {
    // Primero buscar el usuario por email usando getUserByEmail que retorna User con UUID
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Luego buscar las rutinas del usuario usando el ID del usuario (que es UUID)
    const userRoutines = await this.userRoutineRepository.find({
      where: { user_id: user.id },
      relations: ['routine', 'routine.weeks', 'routine.weeks.days', 'routine.weeks.days.exercises'],
    });

    // Agregar información de progreso a cada rutina
    for (const userRoutine of userRoutines) {
      if (userRoutine.routine && userRoutine.routine.weeks) {
        // Agregar progreso de semanas
        for (const week of userRoutine.routine.weeks) {
          const weekProgress = await this.weekProgressRepository.findOne({
            where: { user_id: user.id, week_id: week.id }
          });
          (week as WeekWithProgress).isCompleted = weekProgress?.isCompleted || false;
          (week as WeekWithProgress).completedAt = weekProgress?.completedAt || null;

          // Agregar progreso de días
          if (week.days) {
            for (const day of week.days) {
              const dayProgress = await this.dayProgressRepository.findOne({
                where: { user_id: user.id, day_id: day.id }
              });
              (day as DayWithProgress).isCompleted = dayProgress?.isCompleted || false;
              (day as DayWithProgress).completedAt = dayProgress?.completedAt || null;

              // Agregar progreso de ejercicios
              if (day.exercises) {
                for (const exercise of day.exercises) {
                  const exerciseProgress = await this.exerciseProgressRepository.findOne({
                    where: { user_id: user.id, exercise_id: exercise.id }
                  });
                  (exercise as ExerciseWithProgress).isCompleted = exerciseProgress?.isCompleted || false;
                  (exercise as ExerciseWithProgress).completedAt = exerciseProgress?.completedAt || null;
                }
              }
            }
          }
        }
      }
    }

    // Ordenar las semanas y días
    this.sortUserRoutines(userRoutines);

    return userRoutines;
  }

  async deactivateUserRoutine(userId: string, routineId: string): Promise<void> {
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: userId,
        routine_id: routineId,
        isActive: true,
      },
    });

    if (!userRoutine) {
      throw new NotFoundException('Active routine assignment not found');
    }

    userRoutine.isActive = false;
    userRoutine.endDate = new Date();
    await this.userRoutineRepository.save(userRoutine);

    // Verificar si el usuario tiene otras rutinas activas
    const activeRoutines = await this.userRoutineRepository.count({
      where: {
        user_id: userId,
        isActive: true,
      },
    });

    // Si no tiene rutinas activas, actualizar hasRoutine a false
    if (activeRoutines === 0) {
      await this.usersService.updateUserRoutineStatus(userId, false);
    }
  }

  async deactivateAllUserRoutinesByEmail(email: string): Promise<{ message: string; deactivatedRoutines: number }> {
    // Buscar el usuario por email
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Buscar todas las rutinas activas del usuario
    const activeRoutines = await this.userRoutineRepository.find({
      where: {
        user_id: user.id,
        isActive: true,
      },
    });

    if (activeRoutines.length === 0) {
      return {
        message: 'El usuario no tiene rutinas activas para desasignar',
        deactivatedRoutines: 0
      };
    }

    // Desactivar todas las rutinas activas
    for (const userRoutine of activeRoutines) {
      userRoutine.isActive = false;
      userRoutine.endDate = new Date();
      await this.userRoutineRepository.save(userRoutine);
    }

    // Actualizar hasRoutine a false ya que no tiene rutinas activas
    await this.usersService.updateUserRoutineStatus(user.id, false);

    return {
      message: `Se desasignaron ${activeRoutines.length} rutina(s) del usuario exitosamente`,
      deactivatedRoutines: activeRoutines.length
    };
  }

  async deleteAllUserRoutinesByEmail(email: string): Promise<{ message: string; deletedRoutines: number }> {
    // Buscar el usuario por email
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Buscar todas las rutinas del usuario (activas e inactivas)
    const allUserRoutines = await this.userRoutineRepository.find({
      where: {
        user_id: user.id,
      },
    });

    if (allUserRoutines.length === 0) {
      return {
        message: 'El usuario no tiene rutinas para eliminar',
        deletedRoutines: 0
      };
    }

    // Eliminar completamente todas las rutinas del usuario
    await this.userRoutineRepository.delete({
      user_id: user.id,
    });

    // Actualizar hasRoutine a false ya que no tiene rutinas
    await this.usersService.updateUserRoutineStatus(user.id, false);

    return {
      message: `Se eliminaron ${allUserRoutines.length} rutina(s) del usuario exitosamente`,
      deletedRoutines: allUserRoutines.length
    };
  }

  async removeUserRoutine(userId: string, routineId: string): Promise<void> {
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: userId,
        routine_id: routineId,
      },
    });

    if (!userRoutine) {
      throw new NotFoundException('Routine assignment not found');
    }

    await this.userRoutineRepository.remove(userRoutine);

    // Verificar si el usuario tiene otras rutinas activas
    const activeRoutines = await this.userRoutineRepository.count({
      where: {
        user_id: userId,
        isActive: true,
      },
    });

    // Si no tiene rutinas activas, actualizar hasRoutine a false
    if (activeRoutines === 0) {
      await this.usersService.updateUserRoutineStatus(userId, false);
    }
  }

  async reassignRoutineToUser(reassignDto: ReassignRoutineDto): Promise<UserRoutine> {
    // Verificar que el usuario existe
    const user = await this.usersService.findUserById(reassignDto.user_id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que la nueva rutina existe
    await this.findOne(reassignDto.routine_id);

    // Desactivar todas las rutinas activas del usuario
    const activeRoutines = await this.userRoutineRepository.find({
      where: {
        user_id: reassignDto.user_id,
        isActive: true,
      },
    });

    for (const routine of activeRoutines) {
      routine.isActive = false;
      await this.userRoutineRepository.save(routine);
    }

    // Crear nueva asignación de rutina
    const newUserRoutine = this.userRoutineRepository.create({
      user_id: reassignDto.user_id,
      routine_id: reassignDto.routine_id,
      startDate: new Date(reassignDto.startDate),
      endDate: reassignDto.endDate ? new Date(reassignDto.endDate) : null,
      notes: reassignDto.notes,
      isActive: true,
    });

    const savedUserRoutine = await this.userRoutineRepository.save(newUserRoutine);

    // Actualizar el estado hasRoutine del usuario
    await this.usersService.updateUserRoutineStatus(reassignDto.user_id, true);

    return savedUserRoutine;
  }

  // Método para sincronizar el estado de hasRoutine para todos los usuarios
  async syncAllUsersRoutineStatus(): Promise<void> {
    // Obtener todos los usuarios
    const users = await this.usersService.findAll();
    
    for (const user of users) {
      // Contar rutinas activas del usuario
      const activeRoutines = await this.userRoutineRepository.count({
        where: {
          user_id: user.id,
          isActive: true,
        },
      });

      // Actualizar el estado hasRoutine
      const hasRoutine = activeRoutines > 0;
      await this.usersService.updateUserRoutineStatus(user.id, hasRoutine);
    }
  }

  // Métodos para obtener usuarios con diferentes filtros de rutina
  getUsersWithRoutineDetails(): Promise<User[]> {
    return this.usersService.getUsersWithRoutineDetails();
  }

  getUsersWithoutRoutine(): Promise<User[]> {
    return this.usersService.getUsersWithoutRoutine();
  }

  getUsersWithRoutine(): Promise<User[]> {
    return this.usersService.getUsersWithRoutine();
  }

  async createRoutineForUser(createRoutineForUserDto: CreateRoutineForUserDto): Promise<{ routine: Routine; userRoutine: UserRoutine }> {
    // Verificar que el usuario existe
    const user = await this.usersService.findUserById(createRoutineForUserDto.user_id);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el entrenador existe
    const trainer = await this.usersService.findTrainerById(createRoutineForUserDto.trainer_id);
    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    // Crear la rutina
    const routine = this.routineRepository.create({
      name: createRoutineForUserDto.name,
      description: createRoutineForUserDto.description,
      comments: createRoutineForUserDto.comments,
      totalWeeks: createRoutineForUserDto.totalWeeks,
      isActive: createRoutineForUserDto.isActive ?? true,
      trainer_id: createRoutineForUserDto.trainer_id,
      suggestedStartDate: createRoutineForUserDto.suggestedStartDate ? new Date(createRoutineForUserDto.suggestedStartDate) : null,
      suggestedEndDate: createRoutineForUserDto.suggestedEndDate ? new Date(createRoutineForUserDto.suggestedEndDate) : null,
    });

    const savedRoutine = await this.routineRepository.save(routine);

    // Crear semanas, días y ejercicios
    for (const weekDto of createRoutineForUserDto.weeks) {
      const week = this.weekRepository.create({
        weekNumber: weekDto.weekNumber,
        name: weekDto.name,
        comments: weekDto.comments,
        routine_id: savedRoutine.id,
      });

      const savedWeek = await this.weekRepository.save(week);

      for (const dayDto of weekDto.days) {
        const day = this.dayRepository.create({
          dayNumber: dayDto.dayNumber,
          name: dayDto.name,
          comments: dayDto.comments,
          week_id: savedWeek.id,
        });

        const savedDay = await this.dayRepository.save(day);

        for (const exerciseDto of dayDto.exercises) {
          const exercise = this.exerciseRepository.create({
            name: exerciseDto.name,
            exerciseId: exerciseDto.exerciseId,
            sets: exerciseDto.sets,
            repetitions: exerciseDto.repetitions,
            restBetweenSets: exerciseDto.restBetweenSets,
            restBetweenExercises: exerciseDto.restBetweenExercises,
            comments: exerciseDto.comments,
            order: exerciseDto.order,
            day_id: savedDay.id,
          });

          await this.exerciseRepository.save(exercise);
        }
      }
    }

    // Eliminar todas las rutinas anteriores del usuario
    await this.userRoutineRepository.delete({
      user_id: createRoutineForUserDto.user_id
    });

    // Asignar la rutina al usuario
    // Usar las fechas sugeridas si no se proporcionan fechas específicas
    const assignmentStartDate = createRoutineForUserDto.startDate || createRoutineForUserDto.suggestedStartDate;
    const assignmentEndDate = createRoutineForUserDto.endDate || createRoutineForUserDto.suggestedEndDate;

    if (!assignmentStartDate) {
      throw new BadRequestException('Se requiere startDate o suggestedStartDate para asignar la rutina');
    }

    const userRoutine = this.userRoutineRepository.create({
      user_id: createRoutineForUserDto.user_id,
      routine_id: savedRoutine.id,
      startDate: new Date(assignmentStartDate),
      endDate: assignmentEndDate ? new Date(assignmentEndDate) : null,
      notes: createRoutineForUserDto.notes || 'Rutina creada y asignada automáticamente',
      isActive: true,
    });

    const savedUserRoutine = await this.userRoutineRepository.save(userRoutine);

    // Actualizar el estado hasRoutine del usuario
    await this.usersService.updateUserRoutineStatus(createRoutineForUserDto.user_id, true);

    // Obtener la rutina completa con relaciones
    const completeRoutine = await this.findOne(savedRoutine.id);

    return {
      routine: completeRoutine,
      userRoutine: savedUserRoutine
    };
  }

  async updateRoutineDuration(updateDurationDto: UpdateRoutineDurationDto): Promise<{ userRoutine: UserRoutine; routine: Routine }> {
    // Verificar que el usuario existe
    const user = await this.usersService.findUserById(updateDurationDto.userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Buscar la rutina activa del usuario
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: updateDurationDto.userId,
        isActive: true
      },
      relations: ['routine']
    });

    if (!userRoutine) {
      throw new NotFoundException('Usuario no encontrado o no tiene rutina activa');
    }

    // Validar que la fecha de fin no sea anterior a la fecha de inicio
    if (updateDurationDto.endDate && new Date(updateDurationDto.endDate) <= new Date(updateDurationDto.startDate)) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    // Actualizar las fechas de la rutina del usuario
    userRoutine.startDate = new Date(updateDurationDto.startDate);
    userRoutine.endDate = updateDurationDto.endDate ? new Date(updateDurationDto.endDate) : null;
    
    // Actualizar las notas si se proporcionan
    if (updateDurationDto.notes) {
      userRoutine.notes = updateDurationDto.notes;
    }

    const updatedUserRoutine = await this.userRoutineRepository.save(userRoutine);

    // Obtener la rutina completa
    const routine = await this.findOne(userRoutine.routine_id);

    return {
      userRoutine: updatedUserRoutine,
      routine: routine
    };
  }
}
