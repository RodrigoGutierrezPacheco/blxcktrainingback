import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { UserBase } from './entities/user-base.entity';
import { NormalUser } from './entities/normal-user.entity';
import { Trainer } from './entities/trainer.entity';
import { UserTrainer } from './entities/user-trainer.entity';
import { CreateNormalUserDto } from './dto/create-normal-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { AssignTrainerDto } from './dto/assign-trainer.dto';
import { VerifyTrainerDocumentDto } from './dto/verify-trainer-document.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { TrainerVerificationDocument } from '../modules/trainers/entities/trainer-verification-document.entity';
import { UserRoutine } from '../modules/routines/entities/user-routine.entity';

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

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    @InjectRepository(TrainerVerificationDocument)
    private trainerVerificationDocumentRepository: Repository<TrainerVerificationDocument>,

    @InjectRepository(UserRoutine)
    private userRoutineRepository: Repository<UserRoutine>,
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
      phone: createDto.phone,
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

    if (updateDto.phone !== undefined) {
      updateData.phone = updateDto.phone;
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

    // Actualizar el campo trainerId y marcar hasRoutine como false
    user.trainerId = assignDto.trainerId;
    user.hasRoutine = false; // Marcar hasRoutine como false al asignar entrenador
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

  async getUsersByTrainer(trainerId: string): Promise<any[]> {
    const assignments = await this.userTrainerRepository.find({
      where: { 
        trainer: { id: trainerId },
        isActive: true 
      },
      relations: ['user']
    });

    return Promise.all(assignments.map(async (assignment) => {
      const user = assignment.user;
      
      // Buscar la rutina activa del usuario
      const userRoutine = await this.userRoutineRepository.findOne({
        where: { 
          user_id: user.id,
          isActive: true 
        },
        order: { createdAt: 'DESC' } // Obtener la más reciente
      });

      // Calcular información de la rutina
      const routineInfo = {
        hasRoutine: user.hasRoutine,
        assignedAt: assignment.assignedAt,
        routineEndDate: null as Date | null,
        daysRemaining: null as number | null,
        startDate: null as Date | null,
        endDate: null as Date | null,
        notes: null as string | null
      };

      if (userRoutine) {
        routineInfo.startDate = userRoutine.startDate;
        routineInfo.endDate = userRoutine.endDate;
        routineInfo.notes = userRoutine.notes;
        
        // Usar la fecha real de finalización si existe
        if (userRoutine.endDate) {
          routineInfo.routineEndDate = userRoutine.endDate;
          
          // Crear fechas en UTC para evitar problemas de zona horaria
          const now = new Date();
          const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          
          // Convertir endDate a fecha local (asumiendo formato YYYY-MM-DD)
          const endDateStr = userRoutine.endDate.toString();
          const [year, month, day] = endDateStr.split('-').map(Number);
          const endDate = new Date(year, month - 1, day); // month - 1 porque Date usa 0-indexado
          
          // Calcular diferencia en días
          const timeDiff = endDate.getTime() - today.getTime();
          routineInfo.daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        }
      }

      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        chronicDiseases: user.chronicDiseases,
        dateOfBirth: user.dateOfBirth,
        healthIssues: user.healthIssues,
        phone: user.phone,
        trainerId: user.trainerId,
        hasRoutine: user.hasRoutine,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // Información adicional sobre la rutina
        routineInfo
      };
    }));
  }

  async getUsersWithRoutineByTrainer(trainerId: string): Promise<any[]> {
    const assignments = await this.userTrainerRepository.find({
      where: { 
        trainer: { id: trainerId },
        isActive: true 
      },
      relations: ['user']
    });

    const usersWithRoutine: any[] = [];

    for (const assignment of assignments) {
      const user = assignment.user;
      
      // Solo procesar usuarios que tienen rutina
      if (!user.hasRoutine) {
        continue;
      }

      // Buscar la rutina activa del usuario
      const userRoutine = await this.userRoutineRepository.findOne({
        where: { 
          user_id: user.id,
          isActive: true 
        },
        order: { createdAt: 'DESC' } // Obtener la más reciente
      });

      if (!userRoutine) {
        continue; // Si no tiene rutina activa, saltar
      }

      // Calcular información de la rutina
      const routineInfo = {
        hasRoutine: user.hasRoutine,
        assignedAt: assignment.assignedAt,
        routineEndDate: null as Date | null,
        daysRemaining: null as number | null,
        startDate: userRoutine.startDate,
        endDate: userRoutine.endDate,
        notes: userRoutine.notes
      };

      // Calcular días restantes si tiene fecha de finalización
      if (userRoutine.endDate) {
        routineInfo.routineEndDate = userRoutine.endDate;
        
        // Crear fechas en UTC para evitar problemas de zona horaria
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // Convertir endDate a fecha local (asumiendo formato YYYY-MM-DD)
        const endDateStr = userRoutine.endDate.toString();
        const [year, month, day] = endDateStr.split('-').map(Number);
        const endDate = new Date(year, month - 1, day); // month - 1 porque Date usa 0-indexado
        
        // Calcular diferencia en días
        const timeDiff = endDate.getTime() - today.getTime();
        routineInfo.daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      }

      usersWithRoutine.push({
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        weight: user.weight,
        height: user.height,
        chronicDiseases: user.chronicDiseases,
        dateOfBirth: user.dateOfBirth,
        healthIssues: user.healthIssues,
        phone: user.phone,
        trainerId: user.trainerId,
        hasRoutine: user.hasRoutine,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        // Información de la rutina
        routineInfo
      });
    }

    return usersWithRoutine;
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

    // Limpiar el campo trainerId y marcar hasRoutine como false
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (user && user.trainerId) {
      user.trainerId = null;
      user.hasRoutine = false; // Marcar hasRoutine como false al desasignar entrenador
      await this.userRepository.save(user);
    }
  }

  async getUsersWithTrainers(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'fullName', 'email', 'role', 'age', 'weight', 'height', 'phone', 'trainerId', 'hasRoutine', 'createdAt', 'updatedAt']
    });
  }

  async getTrainerById(trainerId: string): Promise<Partial<Trainer>> {
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId },
      select: [
        'id',
        'email',
        'fullName',
        'role',
        'age',
        'phone',
        'documents',
        'rfc',
        'curp',
        'dateOfBirth',
        'isActive',
        'isVerified',
        'createdAt',
        'updatedAt'
      ]
    });

    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    return trainer;
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

  async findUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
      select: ['id', 'fullName', 'email', 'role', 'age', 'weight', 'height', 'phone', 'dateOfBirth', 'trainerId', 'hasRoutine', 'isActive', 'createdAt', 'updatedAt']
    });
  }

  async findTrainerById(trainerId: string): Promise<Trainer | null> {
    return this.trainerRepository.findOne({
      where: { id: trainerId }
    });
  }

  async updateUserRoutineStatus(userId: string, hasRoutine: boolean): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.hasRoutine = hasRoutine;
    await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: [
        'id',
        'email',
        'fullName',
        'role',
        'age',
        'weight',
        'height',
        'hasRoutine',
        'isActive',
        'createdAt',
        'updatedAt'
      ]
    });
  }

  async findAllAdmins(): Promise<Admin[]> {
    return this.adminRepository.find({
      select: [
        'id',
        'email',
        'fullName',
        'role',
        'createdAt',
        'updatedAt'
      ]
    });
  }

  async findAllTrainers(): Promise<Trainer[]> {
    const trainers = await this.trainerRepository.find({
      select: [
        'id',
        'email',
        'fullName',
        'role',
        'age',
        'phone',
        'isActive',
        'isVerified',
        'createdAt',
        'updatedAt'
      ]
    });

    // Para cada entrenador, obtener el conteo de usuarios asignados y documentos de verificación
    const trainersWithCounts = await Promise.all(
      trainers.map(async (trainer) => {
        const userCount = await this.userTrainerRepository.count({
          where: { 
            trainer: { id: trainer.id },
            isActive: true 
          }
        });

        const documentCount = await this.trainerVerificationDocumentRepository.count({
          where: { 
            trainerId: trainer.id 
          }
        });

        return { 
          ...trainer, 
          assignedUsersCount: userCount,
          verificationDocumentsCount: documentCount
        };
      })
    );

    return trainersWithCounts;
  }

  async findAllNormalUsers(): Promise<User[]> {
    const users = await this.userRepository.find({
      select: [
        'id',
        'email',
        'fullName',
        'role',
        'age',
        'weight',
        'height',
        'trainerId',
        'hasRoutine',
        'isActive',
        'createdAt',
        'updatedAt'
      ],
      order: { fullName: 'ASC' }
    });

    // Para cada usuario, obtener la información del entrenador si tiene uno
    const usersWithTrainerInfo = await Promise.all(
      users.map(async (user) => {
        if (user.trainerId) {
          const trainer = await this.trainerRepository.findOne({
            where: { id: user.trainerId },
            select: ['id', 'fullName', 'email', 'role', 'age', 'phone', 'createdAt', 'updatedAt']
          });
          return { ...user, trainer };
        }
        return { ...user, trainer: null };
      })
    );

    return usersWithTrainerInfo;
  }

  async getUsersWithRoutineDetails(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'fullName', 'email', 'role', 'age', 'weight', 'height', 'phone', 'trainerId', 'hasRoutine', 'isActive', 'createdAt', 'updatedAt'],
      order: { hasRoutine: 'DESC', fullName: 'ASC' }
    });
  }

  async getUsersWithoutRoutine(): Promise<User[]> {
    return this.userRepository.find({
      where: { hasRoutine: false },
      select: ['id', 'fullName', 'email', 'role', 'age', 'weight', 'height', 'trainerId', 'hasRoutine', 'isActive', 'createdAt', 'updatedAt']
    });
  }

  async getUsersWithRoutine(): Promise<User[]> {
    return this.userRepository.find({
      where: { hasRoutine: true },
      select: ['id', 'fullName', 'email', 'role', 'age', 'weight', 'height', 'trainerId', 'hasRoutine', 'isActive', 'createdAt', 'updatedAt']
    });
  }

  async getUsersWithoutTrainer(): Promise<User[]> {
    return this.userRepository.find({
      where: { 
        role: 'user',
        trainerId: IsNull(),
        isActive: true 
      },
      select: ['id', 'fullName', 'email', 'role', 'age', 'weight', 'height', 'phone', 'trainerId', 'hasRoutine', 'isActive', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' }
    });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: true },
      select: [
        'id',
        'email',
        'fullName',
        'role',
        'age',
        'weight',
        'height',
        'hasRoutine',
        'isActive',
        'createdAt',
        'updatedAt'
      ]
    });
  }

  async findInactiveUsers(): Promise<User[]> {
    return this.userRepository.find({
      where: { isActive: false },
      select: [
        'id',
        'email',
        'fullName',
        'role',
        'age',
        'weight',
        'height',
        'hasRoutine',
        'isActive',
        'createdAt',
        'updatedAt'
      ]
    });
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Soft delete: cambiar status a false en lugar de eliminar
    user.isActive = false;
    await this.userRepository.save(user);
  }

  async activateUser(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    user.isActive = true;
    await this.userRepository.save(user);
  }

  async toggleUserStatus(userId: string): Promise<{ isActive: boolean }> {
    const user = await this.userRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Cambiar el status: si es true pasa a false, si es false pasa a true
    user.isActive = !user.isActive;
    await this.userRepository.save(user);

    return { isActive: user.isActive };
  }

  async toggleTrainerStatus(trainerId: string): Promise<{ isActive: boolean }> {
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId }
    });

    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    // Cambiar el status: si es true pasa a false, si es false pasa a true
    trainer.isActive = !trainer.isActive;
    await this.trainerRepository.save(trainer);

    return { isActive: trainer.isActive };
  }

  async toggleTrainerVerificationStatus(trainerId: string): Promise<{ isVerified: boolean }> {
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId }
    });

    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    // Cambiar el status de verificación: si es true pasa a false, si es false pasa a true
    trainer.isVerified = !trainer.isVerified;
    await this.trainerRepository.save(trainer);

    return { isVerified: trainer.isVerified };
  }

  async updateTrainer(trainerId: string, updateDto: UpdateTrainerDto): Promise<Partial<Trainer>> {
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId }
    });

    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    // Preparar los datos de actualización
    const updateData: Partial<Trainer> = {};

    if (updateDto.fullName) {
      updateData.fullName = updateDto.fullName;
    }

    if (updateDto.age !== undefined) {
      updateData.age = updateDto.age;
    }

    if (updateDto.phone) {
      updateData.phone = updateDto.phone;
    }

    if (updateDto.documents) {
      updateData.documents = updateDto.documents;
    }

    if (updateDto.rfc !== undefined) {
      updateData.rfc = updateDto.rfc;
    }

    if (updateDto.curp !== undefined) {
      updateData.curp = updateDto.curp;
    }

    if (updateDto.dateOfBirth) {
      updateData.dateOfBirth = new Date(updateDto.dateOfBirth);
    }

    // Aplicar las actualizaciones
    Object.assign(trainer, updateData);
    
    const updatedTrainer = await this.trainerRepository.save(trainer);
    
    // Retornar el entrenador sin la contraseña
    const { password, ...result } = updatedTrainer;
    return result;
  }

  async getTrainerDocuments(trainerId: string): Promise<TrainerVerificationDocument[]> {
    // Verificar que el entrenador existe
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId }
    });

    if (!trainer) {
      throw new NotFoundException('Entrenador no encontrado');
    }

    // Obtener todos los documentos de verificación del entrenador
    const documents = await this.trainerVerificationDocumentRepository.find({
      where: { trainerId },
      order: { createdAt: 'DESC' }
    });

    return documents;
  }

  async getTrainerDocumentById(documentId: string): Promise<TrainerVerificationDocument> {
    // Obtener un documento específico por su ID
    const document = await this.trainerVerificationDocumentRepository.findOne({
      where: { id: documentId },
      relations: ['trainer']
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    return document;
  }

  async verifyTrainerDocument(documentId: string, verifyDto: VerifyTrainerDocumentDto, adminId: string): Promise<TrainerVerificationDocument> {
    // Obtener el documento
    const document = await this.trainerVerificationDocumentRepository.findOne({
      where: { id: documentId }
    });

    if (!document) {
      throw new NotFoundException('Documento no encontrado');
    }

    // Verificar que el admin existe
    const admin = await this.adminRepository.findOne({
      where: { id: adminId }
    });

    if (!admin) {
      throw new NotFoundException('Administrador no encontrado');
    }

    // Actualizar el documento con la verificación
    document.verificationStatus = verifyDto.verificationStatus;
    document.verificationNotes = verifyDto.verificationNotes;
    document.verifiedBy = adminId;
    document.verifiedAt = new Date();

    // Guardar los cambios
    await this.trainerVerificationDocumentRepository.save(document);

    // Retornar el documento actualizado con la relación del entrenador
    const updatedDocument = await this.trainerVerificationDocumentRepository.findOne({
      where: { id: documentId },
      relations: ['trainer']
    });

    if (!updatedDocument) {
      throw new NotFoundException('Error al actualizar el documento');
    }

    return updatedDocument;
  }
}