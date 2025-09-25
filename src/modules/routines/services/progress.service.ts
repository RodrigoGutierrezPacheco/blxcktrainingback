import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserExerciseProgress } from '../entities/user-exercise-progress.entity';
import { UserDayProgress } from '../entities/user-day-progress.entity';
import { UserWeekProgress } from '../entities/user-week-progress.entity';
import { UserRoutineProgress } from '../entities/user-routine-progress.entity';
import { Exercise } from '../entities/exercise.entity';
import { Day } from '../entities/day.entity';
import { Week } from '../entities/week.entity';
import { Routine } from '../entities/routine.entity';
import { UserRoutine } from '../entities/user-routine.entity';
import { MarkExerciseCompletedDto } from '../dto/mark-exercise-completed.dto';
import { MarkDayCompletedDto } from '../dto/mark-day-completed.dto';
import { MarkWeekCompletedDto } from '../dto/mark-week-completed.dto';
import { MarkRoutineCompletedDto } from '../dto/mark-routine-completed.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UserExerciseProgress)
    private exerciseProgressRepository: Repository<UserExerciseProgress>,
    @InjectRepository(UserDayProgress)
    private dayProgressRepository: Repository<UserDayProgress>,
    @InjectRepository(UserWeekProgress)
    private weekProgressRepository: Repository<UserWeekProgress>,
    @InjectRepository(UserRoutineProgress)
    private routineProgressRepository: Repository<UserRoutineProgress>,
    @InjectRepository(Exercise)
    private exerciseRepository: Repository<Exercise>,
    @InjectRepository(Day)
    private dayRepository: Repository<Day>,
    @InjectRepository(Week)
    private weekRepository: Repository<Week>,
    @InjectRepository(Routine)
    private routineRepository: Repository<Routine>,
    @InjectRepository(UserRoutine)
    private userRoutineRepository: Repository<UserRoutine>,
  ) {}

  async markExerciseCompleted(userId: string, markDto: MarkExerciseCompletedDto): Promise<UserExerciseProgress> {
    // Verificar que el ejercicio existe
    const exercise = await this.exerciseRepository.findOne({
      where: { id: markDto.exerciseId },
      relations: ['day', 'day.week', 'day.week.routine']
    });

    if (!exercise) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    // Verificar que el usuario tiene la rutina asignada
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: userId,
        routine_id: exercise.day.week.routine.id,
        isActive: true
      }
    });

    if (!userRoutine) {
      throw new BadRequestException('No tienes esta rutina asignada');
    }

    // Buscar o crear el progreso del ejercicio
    let exerciseProgress = await this.exerciseProgressRepository.findOne({
      where: {
        user_id: userId,
        exercise_id: markDto.exerciseId
      }
    });

    if (!exerciseProgress) {
      exerciseProgress = this.exerciseProgressRepository.create({
        user_id: userId,
        exercise_id: markDto.exerciseId,
        isCompleted: markDto.isCompleted,
        completedAt: markDto.isCompleted ? new Date() : null,
        progressData: markDto.progressData || null
      });
    } else {
      exerciseProgress.isCompleted = markDto.isCompleted;
      exerciseProgress.completedAt = markDto.isCompleted ? new Date() : null;
      exerciseProgress.progressData = markDto.progressData || exerciseProgress.progressData;
    }

    const savedProgress = await this.exerciseProgressRepository.save(exerciseProgress);

    // Actualizar progreso del día si es necesario
    if (markDto.isCompleted) {
      await this.updateDayProgress(userId, exercise.day.id);
    }

    return savedProgress;
  }

  async markDayCompleted(userId: string, markDto: MarkDayCompletedDto): Promise<UserDayProgress> {
    // Verificar que el día existe
    const day = await this.dayRepository.findOne({
      where: { id: markDto.dayId },
      relations: ['week', 'week.routine']
    });

    if (!day) {
      throw new NotFoundException('Día no encontrado');
    }

    // Verificar que el usuario tiene la rutina asignada
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: userId,
        routine_id: day.week.routine.id,
        isActive: true
      }
    });

    if (!userRoutine) {
      throw new BadRequestException('No tienes esta rutina asignada');
    }

    // Buscar o crear el progreso del día
    let dayProgress = await this.dayProgressRepository.findOne({
      where: {
        user_id: userId,
        day_id: markDto.dayId
      }
    });

    if (!dayProgress) {
      dayProgress = this.dayProgressRepository.create({
        user_id: userId,
        day_id: markDto.dayId,
        isCompleted: markDto.isCompleted,
        completedAt: markDto.isCompleted ? new Date() : null,
        notes: markDto.notes || null,
        durationMinutes: markDto.durationMinutes || null
      });
    } else {
      dayProgress.isCompleted = markDto.isCompleted;
      dayProgress.completedAt = markDto.isCompleted ? new Date() : null;
      dayProgress.notes = markDto.notes || dayProgress.notes;
      dayProgress.durationMinutes = markDto.durationMinutes || dayProgress.durationMinutes;
    }

    const savedProgress = await this.dayProgressRepository.save(dayProgress);

    // Actualizar progreso de la semana si es necesario
    if (markDto.isCompleted) {
      await this.updateWeekProgress(userId, day.week.id);
    }

    return savedProgress;
  }

  async markWeekCompleted(userId: string, markDto: MarkWeekCompletedDto): Promise<UserWeekProgress> {
    // Verificar que la semana existe
    const week = await this.weekRepository.findOne({
      where: { id: markDto.weekId },
      relations: ['routine']
    });

    if (!week) {
      throw new NotFoundException('Semana no encontrada');
    }

    // Verificar que el usuario tiene la rutina asignada
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: userId,
        routine_id: week.routine.id,
        isActive: true
      }
    });

    if (!userRoutine) {
      throw new BadRequestException('No tienes esta rutina asignada');
    }

    // Buscar o crear el progreso de la semana
    let weekProgress = await this.weekProgressRepository.findOne({
      where: {
        user_id: userId,
        week_id: markDto.weekId
      }
    });

    if (!weekProgress) {
      weekProgress = this.weekProgressRepository.create({
        user_id: userId,
        week_id: markDto.weekId,
        isCompleted: markDto.isCompleted,
        completedAt: markDto.isCompleted ? new Date() : null,
        notes: markDto.notes || null,
        totalMinutes: markDto.totalMinutes || null
      });
    } else {
      weekProgress.isCompleted = markDto.isCompleted;
      weekProgress.completedAt = markDto.isCompleted ? new Date() : null;
      weekProgress.notes = markDto.notes || weekProgress.notes;
      weekProgress.totalMinutes = markDto.totalMinutes || weekProgress.totalMinutes;
    }

    const savedProgress = await this.weekProgressRepository.save(weekProgress);

    // Actualizar progreso de la rutina si es necesario
    if (markDto.isCompleted) {
      await this.updateRoutineProgress(userId, week.routine.id);
    }

    return savedProgress;
  }

  async markRoutineCompleted(userId: string, markDto: MarkRoutineCompletedDto): Promise<UserRoutineProgress> {
    // Verificar que la rutina existe
    const routine = await this.routineRepository.findOne({
      where: { id: markDto.routineId }
    });

    if (!routine) {
      throw new NotFoundException('Rutina no encontrada');
    }

    // Verificar que el usuario tiene la rutina asignada
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: userId,
        routine_id: markDto.routineId,
        isActive: true
      }
    });

    if (!userRoutine) {
      throw new BadRequestException('No tienes esta rutina asignada');
    }

    // Buscar o crear el progreso de la rutina
    let routineProgress = await this.routineProgressRepository.findOne({
      where: {
        user_id: userId,
        routine_id: markDto.routineId
      }
    });

    if (!routineProgress) {
      routineProgress = this.routineProgressRepository.create({
        user_id: userId,
        routine_id: markDto.routineId,
        isCompleted: markDto.isCompleted,
        completedAt: markDto.isCompleted ? new Date() : null,
        notes: markDto.notes || null,
        totalMinutes: markDto.totalMinutes || null
      });
    } else {
      routineProgress.isCompleted = markDto.isCompleted;
      routineProgress.completedAt = markDto.isCompleted ? new Date() : null;
      routineProgress.notes = markDto.notes || routineProgress.notes;
      routineProgress.totalMinutes = markDto.totalMinutes || routineProgress.totalMinutes;
    }

    return await this.routineProgressRepository.save(routineProgress);
  }

  private async updateDayProgress(userId: string, dayId: string): Promise<void> {
    // Contar ejercicios completados en el día
    const completedExercises = await this.exerciseProgressRepository.count({
      where: {
        user_id: userId,
        exercise: { day_id: dayId },
        isCompleted: true
      }
    });

    // Contar total de ejercicios en el día
    const totalExercises = await this.exerciseRepository.count({
      where: { day_id: dayId }
    });

    // Si todos los ejercicios están completados, marcar el día como completado
    if (completedExercises === totalExercises && totalExercises > 0) {
      const dayProgress = await this.dayProgressRepository.findOne({
        where: { user_id: userId, day_id: dayId }
      });

      if (dayProgress && !dayProgress.isCompleted) {
        dayProgress.isCompleted = true;
        dayProgress.completedAt = new Date();
        await this.dayProgressRepository.save(dayProgress);
      }
    }
  }

  private async updateWeekProgress(userId: string, weekId: string): Promise<void> {
    // Contar días completados en la semana
    const completedDays = await this.dayProgressRepository.count({
      where: {
        user_id: userId,
        day: { week_id: weekId },
        isCompleted: true
      }
    });

    // Contar total de días en la semana
    const totalDays = await this.dayRepository.count({
      where: { week_id: weekId }
    });

    // Actualizar el contador de días completados
    const weekProgress = await this.weekProgressRepository.findOne({
      where: { user_id: userId, week_id: weekId }
    });

    if (weekProgress) {
      weekProgress.completedDays = completedDays;
      await this.weekProgressRepository.save(weekProgress);
    }

    // Si todos los días están completados, marcar la semana como completada
    if (completedDays === totalDays && totalDays > 0) {
      if (weekProgress && !weekProgress.isCompleted) {
        weekProgress.isCompleted = true;
        weekProgress.completedAt = new Date();
        await this.weekProgressRepository.save(weekProgress);
      }
    }
  }

  private async updateRoutineProgress(userId: string, routineId: string): Promise<void> {
    // Contar semanas completadas en la rutina
    const completedWeeks = await this.weekProgressRepository.count({
      where: {
        user_id: userId,
        week: { routine_id: routineId },
        isCompleted: true
      }
    });

    // Contar días completados en la rutina
    const completedDays = await this.dayProgressRepository.count({
      where: {
        user_id: userId,
        day: { week: { routine_id: routineId } },
        isCompleted: true
      }
    });

    // Contar ejercicios completados en la rutina
    const completedExercises = await this.exerciseProgressRepository.count({
      where: {
        user_id: userId,
        exercise: { day: { week: { routine_id: routineId } } },
        isCompleted: true
      }
    });

    // Contar total de semanas en la rutina
    const totalWeeks = await this.weekRepository.count({
      where: { routine_id: routineId }
    });

    // Actualizar el progreso de la rutina
    const routineProgress = await this.routineProgressRepository.findOne({
      where: { user_id: userId, routine_id: routineId }
    });

    if (routineProgress) {
      routineProgress.completedWeeks = completedWeeks;
      routineProgress.completedDays = completedDays;
      routineProgress.completedExercises = completedExercises;
      await this.routineProgressRepository.save(routineProgress);
    }

    // Si todas las semanas están completadas, marcar la rutina como completada
    if (completedWeeks === totalWeeks && totalWeeks > 0) {
      if (routineProgress && !routineProgress.isCompleted) {
        routineProgress.isCompleted = true;
        routineProgress.completedAt = new Date();
        await this.routineProgressRepository.save(routineProgress);
      }
    }
  }

  async getUserProgress(userId: string, routineId: string): Promise<any> {
    // Verificar que el usuario tiene la rutina asignada
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: userId,
        routine_id: routineId,
        isActive: true
      }
    });

    if (!userRoutine) {
      throw new BadRequestException('No tienes esta rutina asignada');
    }

    // Obtener progreso de la rutina
    const routineProgress = await this.routineProgressRepository.findOne({
      where: { user_id: userId, routine_id: routineId }
    });

    // Obtener progreso de las semanas
    const weekProgress = await this.weekProgressRepository.find({
      where: { user_id: userId, week: { routine_id: routineId } },
      relations: ['week']
    });

    // Obtener progreso de los días
    const dayProgress = await this.dayProgressRepository.find({
      where: { user_id: userId, day: { week: { routine_id: routineId } } },
      relations: ['day', 'day.week']
    });

    // Obtener progreso de los ejercicios
    const exerciseProgress = await this.exerciseProgressRepository.find({
      where: { user_id: userId, exercise: { day: { week: { routine_id: routineId } } } },
      relations: ['exercise', 'exercise.day', 'exercise.day.week']
    });

    return {
      routine: routineProgress,
      weeks: weekProgress,
      days: dayProgress,
      exercises: exerciseProgress
    };
  }

  // ===== MÉTODOS SIMPLIFICADOS =====

  async markExerciseSimple(userId: string, exerciseId: string, isCompleted: boolean = true): Promise<UserExerciseProgress> {
    // Verificar que el ejercicio existe y pertenece a una rutina del usuario
    const exercise = await this.exerciseRepository.findOne({
      where: { id: exerciseId },
      relations: ['day', 'day.week', 'day.week.routine']
    });

    if (!exercise) {
      throw new NotFoundException('Ejercicio no encontrado');
    }

    // Verificar que el usuario tiene esta rutina asignada
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: userId,
        routine_id: exercise.day.week.routine.id,
        isActive: true
      }
    });

    if (!userRoutine) {
      throw new BadRequestException('No tienes acceso a este ejercicio');
    }

    // Buscar o crear el progreso del ejercicio
    let progress = await this.exerciseProgressRepository.findOne({
      where: {
        user_id: userId,
        exercise_id: exerciseId
      }
    });

    if (progress) {
      // Actualizar progreso existente
      progress.isCompleted = isCompleted;
      progress.completedAt = isCompleted ? new Date() : null;
      return await this.exerciseProgressRepository.save(progress);
    } else {
      // Crear nuevo progreso
      progress = this.exerciseProgressRepository.create({
        user_id: userId,
        exercise_id: exerciseId,
        isCompleted: isCompleted,
        completedAt: isCompleted ? new Date() : null
      });
      return await this.exerciseProgressRepository.save(progress);
    }
  }

  async markDaySimple(userId: string, dayId: string, isCompleted: boolean = true): Promise<UserDayProgress> {
    // Verificar que el día existe y pertenece a una rutina del usuario
    const day = await this.dayRepository.findOne({
      where: { id: dayId },
      relations: ['week', 'week.routine']
    });

    if (!day) {
      throw new NotFoundException('Día no encontrado');
    }

    // Verificar que el usuario tiene esta rutina asignada
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: userId,
        routine_id: day.week.routine.id,
        isActive: true
      }
    });

    if (!userRoutine) {
      throw new BadRequestException('No tienes acceso a este día');
    }

    // Buscar o crear el progreso del día
    let progress = await this.dayProgressRepository.findOne({
      where: {
        user_id: userId,
        day_id: dayId
      }
    });

    if (progress) {
      // Actualizar progreso existente
      progress.isCompleted = isCompleted;
      progress.completedAt = isCompleted ? new Date() : null;
      return await this.dayProgressRepository.save(progress);
    } else {
      // Crear nuevo progreso
      progress = this.dayProgressRepository.create({
        user_id: userId,
        day_id: dayId,
        isCompleted: isCompleted,
        completedAt: isCompleted ? new Date() : null
      });
      return await this.dayProgressRepository.save(progress);
    }
  }

  async markWeekSimple(userId: string, weekId: string, isCompleted: boolean = true): Promise<UserWeekProgress> {
    // Verificar que la semana existe y pertenece a una rutina del usuario
    const week = await this.weekRepository.findOne({
      where: { id: weekId },
      relations: ['routine']
    });

    if (!week) {
      throw new NotFoundException('Semana no encontrada');
    }

    // Verificar que el usuario tiene esta rutina asignada
    const userRoutine = await this.userRoutineRepository.findOne({
      where: {
        user_id: userId,
        routine_id: week.routine.id,
        isActive: true
      }
    });

    if (!userRoutine) {
      throw new BadRequestException('No tienes acceso a esta semana');
    }

    // Buscar o crear el progreso de la semana
    let progress = await this.weekProgressRepository.findOne({
      where: {
        user_id: userId,
        week_id: weekId
      }
    });

    if (progress) {
      // Actualizar progreso existente
      progress.isCompleted = isCompleted;
      progress.completedAt = isCompleted ? new Date() : null;
      return await this.weekProgressRepository.save(progress);
    } else {
      // Crear nuevo progreso
      progress = this.weekProgressRepository.create({
        user_id: userId,
        week_id: weekId,
        isCompleted: isCompleted,
        completedAt: isCompleted ? new Date() : null
      });
      return await this.weekProgressRepository.save(progress);
    }
  }
}
