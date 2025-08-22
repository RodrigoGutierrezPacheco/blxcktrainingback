import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { RoutinesService } from './routines.service';
import { CreateRoutineDto } from './dto/create-routine.dto';
import { UpdateRoutineDto } from './dto/update-routine.dto';
import { AssignRoutineDto } from './dto/assign-routine.dto';
import { JwtGuard } from '../../auth/guards/jwt/jwt.guard';
import { Public } from '../../auth/decorators/public.decorator';

@Controller('routines')
@UseGuards(JwtGuard)
export class RoutinesController {
  constructor(private readonly routinesService: RoutinesService) {}

  @Post()
  create(@Body() createRoutineDto: CreateRoutineDto) {
    return this.routinesService.create(createRoutineDto);
  }

  @Get()
  async findAll() {
    return this.routinesService.findAll();
  }

  @Get('all')
  async findAllIncludingInactive() {
    return this.routinesService.findAllIncludingInactive();
  }

  @Get('trainer/:trainerId')
  findByTrainer(@Param('trainerId') trainerId: string) {
    return this.routinesService.findByTrainer(trainerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.routinesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoutineDto: UpdateRoutineDto) {
    return this.routinesService.update(id, updateRoutineDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.routinesService.remove(id);
  }

  // Endpoints para asignar rutinas a usuarios
  @Post('assign')
  assignRoutineToUser(@Body() assignRoutineDto: AssignRoutineDto) {
    return this.routinesService.assignRoutineToUser(assignRoutineDto);
  }

  @Get('user/:userId')
  getUserRoutines(@Param('userId') userId: string) {
    return this.routinesService.getUserRoutines(userId);
  }

  @Get('user/email/:email')
  getUserRoutinesByEmail(@Param('email') email: string) {
    return this.routinesService.getUserRoutinesByEmail(email);
  }

  @Get('user/by-email')
  getUserRoutinesByEmailQuery(@Query('email') email: string) {
    return this.routinesService.getUserRoutinesByEmail(email);
  }

  @Patch('user/:userId/routine/:routineId/deactivate')
  deactivateUserRoutine(
    @Param('userId') userId: string,
    @Param('routineId') routineId: string,
  ) {
    return this.routinesService.deactivateUserRoutine(userId, routineId);
  }

  @Delete('user/:userId/routine/:routineId')
  removeUserRoutine(
    @Param('userId') userId: string,
    @Param('routineId') routineId: string,
  ) {
    return this.routinesService.removeUserRoutine(userId, routineId);
  }

  @Post('sync-users-routine-status')
  syncAllUsersRoutineStatus() {
    return this.routinesService.syncAllUsersRoutineStatus();
  }

  @Get('users/with-routine-status')
  getUsersWithRoutineStatus() {
    return this.routinesService.findAll();
  }

  @Get('users/with-routine-details')
  getUsersWithRoutineDetails() {
    return this.routinesService.getUsersWithRoutineDetails();
  }

  @Get('users/without-routine')
  getUsersWithoutRoutine() {
    return this.routinesService.getUsersWithoutRoutine();
  }

  @Get('users/with-routine')
  getUsersWithRoutine() {
    return this.routinesService.getUsersWithRoutine();
  }
}
