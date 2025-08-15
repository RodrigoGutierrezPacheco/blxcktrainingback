import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBase } from './entities/user-base.entity';
import { NormalUser } from './entities/normal-user.entity';
import { CreateNormalUserDto } from './dto/create-normal-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserBase)
    private userBaseRepository: Repository<UserBase>,
    
    @InjectRepository(NormalUser)
    private normalUserRepository: Repository<NormalUser>,

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
}