import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpsertMediaAssetDto {
  @ApiProperty({ description: 'Carpeta (subcarpeta) a la que pertenece', example: 'Pecho' })
  @IsString()
  folder: string;

  @ApiProperty({ description: 'Ruta completa del archivo en Firebase', example: 'Ejercicios/Pecho/press-banca.gif' })
  @IsString()
  filePath: string;

  @ApiProperty({ description: 'URL pública del archivo', example: 'https://storage.googleapis.com/<bucket>/Ejercicios/Pecho/press-banca.gif' })
  @IsString()
  url: string;

  @ApiProperty({ description: 'Nombre a mostrar', example: 'Press de banca' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripción del recurso', example: 'Ejercicio compuesto para pecho', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}




