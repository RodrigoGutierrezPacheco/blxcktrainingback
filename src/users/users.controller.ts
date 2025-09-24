import { Controller, Post, Body, HttpCode, HttpStatus, Patch, Param, UseGuards, Request, ForbiddenException, UnauthorizedException, Get, Query, Delete, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
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

@ApiTags('👥 Gestión de Usuarios')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('normal/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar Usuario Normal',
    description: 'Crea un nuevo usuario normal en el sistema. Este endpoint no requiere autenticación.'
  })
  @ApiBody({
    type: CreateNormalUserDto,
    description: 'Datos del usuario a registrar',
    examples: {
      usuario1: {
        summary: 'Usuario Ejemplo',
        value: {
          email: 'usuario@ejemplo.com',
          password: 'Contraseña123!',
          fullName: 'Juan Pérez',
          age: 25,
          weight: 70,
          height: 175
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-generado' },
        email: { type: 'string', example: 'usuario@ejemplo.com' },
        fullName: { type: 'string', example: 'Juan Pérez' },
        role: { type: 'string', example: 'user' },
        age: { type: 'number', example: 25 },
        weight: { type: 'number', example: 70 },
        height: { type: 'number', example: 175 },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 409, description: 'El email ya está registrado' })
  async registerNormalUser(@Body() createDto: CreateNormalUserDto) {
    return this.usersService.createNormalUser(createDto);
  }

  @Get('by-email')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener Usuario por Email',
    description: 'Obtiene la información de un usuario específico por su email. Solo el propio usuario o administradores pueden acceder.'
  })
  @ApiQuery({
    name: 'email',
    description: 'Email del usuario a consultar',
    example: 'usuario@ejemplo.com',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-generado' },
        email: { type: 'string', example: 'usuario@ejemplo.com' },
        fullName: { type: 'string', example: 'Juan Pérez' },
        role: { type: 'string', example: 'user' },
        age: { type: 'number', example: 25 },
        weight: { type: 'number', example: 70 },
        height: { type: 'number', example: 175 },
        trainerId: { type: 'string', example: 'uuid-entrenador', nullable: true },
        hasRoutine: { type: 'boolean', example: true },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        routine: {
          type: 'object',
          nullable: true,
          description: 'Información de la rutina asignada (solo si hasRoutine es true)',
          properties: {
            id: { type: 'string', example: 'uuid-de-user-routine' },
            routine_id: { type: 'string', example: 'uuid-de-rutina' },
            startDate: { type: 'string', example: '2024-01-15T00:00:00.000Z' },
            endDate: { type: 'string', example: '2024-02-15T00:00:00.000Z', nullable: true },
            notes: { type: 'string', example: 'Rutina asignada por el entrenador', nullable: true },
            isActive: { type: 'boolean', example: true },
            assignedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
            routine: {
              type: 'object',
              properties: {
                id: { type: 'string', example: 'uuid-de-rutina' },
                name: { type: 'string', example: 'Rutina de Fuerza' },
                description: { type: 'string', example: 'Rutina para desarrollar fuerza muscular' },
                comments: { type: 'string', example: 'Realizar 3 veces por semana' },
                totalWeeks: { type: 'number', example: 4 },
                isActive: { type: 'boolean', example: true },
                trainer_id: { type: 'string', example: 'uuid-entrenador' },
                weeks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string', example: 'uuid-semana' },
                      weekNumber: { type: 'number', example: 1 },
                      name: { type: 'string', example: 'Semana 1 - Adaptación' },
                      comments: { type: 'string', example: 'Enfoque en técnica' },
                      days: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            id: { type: 'string', example: 'uuid-dia' },
                            dayNumber: { type: 'number', example: 1 },
                            name: { type: 'string', example: 'Día 1 - Pecho y Tríceps' },
                            comments: { type: 'string', example: 'Ejercicios básicos' },
                            exercises: {
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  id: { type: 'string', example: 'uuid-ejercicio' },
                                  name: { type: 'string', example: 'Press de Banca' },
                                  exerciseId: { type: 'string', example: 'uuid-ejercicio-catalogo', nullable: true },
                                  sets: { type: 'number', example: 3 },
                                  repetitions: { type: 'number', example: 10 },
                                  restBetweenSets: { type: 'number', example: 90 },
                                  restBetweenExercises: { type: 'number', example: 120 },
                                  comments: { type: 'string', example: 'Mantener buena forma' },
                                  order: { type: 'number', example: 1 }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para consultar este usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
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
  @ApiOperation({
    summary: 'Actualizar Usuario',
    description: 'Actualiza la información de un usuario específico. Solo el propio usuario o administradores pueden modificar.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a actualizar',
    example: 'uuid-del-usuario',
    required: true
  })
  @ApiBody({
    type: UpdateUserDto,
    description: 'Datos a actualizar del usuario',
    examples: {
      actualizacion1: {
        summary: 'Actualización Básica',
        value: {
          fullName: 'Juan Pérez Actualizado',
          age: 26,
          weight: 72,
          height: 176
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-usuario' },
        email: { type: 'string', example: 'usuario@ejemplo.com' },
        fullName: { type: 'string', example: 'Juan Pérez Actualizado' },
        role: { type: 'string', example: 'user' },
        age: { type: 'number', example: 26 },
        weight: { type: 'number', example: 72 },
        height: { type: 'number', example: 176 },
        updatedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para editar este usuario' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
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
  @ApiOperation({
    summary: 'Asignar Entrenador a Usuario',
    description: 'Asigna un entrenador específico a un usuario. Esto permite al usuario acceder a rutinas personalizadas.'
  })
  @ApiBody({
    type: AssignTrainerDto,
    description: 'Datos para asignar entrenador a usuario',
    examples: {
      asignacion1: {
        summary: 'Asignación de Entrenador',
        value: {
          userId: 'uuid-del-usuario',
          trainerId: 'uuid-del-entrenador'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Entrenador asignado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Entrenador asignado exitosamente' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-del-usuario' },
            trainerId: { type: 'string', example: 'uuid-del-entrenador' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 404, description: 'Usuario o entrenador no encontrado' })
  async assignTrainerToUser(@Body() assignDto: AssignTrainerDto) {
    return this.usersService.assignTrainerToUser(assignDto);
  }

  @Get('by-trainer/:trainerId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener Usuarios por Entrenador',
    description: 'Obtiene la lista de todos los usuarios asignados a un entrenador específico.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador',
    example: 'uuid-del-entrenador',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida exitosamente (sin role ni password)',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-usuario' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          fullName: { type: 'string', example: 'Juan Pérez' },
          age: { type: 'number', example: 25, nullable: true },
          weight: { type: 'number', example: 70, nullable: true },
          height: { type: 'number', example: 175, nullable: true },
          chronicDiseases: { type: 'string', example: 'Diabetes tipo 2', nullable: true },
          dateOfBirth: { type: 'string', example: '1995-05-15', nullable: true },
          healthIssues: { type: 'string', example: 'Problemas de espalda', nullable: true },
          phone: { type: 'string', example: '+52 55 1234 5678', nullable: true },
          trainerId: { type: 'string', example: 'uuid-del-entrenador', nullable: true },
          hasRoutine: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          routineInfo: {
            type: 'object',
            properties: {
              hasRoutine: { type: 'boolean', example: true },
              assignedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z', nullable: true },
              routineEndDate: { type: 'string', example: '2024-02-14T10:00:00.000Z', nullable: true },
              daysRemaining: { type: 'number', example: 15, nullable: true },
              startDate: { type: 'string', example: '2024-01-15T00:00:00.000Z', nullable: true },
              endDate: { type: 'string', example: '2024-02-14T00:00:00.000Z', nullable: true },
              notes: { type: 'string', example: 'Rutina asignada por el entrenador', nullable: true }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  async getUsersByTrainer(@Param() params: GetUsersByTrainerDto) {
    return this.usersService.getUsersByTrainer(params.trainerId);
  }

  @Get('by-trainer/:trainerId/with-routine')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener Usuarios con Rutina por Entrenador',
    description: 'Obtiene la lista de usuarios asignados a un entrenador específico que tienen rutina activa, incluyendo información detallada sobre el tiempo restante de la rutina.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador',
    example: 'uuid-del-entrenador',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios con rutina obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-usuario' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          fullName: { type: 'string', example: 'Juan Pérez' },
          age: { type: 'number', example: 25, nullable: true },
          weight: { type: 'number', example: 70, nullable: true },
          height: { type: 'number', example: 175, nullable: true },
          chronicDiseases: { type: 'string', example: 'Diabetes tipo 2', nullable: true },
          dateOfBirth: { type: 'string', example: '1995-05-15', nullable: true },
          healthIssues: { type: 'string', example: 'Problemas de espalda', nullable: true },
          phone: { type: 'string', example: '+52 55 1234 5678', nullable: true },
          trainerId: { type: 'string', example: 'uuid-del-entrenador', nullable: true },
          hasRoutine: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          routineInfo: {
            type: 'object',
            properties: {
              hasRoutine: { type: 'boolean', example: true },
              assignedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z', nullable: true },
              routineEndDate: { type: 'string', example: '2024-02-14T10:00:00.000Z', nullable: true },
              daysRemaining: { type: 'number', example: 15, nullable: true },
              startDate: { type: 'string', example: '2024-01-15T00:00:00.000Z', nullable: true },
              endDate: { type: 'string', example: '2024-02-14T00:00:00.000Z', nullable: true },
              notes: { type: 'string', example: 'Rutina asignada por el entrenador', nullable: true }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  async getUsersWithRoutineByTrainer(@Param() params: GetUsersByTrainerDto) {
    return this.usersService.getUsersWithRoutineByTrainer(params.trainerId);
  }

  @Get('with-trainers')
  @ApiOperation({
    summary: 'Obtener Todos los Usuarios con Entrenadores',
    description: 'Obtiene la lista completa de todos los usuarios junto con la información de sus entrenadores asignados.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios con entrenadores obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-usuario' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          fullName: { type: 'string', example: 'Juan Pérez' },
          role: { type: 'string', example: 'user' },
          age: { type: 'number', example: 25 },
          weight: { type: 'number', example: 70 },
          height: { type: 'number', example: 175 },
          trainerId: { type: 'string', example: 'uuid-del-entrenador', nullable: true },
          hasRoutine: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: true },
          trainer: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'string', example: 'uuid-del-entrenador' },
              fullName: { type: 'string', example: 'Carlos Entrenador' },
              email: { type: 'string', example: 'entrenador@ejemplo.com' },
              role: { type: 'string', example: 'trainer' },
              age: { type: 'number', example: 30 },
              phone: { type: 'string', example: '+1234567890' }
            }
          }
        }
      }
    }
  })
  async getUsersWithTrainers() {
    return this.usersService.getUsersWithTrainers();
  }

  @Get('admins')
  @ApiOperation({
    summary: 'Obtener Todos los Administradores',
    description: 'Obtiene la lista completa de todos los usuarios con rol de administrador en el sistema.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de administradores obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-admin' },
          email: { type: 'string', example: 'admin@ejemplo.com' },
          fullName: { type: 'string', example: 'Admin Sistema' },
          role: { type: 'string', example: 'admin' },
          age: { type: 'number', example: 35 },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  async getAllAdmins() {
    return this.usersService.findAllAdmins();
  }

  @Get('trainers')
  @ApiOperation({
    summary: 'Obtener Todos los Entrenadores',
    description: 'Obtiene la lista completa de todos los usuarios con rol de entrenador, incluyendo el conteo de usuarios asignados.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de entrenadores obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-entrenador' },
          email: { type: 'string', example: 'entrenador@ejemplo.com' },
          fullName: { type: 'string', example: 'Carlos Entrenador' },
          role: { type: 'string', example: 'trainer' },
          age: { type: 'number', example: 30 },
          phone: { type: 'string', example: '+1234567890' },
          isActive: { type: 'boolean', example: true },
          isVerified: { type: 'boolean', example: false },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          assignedUsersCount: { type: 'number', example: 5 }
        }
      }
    }
  })
  async getAllTrainers() {
    return this.usersService.findAllTrainers();
  }

  @Get('normal')
  @ApiOperation({
    summary: 'Obtener Todos los Usuarios Normales',
    description: 'Obtiene la lista completa de todos los usuarios con rol de usuario normal, incluyendo información de sus entrenadores asignados.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios normales obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-usuario' },
          email: { type: 'string', example: 'usuario@ejemplo.com' },
          fullName: { type: 'string', example: 'Juan Pérez' },
          role: { type: 'string', example: 'user' },
          age: { type: 'number', example: 25 },
          weight: { type: 'number', example: 70 },
          height: { type: 'number', example: 175 },
          trainerId: { type: 'string', example: 'uuid-del-entrenador', nullable: true },
          hasRoutine: { type: 'boolean', example: true },
          isActive: { type: 'boolean', example: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
          trainer: {
            type: 'object',
            nullable: true,
            properties: {
              id: { type: 'string', example: 'uuid-del-entrenador' },
              fullName: { type: 'string', example: 'Carlos Entrenador' },
              email: { type: 'string', example: 'entrenador@ejemplo.com' },
              role: { type: 'string', example: 'trainer' },
              age: { type: 'number', example: 30 },
              phone: { type: 'string', example: '+1234567890' }
            }
          }
        }
      }
    }
  })
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

  @Get('without-trainer')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener Usuarios Sin Entrenador Asignado',
    description: 'Obtiene la lista completa de todos los usuarios normales que no tienen un entrenador asignado. Útil para administradores que necesitan asignar entrenadores a usuarios.'
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios sin entrenador obtenida exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { 
            type: 'string', 
            format: 'uuid',
            example: '123e4567-e89b-12d3-a456-426614174000',
            description: 'ID único del usuario'
          },
          fullName: { 
            type: 'string', 
            example: 'Juan Pérez García',
            description: 'Nombre completo del usuario'
          },
          email: { 
            type: 'string', 
            format: 'email',
            example: 'juan.perez@example.com',
            description: 'Correo electrónico del usuario'
          },
          role: { 
            type: 'string', 
            example: 'user',
            description: 'Rol del usuario en el sistema'
          },
          age: { 
            type: 'number', 
            example: 28,
            nullable: true,
            description: 'Edad del usuario'
          },
          weight: { 
            type: 'number', 
            example: 75.5,
            nullable: true,
            description: 'Peso del usuario en kg'
          },
          height: { 
            type: 'number', 
            example: 175,
            nullable: true,
            description: 'Altura del usuario en cm'
          },
          trainerId: { 
            type: 'string', 
            format: 'uuid',
            example: null,
            nullable: true,
            description: 'ID del entrenador asignado (null si no tiene entrenador)'
          },
          hasRoutine: { 
            type: 'boolean', 
            example: false,
            description: 'Indica si el usuario tiene una rutina asignada'
          },
          isActive: { 
            type: 'boolean', 
            example: true,
            description: 'Indica si el usuario está activo en el sistema'
          },
          createdAt: { 
            type: 'string', 
            format: 'date-time',
            example: '2024-01-15T10:00:00.000Z',
            description: 'Fecha de creación del usuario'
          },
          updatedAt: { 
            type: 'string', 
            format: 'date-time',
            example: '2024-01-15T10:00:00.000Z',
            description: 'Fecha de última actualización del usuario'
          }
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - Solo administradores pueden acceder' 
  })
  async getUsersWithoutTrainer() {
    return this.usersService.getUsersWithoutTrainer();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener Usuario por ID',
    description: 'Obtiene la información completa de un usuario específico por su ID único.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del usuario',
    example: 'uuid-del-usuario',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-usuario' },
        email: { type: 'string', example: 'usuario@ejemplo.com' },
        fullName: { type: 'string', example: 'Juan Pérez' },
        role: { type: 'string', example: 'user' },
        age: { type: 'number', example: 25 },
        weight: { type: 'number', example: 70 },
        height: { type: 'number', example: 175 },
        trainerId: { type: 'string', example: 'uuid-del-entrenador', nullable: true },
        hasRoutine: { type: 'boolean', example: true },
        isActive: { type: 'boolean', example: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async getUserById(@Param('id') id: string) {
    return this.usersService.findUserById(id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  @ApiOperation({
    summary: 'Eliminar Usuario',
    description: 'Elimina permanentemente un usuario del sistema. Solo los administradores pueden realizar esta acción.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a eliminar',
    example: 'uuid-del-usuario',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuario eliminado exitosamente' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 403, description: 'Solo los administradores pueden eliminar usuarios' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
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
  @ApiOperation({
    summary: 'Cambiar Status de Usuario',
    description: 'Cambia el estado activo/inactivo de un usuario. Solo los administradores pueden realizar esta acción.'
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario',
    example: 'uuid-del-usuario',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Status del usuario cambiado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Status del usuario cambiado exitosamente a inactivo' },
        isActive: { type: 'boolean', example: false }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 403, description: 'Solo los administradores pueden cambiar el status de usuarios' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
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
  @ApiOperation({
    summary: 'Cambiar Status de Entrenador',
    description: 'Cambia el estado activo/inactivo de un entrenador. Solo los administradores pueden realizar esta acción.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador',
    example: 'uuid-del-entrenador',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Status del entrenador cambiado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Status del entrenador cambiado exitosamente a inactivo' },
        isActive: { type: 'boolean', example: false }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 403, description: 'Solo los administradores pueden cambiar el status de entrenadores' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
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
  @ApiOperation({
    summary: 'Cambiar Status de Verificación de Entrenador',
    description: 'Cambia el estado de verificación de un entrenador. Solo los administradores pueden realizar esta acción.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador',
    example: 'uuid-del-entrenador',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Status de verificación del entrenador cambiado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Status de verificación del entrenador cambiado exitosamente a verificado' },
        isVerified: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 403, description: 'Solo los administradores pueden cambiar el status de verificación de entrenadores' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
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
  @ApiOperation({
    summary: 'Obtener Entrenador por ID',
    description: 'Obtiene la información completa de un entrenador específico por su ID único.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID único del entrenador',
    example: 'uuid-del-entrenador',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Entrenador encontrado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-entrenador' },
        email: { type: 'string', example: 'entrenador@ejemplo.com' },
        fullName: { type: 'string', example: 'Carlos Entrenador' },
        role: { type: 'string', example: 'trainer' },
        age: { type: 'number', example: 30 },
        phone: { type: 'string', example: '+1234567890' },
        documents: { type: 'string', example: 'Certificación en entrenamiento personal' },
        rfc: { type: 'string', example: 'CARE800101ABC' },
        curp: { type: 'string', example: 'CARE800101HDFABC00' },
        dateOfBirth: { type: 'string', example: '1980-01-01' },
        isActive: { type: 'boolean', example: true },
        isVerified: { type: 'boolean', example: false },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  async getTrainerById(@Param('trainerId') trainerId: string) {
    return this.usersService.getTrainerById(trainerId);
  }

  @Patch('trainer/:trainerId')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar Entrenador',
    description: 'Actualiza la información de un entrenador específico. Solo el propio entrenador o administradores pueden modificar.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador a actualizar',
    example: 'uuid-del-entrenador',
    required: true
  })
  @ApiBody({
    type: UpdateTrainerDto,
    description: 'Datos a actualizar del entrenador',
    examples: {
      actualizacion1: {
        summary: 'Actualización de Entrenador',
        value: {
          fullName: 'Carlos Entrenador Actualizado',
          age: 32,
          phone: '+1234567890',
          documents: 'Certificaciones actualizadas...',
          rfc: 'CARE800101ABC',
          curp: 'CARE800101HDFABC00',
          dateOfBirth: '1980-01-01'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Entrenador actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-entrenador' },
        email: { type: 'string', example: 'entrenador@ejemplo.com' },
        fullName: { type: 'string', example: 'Carlos Entrenador Actualizado' },
        role: { type: 'string', example: 'trainer' },
        age: { type: 'number', example: 32 },
        phone: { type: 'string', example: '+1234567890' },
        documents: { type: 'string', example: 'Certificaciones actualizadas...' },
        rfc: { type: 'string', example: 'CARE800101ABC' },
        curp: { type: 'string', example: 'CARE800101HDFABC00' },
        dateOfBirth: { type: 'string', example: '1980-01-01' },
        isActive: { type: 'boolean', example: true },
        isVerified: { type: 'boolean', example: false },
        updatedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 403, description: 'No tienes permisos para editar este entrenador' })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
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
  @ApiOperation({
    summary: 'Obtener Mi Perfil de Entrenador',
    description: 'Obtiene el perfil del entrenador autenticado usando el token JWT.'
  })
  @ApiResponse({
    status: 200,
    description: 'Perfil del entrenador obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-entrenador' },
        email: { type: 'string', example: 'entrenador@ejemplo.com' },
        fullName: { type: 'string', example: 'Carlos Entrenador' },
        role: { type: 'string', example: 'trainer' },
        age: { type: 'number', example: 30 },
        phone: { type: 'string', example: '+1234567890' },
        documents: { type: 'string', example: 'Certificación en entrenamiento personal' },
        rfc: { type: 'string', example: 'CARE800101ABC' },
        curp: { type: 'string', example: 'CARE800101HDFABC00' },
        dateOfBirth: { type: 'string', example: '1980-01-01' },
        isActive: { type: 'boolean', example: true },
        isVerified: { type: 'boolean', example: false },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 404, description: 'Perfil de entrenador no encontrado' })
  async getMyTrainerProfile(@Request() req: RequestWithUser) {
    // El ID del entrenador viene del token JWT
    const trainerId = req.user.sub;
    return this.usersService.getTrainerProfile(trainerId);
  }

  @Get(':userId/trainer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener Entrenador de un Usuario',
    description: 'Obtiene la información del entrenador asignado a un usuario específico.'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario',
    example: 'uuid-del-usuario',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Entrenador del usuario obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-entrenador' },
        fullName: { type: 'string', example: 'Carlos Entrenador' },
        email: { type: 'string', example: 'entrenador@ejemplo.com' },
        role: { type: 'string', example: 'trainer' },
        age: { type: 'number', example: 30 },
        phone: { type: 'string', example: '+1234567890' },
        isActive: { type: 'boolean', example: true },
        isVerified: { type: 'boolean', example: false },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' },
        updatedAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado o sin entrenador asignado' })
  async getTrainerByUser(@Param('userId') userId: string) {
    return this.usersService.getTrainerByUser(userId);
  }

  @Delete(':userId/trainer')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desasignar Entrenador de Usuario',
    description: 'Desasigna completamente el entrenador de un usuario específico. Esta acción desactiva la relación entrenador-usuario y limpia el campo trainerId del usuario. El usuario quedará sin entrenador asignado.'
  })
  @ApiParam({
    name: 'userId',
    description: 'ID del usuario al que se le desasignará el entrenador',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Entrenador desasignado del usuario exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: { 
          type: 'string', 
          example: 'Entrenador desasignado del usuario exitosamente',
          description: 'Mensaje de confirmación de desasignación'
        },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            fullName: { type: 'string', example: 'Juan Pérez García' },
            email: { type: 'string', example: 'juan.perez@example.com' },
            trainerId: { type: 'string', example: null, nullable: true },
            isActive: { type: 'boolean', example: true }
          },
          description: 'Información del usuario actualizada'
        },
        previousTrainer: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174001' },
            fullName: { type: 'string', example: 'Carlos Entrenador' },
            email: { type: 'string', example: 'carlos@entrenador.com' }
          },
          nullable: true,
          description: 'Información del entrenador que fue desasignado'
        }
      }
    }
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuario no encontrado' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'No autorizado - Token JWT requerido' 
  })
  @ApiResponse({ 
    status: 403, 
    description: 'Acceso denegado - Solo administradores pueden desasignar entrenadores' 
  })
  async removeTrainerFromUser(@Param('userId') userId: string) {
    // Obtener información del usuario antes de la desasignación
    const user = await this.usersService.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Obtener información del entrenador actual si existe
    let previousTrainer: any = null;
    if (user.trainerId) {
      previousTrainer = await this.usersService.findTrainerById(user.trainerId);
    }

    // Desasignar el entrenador
    await this.usersService.removeTrainerFromUser(userId);

    return {
      message: 'Entrenador desasignado del usuario exitosamente',
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        trainerId: null,
        isActive: user.isActive
      },
      previousTrainer: previousTrainer ? {
        id: previousTrainer.id,
        fullName: previousTrainer.fullName,
        email: previousTrainer.email
      } : null
    };
  }

  @Get('trainer/:trainerId/documents')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener Documentos de Entrenador',
    description: 'Obtiene todos los documentos de verificación de un entrenador específico.'
  })
  @ApiParam({
    name: 'trainerId',
    description: 'ID del entrenador',
    example: 'uuid-del-entrenador',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Documentos del entrenador obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-del-documento' },
          trainerId: { type: 'string', example: 'uuid-del-entrenador' },
          documentType: { type: 'string', example: 'identification' },
          fileName: { type: 'string', example: 'identificacion.jpg' },
          fileUrl: { type: 'string', example: 'https://storage.com/documento.jpg' },
          isVerified: { type: 'boolean', example: false },
          verifiedBy: { type: 'string', example: 'uuid-del-admin', nullable: true },
          verifiedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z', nullable: true },
          createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Entrenador no encontrado' })
  async getTrainerDocuments(@Param('trainerId') trainerId: string) {
    return this.usersService.getTrainerDocuments(trainerId);
  }

  @Get('trainer/document/:documentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener Documento de Entrenador por ID',
    description: 'Obtiene un documento específico de verificación de entrenador por su ID único.'
  })
  @ApiParam({
    name: 'documentId',
    description: 'ID del documento',
    example: 'uuid-del-documento',
    required: true
  })
  @ApiResponse({
    status: 200,
    description: 'Documento del entrenador obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-documento' },
        trainerId: { type: 'string', example: 'uuid-del-entrenador' },
        documentType: { type: 'string', example: 'identification' },
        fileName: { type: 'string', example: 'identificacion.jpg' },
        fileUrl: { type: 'string', example: 'https://storage.com/documento.jpg' },
        isVerified: { type: 'boolean', example: false },
        verifiedBy: { type: 'string', example: 'uuid-del-admin', nullable: true },
        verifiedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z', nullable: true },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
  async getTrainerDocumentById(@Param('documentId') documentId: string) {
    return this.usersService.getTrainerDocumentById(documentId);
  }

  @Patch('trainer/document/:documentId/verify')
  @UseGuards(JwtGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verificar Documento de Entrenador',
    description: 'Marca un documento de entrenador como verificado. Solo los administradores pueden realizar esta acción.'
  })
  @ApiParam({
    name: 'documentId',
    description: 'ID del documento a verificar',
    example: 'uuid-del-documento',
    required: true
  })
  @ApiBody({
    type: VerifyTrainerDocumentDto,
    description: 'Datos de verificación del documento',
    examples: {
      verificacion1: {
        summary: 'Verificación de Documento',
        value: {
          isVerified: true,
          verificationNotes: 'Documento válido y legible'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Documento verificado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-del-documento' },
        trainerId: { type: 'string', example: 'uuid-del-entrenador' },
        documentType: { type: 'string', example: 'identification' },
        fileName: { type: 'string', example: 'identificacion.jpg' },
        fileUrl: { type: 'string', example: 'https://storage.com/documento.jpg' },
        isVerified: { type: 'boolean', example: true },
        verifiedBy: { type: 'string', example: 'uuid-del-admin' },
        verifiedAt: { type: 'string', example: '2024-01-15T16:00:00.000Z' },
        verificationNotes: { type: 'string', example: 'Documento válido y legible' },
        createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Usuario no autenticado' })
  @ApiResponse({ status: 403, description: 'Solo los administradores pueden verificar documentos de entrenadores' })
  @ApiResponse({ status: 404, description: 'Documento no encontrado' })
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