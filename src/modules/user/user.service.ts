import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RotateLoggerService } from '../logger/logger.service';
import { TestService } from "../test/test.service";
import { Users } from "./user.entity";

@Injectable()
export class UserService {

  constructor(
    @Inject(forwardRef(() => TestService)) private readonly testService: TestService,
    @InjectRepository(Users) private readonly userModel: Repository<Users>,
    private readonly logger: RotateLoggerService
  ) { }

  public async get (id: number) {
    // this.logger.info("user", id);
    return await this.userModel.findOne({ id });
  }
}
