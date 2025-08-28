import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseConfig } from './firebase.config';
import { FirebaseStorageService } from './firebase-storage.service';
import { FirebaseStorageController } from './firebase-storage.controller';

@Module({
  imports: [ConfigModule],
  controllers: [FirebaseStorageController],
  providers: [FirebaseConfig, FirebaseStorageService],
  exports: [FirebaseConfig, FirebaseStorageService],
})
export class FirebaseModule {}
