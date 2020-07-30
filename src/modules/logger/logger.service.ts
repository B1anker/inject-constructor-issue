import { Inject, Injectable, Scope } from '@nestjs/common';
import winston, { Logger as WinstonLogger, format, transports } from 'winston';
import { ControllerRequest } from "../../types"
import type { TransformableInfo } from 'logform';
import { REQUEST } from '@nestjs/core';
import chalk from "chalk"
import WinstonDaliyRotateTransitor from 'winston-daily-rotate-file';


const isDev = process.env.NODE_ENV === "development";

const { combine, timestamp, printf, label } = format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  response: 3,
  request: 4,
  http: 5,
  verbose: 6,
  debug: 7,
  silly: 8
}

interface GetCommonWinstonDaliyRotateTransitorOptions {
  filename: string;
  level: string;
  printfHandler: (info: TransformableInfo) => string;
}

@Injectable({
  scope: Scope.REQUEST
})
export class RotateLoggerService {
  private info_logger: WinstonLogger;
  private error_logger: WinstonLogger;
  private http_logger: WinstonLogger;
  private label = "test";
  private context = "";
  @Inject(REQUEST) private $request: ControllerRequest;
  private get getContext () {
    return this.context ? `[${this.context}]` : '';
  }

  public constructor() {
    this.initialLoggers();
  }

  private getCommonWinstonDaliyRotateTransitorOptions ({ filename, level, printfHandler }: GetCommonWinstonDaliyRotateTransitorOptions) {
    return {
      format: combine(
        label({
          label: this.label
        }),
        timestamp(),
        printf(printfHandler)
      ),
      filename,
      datePattern: 'YYYY-MM-DD',
      dirname: 'logs',
      maxSize: '50m',
      maxFiles: '14d',
      level
    }
  }

  private initialLoggers () {
    this.info_logger = winston.createLogger({
      transports: [
        new WinstonDaliyRotateTransitor(
          this.getCommonWinstonDaliyRotateTransitorOptions({
            filename: 'test-%DATE%.log',
            level: 'info',
            printfHandler: (info) => {
              const metaString = info.meta ? (this.stringify(info.meta) + '\n') : '';
              return `${this.context} ${process.pid} info      ${info.user}   ${info.timestamp} -: ${info.message}\n${metaString}`;
            }
          })
        )
      ]
    });

    this.error_logger = winston.createLogger({
      transports: [
        new WinstonDaliyRotateTransitor(
          this.getCommonWinstonDaliyRotateTransitorOptions({
            filename: 'test-error-%DATE%.log',
            level: 'error',
            printfHandler: (info) => {
              return `${this.context} ${process.pid} error     ${info.user}   ${info.timestamp} -: ${info.message}\n${info.stack}\n${info.meta ? (this.stringify(info.meta) + '\n') : ''}`;
            }
          })
        )
      ]
    });


    this.http_logger = winston.createLogger({
      levels,
      transports: [
        new WinstonDaliyRotateTransitor(
          this.getCommonWinstonDaliyRotateTransitorOptions({
            filename: 'test-http-%DATE%.log',
            level: 'http',
            printfHandler: (info) => {
              const prefix = `${this.context} ${process.pid}  ${info.level} ${info.level === "request" ? " " : ""}  ${info.user} ${info.timestamp} -: ${info.message}\n${info.meta ? this.stringify(info.meta) + '\n' : ''}`;
              let append = "";
              const level = info.level;
              if (level === "request") {
                append = info.query ? ('query:\n' + this.stringify(info.query) + '\n') : '';
                append = info.params ? ('params:\n' + this.stringify(info.params) + '\n') : '';
                append = info.body ? ('body:\n' + this.stringify(info.body) + '\n') : '';
              } else if (level === "response") {
                append = info.body ? ('body:\n' + this.stringify(info.body) + '\n') : '';
              }
              return prefix + append;
            }
          })
        )
      ]
    });

    if (isDev) {
      this.info_logger.add(new transports.Console({
        format: combine(
          label({
            label: "test"
          }),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
          printf((info) => {
            return `${chalk.greenBright(this.getContext)} ${chalk.cyan(process.pid.toString())} ${chalk.yellow('info')}      ${chalk.blue(info.user)}  ${chalk.magenta(info.timestamp)} -: ${chalk.blueBright(info.message)}\n${info.meta ? (this.stringify(info.meta) + '\n') : ''}`;
          })
        )
      }));
      this.http_logger.add(new transports.Console({
        level: "request",
        format: combine(
          label({
            label: "test"
          }),
          timestamp({ format: 'YYYY-MM-DD HH:mm:ss Z' }),
          printf((info) => {
            return `${chalk.greenBright(this.getContext)} ${chalk.cyan(process.pid.toString())} ${chalk.yellow(info.level)} ${info.level === "request" ? " " : ""} ${chalk.blue(info.user)}  ${chalk.magenta(info.timestamp)} -: ${chalk.blueBright(info.message)}\n`;
          })
        )
      }));
    }
  }

  private stringify (data: any) {
    try {
      return JSON.stringify(data, null, 2);
    } catch (err) {
      return data;
    }
  }

  public error (err: Error, meta?: any) {
    this.error_logger.error(`\n${err.message}`, {
      stack: err.stack,
      user: meta ? meta.user : "unknonw",
      meta
    });
  }

  public log (type: string, message: any, meta?: any) {
    this.info_logger.log(type, message, {
      user: meta ? meta.user : 'unknonw',
      meta
    });
  }

  public info (message: string, meta?: any) {
    this.info_logger.info(message, {
      user: meta ? meta.user : "unknonw",
      meta
    });
  }

  public request (meta?: any) {
    console.log(this.context)
    this.http_logger.log("request", `<-- [${meta.method}] ${meta.url}`, meta)
  }

  public response (meta?: any) {
    this.http_logger.log("response", `--> [${meta.method}] ${meta.url} ${meta.spent}ms`, meta)
  }

  public warn (message: any, meta: any) {
    this.info_logger.warn(message, {
      meta
    });
  }

  public setContext (context: string) {
    this.context = context;
  }
}
