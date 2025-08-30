import { Controller, Post, Body, UsePipes } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { RegisterDto } from "src/users/dto/register.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { LoginTrainerDto } from "../dto/login-trainer.dto";
import { LoginAdminDto } from "../dto/login-admin.dto";
import { ValidationPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from "@nestjs/swagger";

@ApiTags("🔐 Autenticación y Autorización")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register/user")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ 
    summary: "Registrar Usuario Normal", 
    description: "Crea una nueva cuenta de usuario normal en el sistema. El usuario podrá acceder a rutinas y planes básicos."
  })
  @ApiBody({
    type: RegisterDto,
    description: "Datos del usuario a registrar",
    examples: {
      usuario1: {
        summary: "Usuario Ejemplo",
        value: {
          email: "usuario@ejemplo.com",
          password: "Contraseña123!",
          fullName: "Juan Pérez",
          age: 25,
          weight: 70,
          height: 175
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: "Usuario registrado exitosamente",
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'User registered successfully' },
        data: {
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
      }
    }
  })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  @ApiResponse({ status: 409, description: "El email ya está registrado" })
  async registerUser(@Body() registerDto: RegisterDto) {
    const user = await this.authService.registerUser(registerDto);
    return {
      status: "success",
      message: "User registered successfully",
      data: user,
    };
  }

  @Post("register/trainer")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ 
    summary: "Registrar Entrenador", 
    description: "Crea una nueva cuenta de entrenador. Los entrenadores pueden crear rutinas y ser asignados a usuarios."
  })
  @ApiBody({
    type: RegisterDto,
    description: "Datos del entrenador a registrar",
    examples: {
      entrenador1: {
        summary: "Entrenador Ejemplo",
        value: {
          email: "entrenador@ejemplo.com",
          password: "Contraseña123!",
          fullName: "Carlos Entrenador",
          age: 30,
          phone: "+1234567890",
          documents: "Certificación en entrenamiento personal",
          rfc: "CARE800101ABC",
          curp: "CARE800101HDFABC00",
          dateOfBirth: "1980-01-01"
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: "Entrenador registrado exitosamente",
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Trainer registered successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-generado' },
            email: { type: 'string', example: 'entrenador@ejemplo.com' },
            fullName: { type: 'string', example: 'Carlos Entrenador' },
            role: { type: 'string', example: 'trainer' },
            age: { type: 'number', example: 30 },
            phone: { type: 'string', example: '+1234567890' },
            isActive: { type: 'boolean', example: true },
            isVerified: { type: 'boolean', example: false },
            createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  @ApiResponse({ status: 409, description: "El email ya está registrado" })
  async registerTrainer(@Body() registerDto: RegisterDto) {
    const trainer = await this.authService.registerTrainer(registerDto);
    return {
      status: "success",
      message: "Trainer registered successfully",
      data: trainer,
    };
  }

  @Post("register/admin")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ 
    summary: "Registrar Administrador", 
    description: "Crea una nueva cuenta de administrador. Los administradores tienen acceso completo al sistema."
  })
  @ApiBody({
    type: RegisterDto,
    description: "Datos del administrador a registrar",
    examples: {
      admin1: {
        summary: "Administrador Ejemplo",
        value: {
          email: "admin@ejemplo.com",
          password: "Contraseña123!",
          fullName: "Admin Sistema",
          age: 35
        }
      }
    }
  })
  @ApiResponse({ 
    status: 201, 
    description: "Administrador registrado exitosamente",
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Admin registered successfully' },
        data: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-generado' },
            email: { type: 'string', example: 'admin@ejemplo.com' },
            fullName: { type: 'string', example: 'Admin Sistema' },
            role: { type: 'string', example: 'admin' },
            age: { type: 'number', example: 35 },
            createdAt: { type: 'string', example: '2024-01-15T10:00:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: "Datos de entrada inválidos" })
  @ApiResponse({ status: 409, description: "El email ya está registrado" })
  async registerAdmin(@Body() registerDto: RegisterDto) {
    const admin = await this.authService.registerAdmin(registerDto);
    return {
      status: "success",
      message: "Admin registered successfully",
      data: admin,
    };
  }

  @Post("login/user")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ 
    summary: "Login de Usuario", 
    description: "Autentica a un usuario normal y devuelve un token JWT para acceder a las funcionalidades del sistema."
  })
  @ApiBody({
    type: LoginUserDto,
    description: "Credenciales de login del usuario",
    examples: {
      login1: {
        summary: "Login Usuario",
        value: {
          email: "usuario@ejemplo.com",
          password: "Contraseña123!"
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: "Usuario autenticado exitosamente",
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'User logged in successfully' },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            fullName: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'usuario@ejemplo.com' },
            role: { type: 'string', example: 'user' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: "Credenciales inválidas" })
  async loginUser(@Body() loginDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password
    );
    const token = await this.authService.generateToken(user);
    return {
      status: "success",
      message: "User logged in successfully",
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  }

  @Post("login/trainer")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ 
    summary: "Login de Entrenador", 
    description: "Autentica a un entrenador y devuelve un token JWT para acceder a las funcionalidades de entrenador."
  })
  @ApiBody({
    type: LoginTrainerDto,
    description: "Credenciales de login del entrenador",
    examples: {
      login1: {
        summary: "Login Entrenador",
        value: {
          email: "entrenador@ejemplo.com",
          password: "Contraseña123!"
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: "Entrenador autenticado exitosamente",
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Trainer logged in successfully' },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        trainer: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-generado' },
            email: { type: 'string', example: 'entrenador@ejemplo.com' },
            fullName: { type: 'string', example: 'Carlos Entrenador' },
            role: { type: 'string', example: 'trainer' },
            isActive: { type: 'boolean', example: true },
            isVerified: { type: 'boolean', example: false }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: "Credenciales inválidas" })
  async loginTrainer(@Body() loginDto: LoginTrainerDto) {
    const trainer = await this.authService.validateTrainer(
      loginDto.email,
      loginDto.password
    );
    const token = await this.authService.generateToken(trainer);
    return {
      status: "success",
      message: "Trainer logged in successfully",
      token,
      trainer,
    };
  }

  @Post("login/admin")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ 
    summary: "Login de Administrador", 
    description: "Autentica a un administrador y devuelve un token JWT para acceder a todas las funcionalidades del sistema."
  })
  @ApiBody({
    type: LoginAdminDto,
    description: "Credenciales de login del administrador",
    examples: {
      login1: {
        summary: "Login Administrador",
        value: {
          email: "admin@ejemplo.com",
          password: "Contraseña123!"
        }
      }
    }
  })
  @ApiResponse({ 
    status: 200, 
    description: "Administrador autenticado exitosamente",
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'success' },
        message: { type: 'string', example: 'Admin logged in successfully' },
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        admin: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'uuid-generado' },
            email: { type: 'string', example: 'admin@ejemplo.com' },
            fullName: { type: 'string', example: 'Admin Sistema' },
            role: { type: 'string', example: 'admin' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: "Credenciales inválidas" })
  async loginAdmin(@Body() loginDto: LoginAdminDto) {
    const admin = await this.authService.validateAdmin(
      loginDto.email,
      loginDto.password
    );
    const token = await this.authService.generateToken(admin);
    return {
      status: "success",
      message: "Admin logged in successfully",
      token,
      admin,
    };
  }
}
