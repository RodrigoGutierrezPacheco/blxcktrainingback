import { Controller, Post, Body, HttpCode, HttpStatus, Patch, Param, UseGuards, Request, ForbiddenException, UnauthorizedException, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateNormalUserDto } from './dto/create-normal-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserByEmailDto } from './dto/get-user-by-email.dto';
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
}