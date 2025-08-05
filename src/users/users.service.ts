import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBase } from './entities/user-base.entity';
import { NormalUser } from './entities/normal-user.entity';
import { CreateNormalUserDto } from './dto/create-normal-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserBase)
    private userBaseRepository: Repository<UserBase>,
    
    @InjectRepository(NormalUser)
    private normalUserRepository: Repository<NormalUser>,
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
}