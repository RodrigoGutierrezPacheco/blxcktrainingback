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
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { JwtGuard } from '../../auth/guards/jwt/jwt.guard';

@Controller('exercises')
@UseGuards(JwtGuard)
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createDto: CreateExerciseDto) {
    return this.exercisesService.create(createDto);
  }

  @Get()
  findAll() {
    return this.exercisesService.findAll();
  }

  @Get('active')
  findAllActive() {
    return this.exercisesService.findAllActive();
  }

  @Get('all')
  findAllIncludingInactive() {
    return this.exercisesService.findAllIncludingInactive();
  }

  @Get('muscle-group/:muscleGroupId')
  findByMuscleGroup(@Param('muscleGroupId') muscleGroupId: string) {
    return this.exercisesService.findByMuscleGroup(muscleGroupId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateDto: UpdateExerciseDto) {
    return this.exercisesService.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.exercisesService.remove(id);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.OK)
  activate(@Param('id') id: string) {
    return this.exercisesService.activate(id);
  }

  @Patch(':id/toggle-status')
  @HttpCode(HttpStatus.OK)
  toggleStatus(@Param('id') id: string) {
    return this.exercisesService.toggleStatus(id);
  }
}
