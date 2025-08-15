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
    console.log("[REGISTRO USER] Datos recibidos:", {
      fullName: createDto.fullName,
      email: createDto.email,
      passwordLength: createDto.password.length,
      passwordPrefix: createDto.password.substring(0, 3) + "..."
    });

    await this.checkUserEmailExists(createDto.email);
    
    // Limpia espacios y muestra contraseña original
    const cleanPassword = createDto.password.trim();
    console.log("[REGISTRO USER] Contraseña limpia:", `"${cleanPassword}"`, 
                "Longitud:", cleanPassword.length);

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    console.log("[REGISTRO USER] Hash generado:", hashedPassword);

    // Verifica inmediatamente que el hash funciona
    const isValid = await bcrypt.compare(cleanPassword, hashedPassword);
    console.log("[REGISTRO USER] Verificación inmediata del hash:", isValid);

    if (!isValid) {
        throw new Error("Error al generar el hash de contraseña");
    }

    const user = this.userRepository.create({
      ...createDto,
      password: hashedPassword,
    });
    
    const savedUser = await this.userRepository.save(user);
    
    console.log("[REGISTRO USER] Usuario guardado:", {
        id: savedUser.id,
        email: savedUser.email,
        hashLength: savedUser.password.length,
        hashPrefix: savedUser.password.substring(0, 10) + "..."
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: userPassword, ...result } = savedUser;
    return result;
  }

  async registerTrainer(createDto: {
    fullName: string;
    email: string;
    password: string;
  }) {
    console.log("[REGISTRO TRAINER] Datos recibidos:", {
      fullName: createDto.fullName,
      email: createDto.email,
      passwordLength: createDto.password.length,
      passwordPrefix: createDto.password.substring(0, 3) + "..."
    });

    await this.checkTrainerEmailExists(createDto.email);
    
    // Limpia espacios y muestra contraseña original
    const cleanPassword = createDto.password.trim();
    console.log("[REGISTRO TRAINER] Contraseña limpia:", `"${cleanPassword}"`, 
                "Longitud:", cleanPassword.length);

    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    console.log("[REGISTRO TRAINER] Hash generado:", hashedPassword);

    // Verifica inmediatamente que el hash funciona
    const isValid = await bcrypt.compare(cleanPassword, hashedPassword);
    console.log("[REGISTRO TRAINER] Verificación inmediata del hash:", isValid);

    if (!isValid) {
        throw new Error("Error al generar el hash de contraseña");
    }

    const trainer = this.trainerRepository.create({
      ...createDto,
      password: hashedPassword,
    });
    
    const savedTrainer = await this.trainerRepository.save(trainer);
    
    console.log("[REGISTRO TRAINER] Trainer guardado:", {
        id: savedTrainer.id,
        email: savedTrainer.email,
        hashLength: savedTrainer.password.length,
        hashPrefix: savedTrainer.password.substring(0, 10) + "..."
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: trainerPassword, ...result } = savedTrainer;
    return result;
  }

  async registerAdmin(createDto: { fullName: string; email: string; password: string }) {
    console.log("[REGISTRO ADMIN] Datos recibidos:", {
      fullName: createDto.fullName,
      email: createDto.email,
      passwordLength: createDto.password.length,
      passwordPrefix: createDto.password.substring(0, 3) + "..."
    });

    // Limpia espacios y muestra contraseña original
    const cleanPassword = createDto.password.trim();
    console.log("[REGISTRO ADMIN] Contraseña recibida (limpia):", `"${cleanPassword}"`, 
                "Longitud:", cleanPassword.length);

    await this.checkAdminEmailExists(createDto.email);

    // Genera hash con la contraseña limpia
    const hashedPassword = await bcrypt.hash(cleanPassword, 10);
    console.log("[REGISTRO ADMIN] Hash generado:", hashedPassword);

    // Verifica inmediatamente que el hash funciona
    const isValid = await bcrypt.compare(cleanPassword, hashedPassword);
    console.log("[REGISTRO ADMIN] Verificación inmediata del hash:", isValid);

    if (!isValid) {
        throw new Error("Error al generar el hash de contraseña");
    }

    const admin = this.adminRepository.create({
        ...createDto,
        password: hashedPassword,
    });

    const savedAdmin = await this.adminRepository.save(admin);
    
    console.log("[REGISTRO ADMIN] Admin guardado:", {
        id: savedAdmin.id,
        email: savedAdmin.email,
        hashLength: savedAdmin.password.length,
        hashPrefix: savedAdmin.password.substring(0, 10) + "..."
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: adminPassword, ...result } = savedAdmin;
    return result;
  }

  async validateUser(email: string, password: string) {
    console.log("[LOGIN USER] Validando usuario con email:", email);
    console.log("[LOGIN USER] Contraseña recibida:", password);

    const user = await this.userRepository.findOne({ 
      where: { email },
      select: ["id", "email", "password", "fullName", "role"]
    });
    
    if (!user) {
      console.log("[ERROR] Usuario no encontrado con email:", email);
      throw new UnauthorizedException("Credenciales inválidas");
    }

    console.log("[LOGIN USER] Usuario encontrado:", {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      hashLength: user.password.length,
      hashPrefix: user.password.substring(0, 10) + "..."
    });

    // Genera un nuevo hash con la contraseña recibida para comparación
    const testHash = await bcrypt.hash(password, 10);
    console.log("[DEBUG] Hash generado con misma contraseña:", testHash);
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("[LOGIN USER] Resultado comparación bcrypt:", isPasswordValid);
    
    // Compara la contraseña recibida con el nuevo hash generado (debería ser true)
    const testComparison = await bcrypt.compare(password, testHash);
    console.log("[DEBUG] Comparación con hash nuevo:", testComparison);

    if (!isPasswordValid) {
      console.log("[ERROR] Fallo en autenticación. Posibles causas:");
      console.log("- La contraseña en DB no coincide con el usuario");
      console.log("- El hash no se generó correctamente durante el registro");
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // Retornar el usuario completo para que generateToken funcione
    return user;
  }

  async validateTrainer(email: string, password: string) {
    console.log("[LOGIN TRAINER] Validando trainer con email:", email);
    console.log("[LOGIN TRAINER] Contraseña recibida:", password);

    const trainer = await this.trainerRepository.findOne({ 
      where: { email },
      select: ["id", "email", "password", "fullName", "role"]
    });
    
    if (!trainer) {
      console.log("[ERROR] Trainer no encontrado con email:", email);
      throw new UnauthorizedException("Credenciales inválidas");
    }

    console.log("[LOGIN TRAINER] Trainer encontrado:", {
      id: trainer.id,
      email: trainer.email,
      fullName: trainer.fullName,
      role: trainer.role,
      hashLength: trainer.password.length,
      hashPrefix: trainer.password.substring(0, 10) + "..."
    });

    // Genera un nuevo hash con la contraseña recibida para comparación
    const testHash = await bcrypt.hash(password, 10);
    console.log("[DEBUG] Hash generado con misma contraseña:", testHash);
    
    const isPasswordValid = await bcrypt.compare(password, trainer.password);
    console.log("[LOGIN TRAINER] Resultado comparación bcrypt:", isPasswordValid);
    
    // Compara la contraseña recibida con el nuevo hash generado (debería ser true)
    const testComparison = await bcrypt.compare(password, testHash);
    console.log("[DEBUG] Comparación con hash nuevo:", testComparison);

    if (!isPasswordValid) {
      console.log("[ERROR] Fallo en autenticación. Posibles causas:");
      console.log("- La contraseña en DB no coincide con el trainer");
      console.log("- El hash no se generó correctamente durante el registro");
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // Retornar el trainer completo para que generateToken funcione
    return trainer;
  }

  async validateAdmin(email: string, password: string) {
    console.log("[LOGIN ADMIN] Validando admin con email:", email);
    console.log("[LOGIN ADMIN] Contraseña recibida:", password);

    const admin = await this.adminRepository.findOne({
        where: { email },
        select: ["id", "email", "password", "fullName", "role"],
    });

    if (!admin) {
        console.log("[ERROR] Admin no encontrado con email:", email);
        throw new UnauthorizedException("Credenciales inválidas");
    }

    console.log("[LOGIN ADMIN] Admin encontrado:", {
        id: admin.id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        hashLength: admin.password.length,
        hashPrefix: admin.password.substring(0, 10) + "..."
    });
    
    // Genera un nuevo hash con la contraseña recibida para comparación
    const testHash = await bcrypt.hash(password, 10);
    console.log("[DEBUG] Hash generado con misma contraseña:", testHash);
    
    // Compara la contraseña recibida con el hash almacenado
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    console.log("[LOGIN ADMIN] Resultado comparación bcrypt:", isPasswordValid);
    
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

    const token = await this.jwtService.signAsync(payload);
    return token;
  }

  private isTrainer(user: User | Trainer | Admin): user is Trainer {
    return user && typeof user === "object" && "specialization" in user;
  }

  private isAdmin(user: User | Trainer | Admin): user is Admin {
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
