import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Plan } from './entities/plan.entity';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private planRepository: Repository<Plan>,
  ) {}

  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const plan = this.planRepository.create(createPlanDto);
    return await this.planRepository.save(plan);
  }

  async findAll(): Promise<Plan[]> {
    return await this.planRepository.find({
      where: { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findAllIncludingInactive(): Promise<Plan[]> {
    return await this.planRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Plan> {
    const plan = await this.planRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async update(id: string, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOne(id);
    
    // Actualizar solo los campos proporcionados
    Object.assign(plan, updatePlanDto);
    
    return await this.planRepository.save(plan);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.findOne(id);
    await this.planRepository.remove(plan);
  }

  async softDelete(id: string): Promise<void> {
    const plan = await this.findOne(id);
    plan.isActive = false;
    await this.planRepository.save(plan);
  }

  async activate(id: string): Promise<void> {
    const plan = await this.findOne(id);
    plan.isActive = true;
    await this.planRepository.save(plan);
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<Plan[]> {
    return await this.planRepository
      .createQueryBuilder('plan')
      .where('plan.price >= :minPrice', { minPrice })
      .andWhere('plan.price <= :maxPrice', { maxPrice })
      .andWhere('plan.isActive = :isActive', { isActive: true })
      .orderBy('plan.price', 'ASC')
      .getMany();
  }

  async findByDuration(duration: string): Promise<Plan[]> {
    return await this.planRepository.find({
      where: { duration, isActive: true },
      order: { price: 'ASC' },
    });
  }

  async findByType(type: 'user' | 'trainer'): Promise<Plan[]> {
    return await this.planRepository.find({
      where: { type, isActive: true },
      order: { price: 'ASC' },
    });
  }

  async findByTypeAndPriceRange(
    type: 'user' | 'trainer',
    minPrice: number,
    maxPrice: number,
  ): Promise<Plan[]> {
    return await this.planRepository
      .createQueryBuilder('plan')
      .where('plan.type = :type', { type })
      .andWhere('plan.price >= :minPrice', { minPrice })
      .andWhere('plan.price <= :maxPrice', { maxPrice })
      .andWhere('plan.isActive = :isActive', { isActive: true })
      .orderBy('plan.price', 'ASC')
      .getMany();
  }
}
