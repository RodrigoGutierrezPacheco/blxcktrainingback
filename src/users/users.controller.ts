import { Controller, Post, Body, HttpCode, HttpStatus, Patch, Param, UseGuards, Request, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateNormalUserDto } from './dto/create-normal-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guards/jwt/jwt.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('normal/register')
  @HttpCode(HttpStatus.CREATED)
  async registerNormalUser(@Body() createDto: CreateNormalUserDto) {
    return this.usersService.createNormalUser(createDto);
  }

  @Patch(':id')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') userId: string,
    @Body() updateDto: UpdateUserDto,
    @Request() req
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

    return this.usersService.updateUser(userId, updateDto);
  }
}