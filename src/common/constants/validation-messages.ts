export const VALIDATION_MESSAGES = {
  // Mensajes generales
  IS_STRING: 'debe ser una cadena de texto',
  IS_NOT_EMPTY: 'es obligatorio',
  IS_EMAIL: 'debe tener un formato válido',
  IS_OPTIONAL: 'es opcional',
  
  // Mensajes específicos para nombres
  FULL_NAME_IS_STRING: 'El nombre completo debe ser una cadena de texto',
  FULL_NAME_IS_NOT_EMPTY: 'El nombre completo es obligatorio',
  FULL_NAME_MATCHES: 'El nombre solo puede contener letras y espacios',
  
  // Mensajes específicos para email
  EMAIL_IS_EMAIL: 'El email debe tener un formato válido',
  EMAIL_IS_NOT_EMPTY: 'El email es obligatorio',
  EMAIL_INVALID: 'El correo electrónico no es válido',
  EMAIL_REQUIRED: 'El correo electrónico es requerido',
  
  // Mensajes específicos para contraseñas
  PASSWORD_IS_STRING: 'La contraseña debe ser una cadena de texto',
  PASSWORD_MIN_LENGTH_6: 'La contraseña debe tener al menos 6 caracteres',
  PASSWORD_MIN_LENGTH_8: 'La contraseña debe tener al menos 8 caracteres',
  PASSWORD_MIN_LENGTH_10: 'La contraseña debe tener al menos 10 caracteres',
  PASSWORD_PATTERN: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número',
  PASSWORD_REQUIRED: 'La contraseña es requerida',
  
  // Mensajes específicos para rutina
  ROUTINE_IS_STRING: 'La rutina debe ser una cadena de texto',
  
  // Mensajes para campos adicionales
  AGE_IS_NUMBER: 'La edad debe ser un número',
  WEIGHT_IS_NUMBER: 'El peso debe ser un número',
  HEIGHT_IS_NUMBER: 'La altura debe ser un número',
  FITNESS_LEVEL_IS_STRING: 'El nivel de condición física debe ser una cadena de texto',
} as const;
