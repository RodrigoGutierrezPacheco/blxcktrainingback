import { Controller, Post, Body, HttpCode, HttpStatus, Patch, Param, UseGuards, Request, ForbiddenException, UnauthorizedException, Get, Query, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateNormalUserDto } from './dto/create-normal-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import { GetUserByEmailDto } from './dto/get-user-by-email.dto';
import { AssignTrainerDto } from './dto/assign-trainer.dto';
import { GetUsersByTrainerDto } from './dto/get-users-by-trainer.dto';
import { VerifyTrainerDocumentDto } from './dto/verify-trainer-document.dto';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
  };
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('normal/register')
  @HttpCode(HttpStatus.CREATED)
  async registerNormalUser(@Body() createDto: CreateNormalUserDto) {
    return this.usersService.createNormalUser(createDto);
  }

  @Get('by-email')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getUserByEmail(
    @Query() query: GetUserByEmailDto,
    @Request() req: RequestWithUser
  ) {
    console.log('[DEBUG] Request object:', req);
    console.log('[DEBUG] User object:', req.user);
    
    // Verificar que req.user existe
    if (!req.user) {
      console.log('[ERROR] req.user is undefined');
      throw new UnauthorizedException('Usuario no autenticado');
    }

    const userRole = req.user.role;
    const requestingUserEmail = req.user.email;
    const targetEmail = query.email;
    
    console.log('[DEBUG] User role:', userRole);
    console.log('[DEBUG] Requesting user email:', requestingUserEmail);
    console.log('[DEBUG] Target email:', targetEmail);
    
    // Verificar que el usuario solo pueda consultar su propia información
    // o que sea un administrador
    if (userRole !== 'admin' && requestingUserEmail !== targetEmail) {
      throw new ForbiddenException('No tienes permisos para consultar la información de este usuario');
    }

    return await this.usersService.getUserByEmail(targetEmail);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') userId: string,
    @Body() updateDto: UpdateUserDto,
    @Request() req: RequestWithUser
  ) {
    console.log('[DEBUG] Request object:', req);
    console.log('[DEBUG] User object:', req.user);
    
    // Verificar que req.user existe
    if (!req.user) {
      console.log('[ERROR] req.user is undefined');
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Verificar que el usuario solo pueda editar su propia información
    // o que sea un administrador
    const userRole = req.user.role;
    const requestingUserId = req.user.sub;
    
    console.log('[DEBUG] User role:', userRole);
    console.log('[DEBUG] Requesting user ID:', requestingUserId);
    console.log('[DEBUG] Target user ID:', userId);
    
    if (userRole !== 'admin' && requestingUserId !== userId) {
      throw new ForbiddenException('No tienes permisos para editar este usuario');
    }

    return await this.usersService.updateUser(userId, updateDto);
  }

  @Post('assign-trainer')
  @HttpCode(HttpStatus.OK)
  async assignTrainerToUser(@Body() assignDto: AssignTrainerDto) {
    return this.usersService.assignTrainerToUser(assignDto);
  }

  @Get('by-trainer/:trainerId')
  @HttpCode(HttpStatus.OK)
  async getUsersByTrainer(@Param() params: GetUsersByTrainerDto) {
    return this.usersService.getUsersByTrainer(params.trainerId);
  }

  @Get('with-trainers')
  async getUsersWithTrainers() {
    return this.usersService.getUsersWithTrainers();
  }

  @Get('admins')
  async getAllAdmins() {
    return this.usersService.findAllAdmins();
  }

  @Get('trainers')
  async getAllTrainers() {
    return this.usersService.findAllTrainers();
  }

  @Get('normal')
  async getAllNormalUsers() {
    return this.usersService.findAllNormalUsers();
  }

  @Get('active')
  async getActiveUsers() {
    return this.usersService.findActiveUsers();
  }

  @Get('inactive')
  async getInactiveUsers() {
    return this.usersService.findInactiveUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteUser(
    @Param('id') userId: string,
    @Request() req: RequestWithUser
  ) {
    // Verificar que req.user existe
    if (!req.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Solo los administradores pueden eliminar usuarios
    const userRole = req.user.role;
    if (userRole !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden eliminar usuarios');
    }

    await this.usersService.deleteUser(userId);
    return { message: 'Usuario eliminado exitosamente' };
  }

  @Patch(':id/activate')
  @UseGuards(JwtGuard)
  async activateUser(
    @Param('id') userId: string,
    @Request() req: RequestWithUser
  ) {
    // Verificar que req.user existe
    if (!req.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Solo los administradores pueden activar usuarios
    const userRole = req.user.role;
    if (userRole !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden activar usuarios');
    }

    await this.usersService.activateUser(userId);
    return { message: 'Usuario activado exitosamente' };
  }

  @Patch(':id/toggle-status')
  @UseGuards(JwtGuard)
  async toggleUserStatus(
    @Param('id') userId: string,
    @Request() req: RequestWithUser
  ) {
    // Verificar que req.user existe
    if (!req.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Solo los administradores pueden cambiar el status de usuarios
    const userRole = req.user.role;
    if (userRole !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden cambiar el status de usuarios');
    }

    const result = await this.usersService.toggleUserStatus(userId);
    return { 
      message: `Status del usuario cambiado exitosamente a ${result.isActive ? 'activo' : 'inactivo'}`,
      isActive: result.isActive
    };
  }

  @Patch('trainer/:trainerId/toggle-status')
  @UseGuards(JwtGuard)
  async toggleTrainerStatus(
    @Param('trainerId') trainerId: string,
    @Request() req: RequestWithUser
  ) {
    // Verificar que req.user existe
    if (!req.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Solo los administradores pueden cambiar el status de entrenadores
    const userRole = req.user.role;
    if (userRole !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden cambiar el status de entrenadores');
    }

    const result = await this.usersService.toggleTrainerStatus(trainerId);
    return { 
      message: `Status del entrenador cambiado exitosamente a ${result.isActive ? 'activo' : 'inactivo'}`,
      isActive: result.isActive
    };
  }

  @Patch('trainer/:trainerId/toggle-verification')
  @UseGuards(JwtGuard)
  async toggleTrainerVerification(
    @Param('trainerId') trainerId: string,
    @Request() req: RequestWithUser
  ) {
    // Verificar que req.user existe
    if (!req.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Solo los administradores pueden cambiar el status de verificación de entrenadores
    const userRole = req.user.role;
    if (userRole !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden cambiar el status de verificación de entrenadores');
    }

    const result = await this.usersService.toggleTrainerVerificationStatus(trainerId);
    return { 
      message: `Status de verificación del entrenador cambiado exitosamente a ${result.isVerified ? 'verificado' : 'no verificado'}`,
      isVerified: result.isVerified
    };
  }

  @Get('trainer/:trainerId')
  @HttpCode(HttpStatus.OK)
  async getTrainerById(@Param('trainerId') trainerId: string) {
    return this.usersService.getTrainerById(trainerId);
  }

  @Patch('trainer/:trainerId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async updateTrainer(
    @Param('trainerId') trainerId: string,
    @Body() updateDto: UpdateTrainerDto,
    @Request() req: RequestWithUser
  ) {
    // Verificar que req.user existe
    if (!req.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Verificar que el usuario solo pueda editar su propia información
    // o que sea un administrador
    const userRole = req.user.role;
    const requestingUserId = req.user.sub;
    
    if (userRole !== 'admin' && requestingUserId !== trainerId) {
      throw new ForbiddenException('No tienes permisos para editar este entrenador');
    }

    return await this.usersService.updateTrainer(trainerId, updateDto);
  }

  @Get('trainer/profile/me')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async getMyTrainerProfile(@Request() req: RequestWithUser) {
    // El ID del entrenador viene del token JWT
    const trainerId = req.user.sub;
    return this.usersService.getTrainerProfile(trainerId);
  }

  @Get(':userId/trainer')
  @HttpCode(HttpStatus.OK)
  async getTrainerByUser(@Param('userId') userId: string) {
    return this.usersService.getTrainerByUser(userId);
  }

  @Delete(':userId/trainer')
  @HttpCode(HttpStatus.OK)
  async removeTrainerFromUser(@Param('userId') userId: string) {
    await this.usersService.removeTrainerFromUser(userId);
    return { message: 'Entrenador removido del usuario exitosamente' };
  }

  @Get('trainer/:trainerId/documents')
  @HttpCode(HttpStatus.OK)
  async getTrainerDocuments(@Param('trainerId') trainerId: string) {
    return this.usersService.getTrainerDocuments(trainerId);
  }

  @Get('trainer/document/:documentId')
  @HttpCode(HttpStatus.OK)
  async getTrainerDocumentById(@Param('documentId') documentId: string) {
    return this.usersService.getTrainerDocumentById(documentId);
  }

  @Patch('trainer/document/:documentId/verify')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async verifyTrainerDocument(
    @Param('documentId') documentId: string,
    @Body() verifyDto: VerifyTrainerDocumentDto,
    @Request() req: RequestWithUser
  ) {
    // Verificar que req.user existe
    if (!req.user) {
      throw new UnauthorizedException('Usuario no autenticado');
    }

    // Solo los administradores pueden verificar documentos
    const userRole = req.user.role;
    if (userRole !== 'admin') {
      throw new ForbiddenException('Solo los administradores pueden verificar documentos de entrenadores');
    }

    return await this.usersService.verifyTrainerDocument(documentId, verifyDto, req.user.sub);
  }
}