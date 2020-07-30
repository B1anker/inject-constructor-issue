import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RotateLoggerService } from '../logger/logger.service';
import { UserService } from '../user/user.service';
import { Tests } from "./test.entity";

@Injectable()
export class TestService {
  constructor(
    @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    @InjectRepository(Tests) private readonly testModel: Repository<Tests>,
    private readonly logger: RotateLoggerService
  ) { }

  public async get (id: number) {
    this.logger.info("test", id);
    return await this.testModel.findOne({ id });
  }
}
