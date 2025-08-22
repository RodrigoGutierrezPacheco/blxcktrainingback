import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { JwtGuard } from '../../auth/guards/jwt/jwt.guard';

@Controller('plans')
@UseGuards(JwtGuard)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post()
  create(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.create(createPlanDto);
  }

  @Get()
  findAll() {
    return this.plansService.findAll();
  }

  @Get('all')
  findAllIncludingInactive() {
    return this.plansService.findAllIncludingInactive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.plansService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.update(id, updatePlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.plansService.remove(id);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.plansService.softDelete(id);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: string) {
    return this.plansService.activate(id);
  }

  @Get('search/price-range')
  findByPriceRange(
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    
    if (isNaN(min) || isNaN(max)) {
      throw new Error('minPrice and maxPrice must be valid numbers');
    }
    
    return this.plansService.findByPriceRange(min, max);
  }

  @Get('search/duration/:duration')
  findByDuration(@Param('duration') duration: string) {
    return this.plansService.findByDuration(duration);
  }

  @Get('type/:type')
  findByType(@Param('type') type: 'user' | 'trainer') {
    if (!['user', 'trainer'].includes(type)) {
      throw new Error('Type must be either "user" or "trainer"');
    }
    return this.plansService.findByType(type);
  }

  @Get('search/type/:type/price-range')
  findByTypeAndPriceRange(
    @Param('type') type: 'user' | 'trainer',
    @Query('minPrice') minPrice: string,
    @Query('maxPrice') maxPrice: string,
  ) {
    if (!['user', 'trainer'].includes(type)) {
      throw new Error('Type must be either "user" or "trainer"');
    }
    
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    
    if (isNaN(min) || isNaN(max)) {
      throw new Error('minPrice and maxPrice must be valid numbers');
    }
    
    return this.plansService.findByTypeAndPriceRange(type, min, max);
  }
}
