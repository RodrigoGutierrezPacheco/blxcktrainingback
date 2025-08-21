import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routine } from './entities/routine.entity';
import { Week } from './entities/week.entity';
import { Day } from './entities/day.entity';
import { Exercise } from './entities/exercise.entity';
import { UserRoutine } from './entities/user-routine.entity';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AssignRoutineDto } from './dto/assign-routine.dto';
import { UsersService } from '../../users/users.service';

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
      relations: ['trainer', 'weeks', 'weeks.days', 'weeks.days.exercises'],
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

  async findByTrainer(trainerId: string): Promise<Routine[]> {
    return this.routineRepository.find({
      where: { trainer_id: trainerId },
      relations: ['weeks', 'weeks.days', 'weeks.days.exercises'],
    });
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

    // Verificar que no haya una asignación activa
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

    const userRoutine = this.userRoutineRepository.create({
      user_id: assignRoutineDto.user_id,
      routine_id: assignRoutineDto.routine_id,
      startDate: new Date(assignRoutineDto.startDate),
      endDate: assignRoutineDto.endDate ? new Date(assignRoutineDto.endDate) : null,
      notes: assignRoutineDto.notes,
      isActive: true,
    });

    return this.userRoutineRepository.save(userRoutine);
  }

  async getUserRoutines(userId: string): Promise<UserRoutine[]> {
    return this.userRoutineRepository.find({
      where: { user_id: userId },
      relations: ['routine', 'routine.weeks', 'routine.weeks.days', 'routine.weeks.days.exercises'],
    });
  }

  async getUserRoutinesByEmail(email: string): Promise<UserRoutine[]> {
    // Primero buscar el usuario por email usando getUserByEmail que retorna User con UUID
    const user = await this.usersService.getUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    // Luego buscar las rutinas del usuario usando el ID del usuario (que es UUID)
    return this.userRoutineRepository.find({
      where: { user_id: user.id },
      relations: ['routine', 'routine.weeks', 'routine.weeks.days', 'routine.weeks.days.exercises'],
    });
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
  }
}
