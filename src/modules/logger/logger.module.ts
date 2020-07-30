import { Module } from '@nestjs/common';
import { RotateLoggerService } from './logger.service';

@Module({
  providers: [RotateLoggerService],
  exports: [RotateLoggerService],
})
export class LoggerModule {}
