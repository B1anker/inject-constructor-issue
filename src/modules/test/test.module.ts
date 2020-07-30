import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule, Module, forwardRef } from '@nestjs/common';
import { Tests } from './test.entity';
import { TestController } from "./test.controller";
import { TestService } from "./test.service";
import { UserModule } from "../user/user.module";
import { LoggerModule } from "../logger/logger.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Tests]),
    forwardRef(() => UserModule),
    LoggerModule
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule { }
