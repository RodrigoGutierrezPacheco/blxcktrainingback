/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../users/entities/user.entity";
import { Trainer } from "src/users/entities/trainer.entity";
import { Admin } from "src/users/entities/admin.entity";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

interface UserPayload {
  email: string;
  sub: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Trainer)
    private trainerRepository: Repository<Trainer>,

    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,

    private readonly jwtService: JwtService
  ) {}

  async registerUser(createDto: {
    fullName: string;
    email: string;
    password: string;
  }) {
    await this.checkUserEmailExists(createDto.email);
    const hashedPassword = await bcrypt.hash(createDto.password, 10);
    const user = this.userRepository.create({
      ...createDto,
      password: hashedPassword,
    });
    const savedUser = await this.userRepository.save(user);
    const { password, ...result } = savedUser;
    return result;
  }

  async registerTrainer(createDto: {
    fullName: string;
    email: string;
    password: string;
  }) {
    await this.checkTrainerEmailExists(createDto.email);
    const hashedPassword = await bcrypt.hash(createDto.password, 10);
    const trainer = this.trainerRepository.create({
      ...createDto,
      password: hashedPassword,
    });
    const savedTrainer = await this.trainerRepository.save(trainer);
    const { password, ...result } = savedTrainer;
    return result;
  }

async registerAdmin(createDto: { fullName: string; email: string; password: string }) {
    // Limpia espacios y muestra contraseña original
    const cleanPassword = createDto.password.trim();
    console.log("[REGISTRO] Contraseña recibida (limpia):", `"${cleanPassword}"`, 
                "Longitud:", cleanPassword.length);

    await this.checkAdminEmailExists(createDto.email);

    // Genera hash con la contraseña limpia
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    console.log("[REGISTRO] Hash generado:", hashedPassword);

    // Verifica inmediatamente que el hash funciona
    const isValid = await bcrypt.compare(cleanPassword, hashedPassword);
    console.log("[REGISTRO] Verificación inmediata del hash:", isValid);

    if (!isValid) {
        throw new Error("Error al generar el hash de contraseña");
    }

    const admin = this.adminRepository.create({
        ...createDto,
        password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(admin);
    
    console.log("[REGISTRO] Admin guardado:", {
        id: savedAdmin.id,
        email: savedAdmin.email,
        hashLength: savedAdmin.password.length,
        hashPrefix: savedAdmin.password.substring(0, 10) + "..."
    });

    const { password, ...result } = savedAdmin;
    return result;
}

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const { password: _, ...result } = user;
    return result;
  }

  async validateTrainer(email: string, password: string) {
    const trainer = await this.trainerRepository.findOne({ where: { email } });
    if (!trainer) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const isPasswordValid = await bcrypt.compare(password, trainer.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    const { password: _, ...result } = trainer;
    return result;
  }

async validateAdmin(email: string, password: string) {
    console.log("[LOGIN] Validando admin con email:", email);
    console.log("[LOGIN] Contraseña recibida:", password);

    const admin = await this.adminRepository.findOne({
        where: { email },
        select: ["id", "email", "password", "fullName", "role"],
    });

    if (!admin) {
        console.log("[ERROR] Admin no encontrado con email:", email);
        throw new UnauthorizedException("Credenciales inválidas");
    }

    console.log("[LOGIN] Hash almacenado en DB:", admin.password);
    
    // Genera un nuevo hash con la contraseña recibida para comparación
    const testHash = await bcrypt.hash(password, 10);
    console.log("[DEBUG] Hash generado con misma contraseña:", testHash);
    
    // Compara la contraseña recibida con el hash almacenado
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log("[LOGIN] Resultado comparación bcrypt:", isPasswordValid);
    
    // Compara la contraseña recibida con el nuevo hash generado (debería ser true)
    const testComparison = await bcrypt.compare(password, testHash);
    console.log("[DEBUG] Comparación con hash nuevo:", testComparison);

    if (!isPasswordValid) {
        console.log("[ERROR] Fallo en autenticación. Posibles causas:");
        console.log("- La contraseña en DB no coincide con el usuario");
        console.log("- El hash no se generó correctamente durante el registro");
        throw new UnauthorizedException("Credenciales inválidas");
    }

    return admin;
}

  async generateToken(user: User | Trainer | Admin): Promise<string> {
    let role: string;

    // Verificación más segura del tipo de usuario
    if ("role" in user && typeof user.role === "string") {
      role = user.role;
    } else if (this.isTrainer(user)) {
      role = "trainer";
    } else if (this.isAdmin(user)) {
      role = "admin";
    } else {
      role = "user";
    }

    const payload: UserPayload = {
      email: user.email,
      sub: user.id.toString(),
      role,
    };

    // Usando await para cumplir con la regla require-await
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = await this.jwtService.signAsync(payload);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return token;
  }

  private isTrainer(user: any): user is Trainer {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user && typeof user === "object" && "specialization" in user;
  }

  private isAdmin(user: any): user is Admin {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return user && typeof user === "object" && "adminPrivileges" in user;
  }

  private async checkUserEmailExists(email: string): Promise<void> {
    const exists = await this.userRepository.findOne({ where: { email } });
    if (exists) {
      throw new ConflictException(
        "El correo electrónico ya está registrado como usuario"
      );
    }
  }

  private async checkTrainerEmailExists(email: string): Promise<void> {
    const exists = await this.trainerRepository.findOne({ where: { email } });
    if (exists) {
      throw new ConflictException(
        "El correo electrónico ya está registrado como entrenador"
      );
    }
  }

  private async checkAdminEmailExists(email: string): Promise<void> {
    const exists = await this.adminRepository.findOne({ where: { email } });
    if (exists) {
      throw new ConflictException(
        "El correo electrónico ya está registrado como administrador"
      );
    }
  }
}
