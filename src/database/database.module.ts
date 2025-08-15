import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { Trainer } from "src/users/entities/trainer.entity";
import { Admin } from "src/users/entities/admin.entity";
import { NormalUser } from "src/users/entities/normal-user.entity";
import { UserBase } from "src/users/entities/user-base.entity";
import { UserTrainer } from "src/users/entities/user-trainer.entity";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("DB_HOST", "localhost"),
        port: configService.get<number>("DB_PORT", 5432),
        username: configService.get<string>("DB_USERNAME", "postgres"),
        password: configService.get<string>("DB_PASSWORD"),
        database: configService.get<string>("DB_NAME", "blxcktraining_db"),
        entities: [User, Trainer, Admin, NormalUser, UserBase, UserTrainer],
        synchronize: configService.get<boolean>("DB_SYNCHRONIZE", false),
        logging: configService.get<boolean>("DB_LOGGING", false),
      }),
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
