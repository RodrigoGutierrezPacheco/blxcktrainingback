import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateProgressTables1700000000000 implements MigrationInterface {
  name = 'CreateProgressTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Crear tabla user_exercise_progress
    await queryRunner.createTable(
      new Table({
        name: 'user_exercise_progress',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'exercise_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'isCompleted',
            type: 'boolean',
            default: false,
            comment: 'Indica si el ejercicio fue completado',
          },
          {
            name: 'completedAt',
            type: 'timestamp',
            isNullable: true,
            comment: 'Fecha y hora cuando se completó el ejercicio',
          },
          {
            name: 'progressData',
            type: 'json',
            isNullable: true,
            comment: 'Información adicional del progreso (series realizadas, peso usado, etc.)',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['exercise_id'],
            referencedTableName: 'exercise',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Crear índices para user_exercise_progress
    await queryRunner.query(`CREATE INDEX "IDX_user_exercise_progress_user_id" ON "user_exercise_progress" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_exercise_progress_exercise_id" ON "user_exercise_progress" ("exercise_id")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_exercise_progress_unique" ON "user_exercise_progress" ("user_id", "exercise_id")`);

    // Crear tabla user_day_progress
    await queryRunner.createTable(
      new Table({
        name: 'user_day_progress',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'day_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'isCompleted',
            type: 'boolean',
            default: false,
            comment: 'Indica si el día fue completado',
          },
          {
            name: 'completedAt',
            type: 'timestamp',
            isNullable: true,
            comment: 'Fecha y hora cuando se completó el día',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
            comment: 'Notas del usuario sobre el día de entrenamiento',
          },
          {
            name: 'durationMinutes',
            type: 'integer',
            isNullable: true,
            comment: 'Duración del entrenamiento en minutos',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['day_id'],
            referencedTableName: 'day',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Crear índices para user_day_progress
    await queryRunner.query(`CREATE INDEX "IDX_user_day_progress_user_id" ON "user_day_progress" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_day_progress_day_id" ON "user_day_progress" ("day_id")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_day_progress_unique" ON "user_day_progress" ("user_id", "day_id")`);

    // Crear tabla user_week_progress
    await queryRunner.createTable(
      new Table({
        name: 'user_week_progress',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'week_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'isCompleted',
            type: 'boolean',
            default: false,
            comment: 'Indica si la semana fue completada',
          },
          {
            name: 'completedAt',
            type: 'timestamp',
            isNullable: true,
            comment: 'Fecha y hora cuando se completó la semana',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
            comment: 'Notas del usuario sobre la semana de entrenamiento',
          },
          {
            name: 'completedDays',
            type: 'integer',
            default: 0,
            comment: 'Número de días completados en esta semana',
          },
          {
            name: 'totalMinutes',
            type: 'integer',
            isNullable: true,
            comment: 'Total de minutos entrenados en la semana',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['week_id'],
            referencedTableName: 'week',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Crear índices para user_week_progress
    await queryRunner.query(`CREATE INDEX "IDX_user_week_progress_user_id" ON "user_week_progress" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_week_progress_week_id" ON "user_week_progress" ("week_id")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_week_progress_unique" ON "user_week_progress" ("user_id", "week_id")`);

    // Crear tabla user_routine_progress
    await queryRunner.createTable(
      new Table({
        name: 'user_routine_progress',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'routine_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'isCompleted',
            type: 'boolean',
            default: false,
            comment: 'Indica si la rutina completa fue completada',
          },
          {
            name: 'completedAt',
            type: 'timestamp',
            isNullable: true,
            comment: 'Fecha y hora cuando se completó la rutina',
          },
          {
            name: 'notes',
            type: 'text',
            isNullable: true,
            comment: 'Notas del usuario sobre la rutina completa',
          },
          {
            name: 'completedWeeks',
            type: 'integer',
            default: 0,
            comment: 'Número de semanas completadas',
          },
          {
            name: 'completedDays',
            type: 'integer',
            default: 0,
            comment: 'Número de días completados en total',
          },
          {
            name: 'completedExercises',
            type: 'integer',
            default: 0,
            comment: 'Número de ejercicios completados en total',
          },
          {
            name: 'totalMinutes',
            type: 'integer',
            isNullable: true,
            comment: 'Total de minutos entrenados en la rutina',
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['routine_id'],
            referencedTableName: 'routine',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          },
        ],
      }),
      true,
    );

    // Crear índices para user_routine_progress
    await queryRunner.query(`CREATE INDEX "IDX_user_routine_progress_user_id" ON "user_routine_progress" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_routine_progress_routine_id" ON "user_routine_progress" ("routine_id")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_user_routine_progress_unique" ON "user_routine_progress" ("user_id", "routine_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Eliminar tablas en orden inverso
    await queryRunner.dropTable('user_routine_progress');
    await queryRunner.dropTable('user_week_progress');
    await queryRunner.dropTable('user_day_progress');
    await queryRunner.dropTable('user_exercise_progress');
  }
}
