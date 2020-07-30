import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core'
import { TestService } from './test.service';

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
  ) { }

  @Get(':id')
  public async get (@Param() param) {
    return await this.testService.get(Number(param.id));
  }
}
