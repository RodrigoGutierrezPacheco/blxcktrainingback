import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ✅ Configuración segura de CORS (recomendado para producción)
  app.enableCors({
    origin: configService.get<string>('ALLOWED_ORIGINS')?.split(',') || [
      'http://localhost:5173', // Frontend local (Vite/React)
      'https://tudominio.com', // Tu dominio en producción
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si necesitas cookies/tokens
  });

  const PORT = configService.get<number>('PORT') || 8000;
  const DB_NAME = configService.get<string>('DB_NAME') || 'blacktraining_db';
  const DB_PORT = configService.get<number>('DB_PORT') || 5432;

  await app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📦 Base de datos: ${DB_NAME}`);
    console.log(`🔌 Puerto de la base de datos: ${DB_PORT}`);
  });
}
bootstrap();