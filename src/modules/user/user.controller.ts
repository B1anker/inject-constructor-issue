import {
  Controller,
  Get,
  Param,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core'
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get(':id')
  public async get (@Param() param) {
    return await this.userService.get(Number(param.id));
  }
}
