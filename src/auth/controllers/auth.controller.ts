/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Post, Body, UsePipes } from "@nestjs/common";
import { AuthService } from "../auth.service";
import { RegisterDto } from "src/users/dto/register.dto";
import { LoginUserDto } from "../dto/login-user.dto";
import { LoginTrainerDto } from "../dto/login-trainer.dto";
import { LoginAdminDto } from "../dto/login-admin.dto";
import { ValidationPipe } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register/user")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User successfully registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Email already registered" })
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
  @ApiOperation({ summary: "Register a new trainer" })
  @ApiResponse({ status: 201, description: "Trainer successfully registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Email already registered" })
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
  @ApiOperation({ summary: "Register a new admin" })
  @ApiResponse({ status: 201, description: "Admin successfully registered" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 409, description: "Email already registered" })
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
  @ApiOperation({ summary: "Login as user" })
  @ApiResponse({ status: 200, description: "User successfully logged in" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async loginUser(@Body() loginDto: LoginUserDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password
    );
    const token = await this.authService.generateToken({
      ...user,
      password: "", // Añadir propiedad faltante
      hashPassword: () => Promise.resolve(), // Añadir método faltante
    });
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
  @ApiOperation({ summary: "Login as trainer" })
  @ApiResponse({ status: 200, description: "Trainer successfully logged in" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async loginTrainer(@Body() loginDto: LoginTrainerDto) {
    const trainer = await this.authService.validateTrainer(
      loginDto.email,
      loginDto.password
    );
    const token = await this.authService.generateToken({
      ...trainer,
      password: "", // Añadir propiedad faltante
      hashPassword: () => Promise.resolve(), // Añadir método faltante
    });
    return {
      status: "success",
      message: "Trainer logged in successfully",
      token,
      trainer,
    };
  }

  @Post("login/admin")
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOperation({ summary: "Login as admin" })
  @ApiResponse({ status: 200, description: "Admin successfully logged in" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async loginAdmin(@Body() loginDto: LoginAdminDto) {
    const admin = await this.authService.validateAdmin(
      loginDto.email,
      loginDto.password
    );
    const token = await this.authService.generateToken({
      ...admin,
      password: "", // Añadir propiedad faltante
      hashPassword: () => Promise.resolve(), // Añadir método faltante
    });
    return {
      status: "success",
      message: "Admin logged in successfully",
      token,
      admin,
    };
  }
}
