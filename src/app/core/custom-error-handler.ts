import { ErrorHandler, Injectable } from '@angular/core';

/**
 * 错误处理器，
 */
@Injectable()
export class CustomErrorHandler extends ErrorHandler {
  handleError(error: any): void {
    console.log('error handler');
    // todo 上报
    super.handleError(error);
  }
}
