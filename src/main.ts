import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe, BadRequestException } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ValidationInterceptor } from "./common/interceptors/validation.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configuración de CORS
  app.enableCors({
    origin: configService.get<string>("ALLOWED_ORIGINS")?.split(",") || [
      "http://localhost:5173",
      "https://tudominio.com",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle("BLXCK Training API")
    .setDescription("API para el sistema BLXCK Training")
    .setVersion("1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // Configuración global de validación con mensajes en español
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors.map(error => {
          const constraints = error.constraints;
          if (constraints) {
            return Object.values(constraints).join(', ');
          }
          return `${error.property} tiene un valor inválido`;
        });
        
        return new BadRequestException({
          message: 'Error de validación',
          errors: messages,
          statusCode: 400
        });
      },
    })
  );

  // Aplicar interceptor de validación global
  app.useGlobalInterceptors(new ValidationInterceptor());

  const PORT = configService.get<number>("PORT") || 8000;

  // Solución: Manejo explícito de la promesa
  await app
    .listen(PORT)
    .then(() => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación Swagger en http://localhost:${PORT}/api`);
    })
    .catch((error) => {
      console.error("Error al iniciar el servidor:", error);
      process.exit(1);
    });
}

// Inicio de la aplicación con manejo de errores
bootstrap().catch((err) => {
  console.error("Error durante la inicialización:", err);
  process.exit(1);
});
