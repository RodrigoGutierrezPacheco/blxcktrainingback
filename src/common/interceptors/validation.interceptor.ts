import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        if (error instanceof BadRequestException) {
          // Si es un error de validación, formatear los mensajes en español
          const response = error.getResponse() as any;
          
          if (response.message === 'Error de validación' && response.errors) {
            // Ya está formateado por nuestro ValidationPipe personalizado
            return throwError(() => error);
          }
          
          // Para otros errores de BadRequest, formatear en español
          if (Array.isArray(response.message)) {
            const formattedErrors = response.message.map((msg: string) => {
              // Traducir mensajes comunes de class-validator
              if (msg.includes('should not be empty')) {
                return 'Este campo es obligatorio';
              }
              if (msg.includes('must be a string')) {
                return 'Debe ser una cadena de texto';
              }
              if (msg.includes('must be an email')) {
                return 'Debe ser un email válido';
              }
              if (msg.includes('must be longer than or equal to')) {
                const length = msg.match(/\d+/)?.[0] || '';
                return `Debe tener al menos ${length} caracteres`;
              }
              if (msg.includes('must match')) {
                return 'El formato no es válido';
              }
              return msg;
            });
            
            return throwError(() => new BadRequestException({
              message: 'Error de validación',
              errors: formattedErrors,
              statusCode: 400
            }));
          }
        }
        
        return throwError(() => error);
      }),
    );
  }
}
