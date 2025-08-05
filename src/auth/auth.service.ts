import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Trainer } from 'src/users/entities/trainer.entity';
import { Admin } from 'src/users/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    
    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,
    
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async registerUser(createDto: { fullName: string, email: string, password: string }) {
    await this.checkEmailExists(createDto.email);
    
    const user = this.userRepository.create(createDto);
    return this.userRepository.save(user);
  }

  async registerTrainer(createDto: { fullName: string, email: string, password: string }) {
    await this.checkEmailExists(createDto.email);
    
    const trainer = this.trainerRepository.create(createDto);
    return this.trainerRepository.save(trainer);
  }

  async registerAdmin(createDto: { fullName: string, email: string, password: string }) {
    await this.checkEmailExists(createDto.email);
    
    const admin = this.adminRepository.create(createDto);
    return this.adminRepository.save(admin);
  }

  private async checkEmailExists(email: string) {
    const existsInUsers = await this.userRepository.findOne({ where: { email } });
    const existsInTrainers = await this.trainerRepository.findOne({ where: { email } });
    const existsInAdmins = await this.adminRepository.findOne({ where: { email } });
    
    if (existsInUsers || existsInTrainers || existsInAdmins) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }
  }
}