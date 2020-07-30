import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule, Module, forwardRef } from '@nestjs/common';
import { Users } from './user.entity';
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TestModule } from '../test/test.module';
import { LoggerModule } from "../logger/logger.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    forwardRef(() => TestModule),
    LoggerModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
