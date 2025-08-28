import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFirebaseUrlToTrainerVerification1703123456789 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'trainer_verification_document',
      new TableColumn({
        name: 'firebaseUrl',
        type: 'text',
        isNullable: true,
        comment: 'URL pública del archivo en Firebase Storage',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('trainer_verification_document', 'firebaseUrl');
  }
}
