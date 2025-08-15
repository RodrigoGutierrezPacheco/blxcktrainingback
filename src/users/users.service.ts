import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBase } from './entities/user-base.entity';
import { NormalUser } from './entities/normal-user.entity';
import { Trainer } from './entities/trainer.entity';
import { UserTrainer } from './entities/user-trainer.entity';
import { CreateNormalUserDto } from './dto/create-normal-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignTrainerDto } from './dto/assign-trainer.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserBase)
    private userBaseRepository: Repository<UserBase>,
    
    @InjectRepository(NormalUser)
    private normalUserRepository: Repository<NormalUser>,

    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,

    @InjectRepository(UserTrainer)
    private userTrainerRepository: Repository<UserTrainer>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createNormalUser(createDto: CreateNormalUserDto): Promise<NormalUser> {
    const existingUser = await this.userBaseRepository.findOne({ 
      where: { email: createDto.email } 
    });
    
    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    // Crear UserBase primero
    const baseUser = this.userBaseRepository.create({
      fullName: createDto.fullName,
      email: createDto.email,
      password: createDto.password,
      userType: 'user'
    });

    await this.userBaseRepository.save(baseUser);

    // Luego crear NormalUser
    const normalUser = this.normalUserRepository.create({
      baseUser,
      routine: createDto.routine,
      basicInfo: createDto.basicInfo || {}
    });

    return this.normalUserRepository.save(normalUser);
  }

  async findByEmail(email: string): Promise<NormalUser | null> {
    return this.normalUserRepository.findOne({
      where: { baseUser: { email } },
      relations: ['baseUser']
    });
  }

  async updateUser(userId: string, updateDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Preparar los datos de actualización
    const updateData: Partial<User> = {};

    if (updateDto.fullName) {
      updateData.fullName = updateDto.fullName;
    }

    if (updateDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateDto.dateOfBirth);
    }

    if (updateDto.healthIssues !== undefined) {
      updateData.healthIssues = updateDto.healthIssues;
    }

    if (updateDto.password) {
      // Hashear la nueva contraseña
      updateData.password = await bcrypt.hash(updateDto.password, 10);
    }

    if (updateDto.age !== undefined) {
      updateData.age = updateDto.age;
    }

    if (updateDto.weight !== undefined) {
      updateData.weight = updateDto.weight;
    }

    if (updateDto.height !== undefined) {
      updateData.height = updateDto.height;
    }

    // Aplicar las actualizaciones
    Object.assign(user, updateData);
    
    const updatedUser = await this.userRepository.save(user);
    
    // Retornar el usuario sin la contraseña
    const { password, ...result } = updatedUser;
    return result as User;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Retornar el usuario sin la contraseña por seguridad
    const { password, ...result } = user;
    return result as User;
  }

  async assignTrainerToUser(assignDto: AssignTrainerDto): Promise<UserTrainer> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOne({
      where: { id: assignDto.userId }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar que el entrenador existe
    const trainer = await this.trainerRepository.findOne({
      where: { id: assignDto.trainerId }
    });

    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    // Verificar si el usuario ya tiene un entrenador activo
    const existingAssignment = await this.userTrainerRepository.findOne({
      where: { 
        user: { id: assignDto.userId },
        isActive: true 
      }
    });

    if (existingAssignment) {
      // Desactivar la asignación anterior
      existingAssignment.isActive = false;
      await this.userTrainerRepository.save(existingAssignment);
    }

    // Actualizar el campo trainerId en la entidad User
    user.trainerId = assignDto.trainerId;
    await this.userRepository.save(user);

    // Crear nueva asignación
    const userTrainer = this.userTrainerRepository.create({
      user,
      trainer,
      assignedAt: new Date(),
      isActive: true
    });

    return this.userTrainerRepository.save(userTrainer);
  }

  async getUsersByTrainer(trainerId: string): Promise<User[]> {
    const assignments = await this.userTrainerRepository.find({
      where: { 
        trainer: { id: trainerId },
        isActive: true 
      },
      relations: ['user']
    });

    return assignments.map(assignment => assignment.user);
  }

  async getTrainerByUser(userId: string): Promise<Trainer | null> {
    const assignment = await this.userTrainerRepository.findOne({
      where: { 
        user: { id: userId },
        isActive: true 
      },
      relations: ['trainer']
    });

    return assignment ? assignment.trainer : null;
  }

  async removeTrainerFromUser(userId: string): Promise<void> {
    const assignment = await this.userTrainerRepository.findOne({
      where: { 
        user: { id: userId },
        isActive: true 
      }
    });

    if (assignment) {
      assignment.isActive = false;
      await this.userTrainerRepository.save(assignment);
    }

    // Limpiar el campo trainerId en la entidad User
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (user && user.trainerId) {
      user.trainerId = null;
      await this.userRepository.save(user);
    }
  }

  async getUsersWithTrainers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'fullName', 'email', 'role', 'age', 'weight', 'height', 'trainerId', 'createdAt', 'updatedAt']
    });
  }

  async getTrainerById(trainerId: string): Promise<Partial<Trainer>> {
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId }
    });

    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    // Retornar el entrenador sin la contraseña por seguridad
    const { password, ...trainerInfo } = trainer;
    return trainerInfo;
  }

  async getTrainerProfile(trainerId: string): Promise<Partial<Trainer>> {
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId }
    });

    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }
    console.log(trainer)
    // Retornar el entrenador sin la contraseña por seguridad
    const { password, ...trainerInfo } = trainer;
    return trainerInfo;
  }
}