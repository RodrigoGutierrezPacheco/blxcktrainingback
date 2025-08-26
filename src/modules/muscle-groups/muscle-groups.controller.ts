import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { MuscleGroupsService } from './muscle-groups.service';
import { CreateMuscleGroupDto } from './dto/create-muscle-group.dto';
import { UpdateMuscleGroupDto } from './dto/update-muscle-group.dto';
import { JwtGuard } from '../../auth/guards/jwt/jwt.guard';

@Controller('muscle-groups')
@UseGuards(JwtGuard)
export class MuscleGroupsController {
  constructor(private readonly muscleGroupsService: MuscleGroupsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateMuscleGroupDto) {
    return this.muscleGroupsService.create(createDto);
  }

  @Get()
  findAll() {
    return this.muscleGroupsService.findAll();
  }

  @Get('active')
  findAllActive() {
    return this.muscleGroupsService.findAllActive();
  }

  @Get('all')
  findAllIncludingInactive() {
    return this.muscleGroupsService.findAllIncludingInactive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.muscleGroupsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateDto: UpdateMuscleGroupDto) {
    return this.muscleGroupsService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.muscleGroupsService.remove(id);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  activate(@Param('id') id: string) {
    return this.muscleGroupsService.activate(id);
  }

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  toggleStatus(@Param('id') id: string) {
    return this.muscleGroupsService.toggleStatus(id);
  }
}
