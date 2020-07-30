import { Injectable, Inject, Scope, OnModuleInit } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({
  scope: Scope.REQUEST
})
export class AppService implements OnModuleInit {
  constructor (
    @Inject(REQUEST) private readonly request: Request
  ) {
    // not print
    console.log("constructor");
  }

  onModuleInit () {
    // not print
    console.log("onModuleInit");
  }

  getHello(): string {
    return 'Hello World!';
  }
}
