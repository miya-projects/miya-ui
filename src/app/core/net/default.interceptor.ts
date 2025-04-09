import { HttpErrorResponse, HttpHandler, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse, HttpResponseBase } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { IGNORE_BASE_URL } from '@delon/theme';
import { environment } from '@env/environment';
import * as qs from 'qs';
import { catchError, mergeMap, Observable, of, throwError } from 'rxjs';

import { checkStatus, getAdditionalHeaders, ReThrowHttpError, toLogin } from './helper';
import { tryRefreshToken } from './refresh-token';
import { ORIGIN_BODY } from './token';
import { NzMessageService } from 'ng-zorro-antd/message';

function handleData(injector: Injector, ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  // 业务层级错误处理
  if (!(ev instanceof HttpResponse)) {
    return of(ev);
  }
  if (req.responseType !== 'json') {
    return of(ev);
  }
  const body = (ev as HttpResponse<any>).body;
  if (!body) {
    // 没返回数据
    return throwError(() => new Error('返回数据为空'));
  }
  let originBody: boolean = req.context.get(ORIGIN_BODY);
  if (originBody) {
    return of(ev);
  }
  // 下面开始展开响应数据
  if (!body.success) {
    if (body.code === -2147483648) {
      // 未定义标准code，需要打提示
      injector.get(NzMessageService).error(body.msg);
    } else {
      // 业务级别的错误处理，都在预期内，落到具体调用方处理
      // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
      // 还没发现有不需要打提示特殊处理的地方，有的话就加个参数
      injector.get(NzMessageService).error(body.msg);
    }
    return throwError(body);
  }
  // @ts-ignore
  return of(new HttpResponse(Object.assign(ev.clone(), { body: body.data })));

  // 业务处理：一些通用操作
  // switch (ev.status) {
  //   case 200:
  //     break;
  //   case 401:
  //     if (environment.api.refreshTokenEnabled && environment.api.refreshTokenType === 're-request') {
  //       return tryRefreshToken(injector, ev, req, next);
  //     }
  //     toLogin(injector);
  //     break;
  //   case 403:
  //   case 404:
  //   case 500:
  //     // goTo(injector, `/exception/${ev.status}?url=${req.urlWithParams}`);
  //     break;
  //   default:
  //     if (ev instanceof HttpErrorResponse) {
  //       console.warn('未可知错误，大部分是由于后端不支持跨域CORS或无效配置引起，请参考 https://ng-alain.com/docs/server 解决跨域问题', ev);
  //     }
  //     break;
  // }
  // if (ev instanceof HttpErrorResponse) {
  //   return throwError(() => ev);
  // } else if ((ev as unknown as ReThrowHttpError)._throw === true) {
  //   return throwError(() => (ev as unknown as ReThrowHttpError).body);
  // } else {
  //   return of(ev);
  // }
}

/**
 * 跳转到登录页
 */
// function toLogin(): void {
//   this.notification.error(`未登录或登录已过期，请重新登录。`, ``);
//   this.tokenService.clear();
//   this.goTo('/passport/login');
// }

/**
 * http请求状态码错误处理
 *
 * @param ev
 * @param req
 * @param next
 * @private
 */
function handleError(injector: Injector, ev: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> {
  switch (ev.status) {
    case 401:
      toLogin(injector);
      return of(ev);
    case 400:
      // this.notification.error('请求错误', ev.error.msg);
      return of(ev);
    // case 500:
    //   // this.goTo(`/exception/${ev.status}`);
    //   break;
    default:
      // let errorText = CODEMESSAGE[ev.status] || ev.statusText;
      // errorText = (ev as HttpErrorResponse).error?.msg;
      // this.notification.error(`请求错误 ${ev.status}: ${ev.url}`, errorText);
      break;
  }
  throw ev.error;
}

export const defaultInterceptor: HttpInterceptorFn = (req, next) => {
  // 统一加上服务端前缀
  let url = req.url;
  if (!req.context.get(IGNORE_BASE_URL) && !url.startsWith('https://') && !url.startsWith('http://')) {
    const { baseUrl } = environment.api;
    url = baseUrl + (baseUrl.endsWith('/') && url.startsWith('/') ? url.substring(1) : url);
  }

  let updateReq = {};
  if (!(req.body instanceof FormData)) {
    updateReq = {
      setHeaders: getAdditionalHeaders(req.headers),
      body: qs.stringify(req.body, { arrayFormat: 'repeat', allowDots: true })
    };
  }
  const newReq = req.clone({
    url,
    ...updateReq
  });

  const injector = inject(Injector);

  return next(newReq).pipe(
    // 先catch http状态码异常
    catchError((ev: HttpErrorResponse) => {
      return handleError(injector, ev, newReq, next);
    }),
    mergeMap(ev => {
      // 允许统一对请求错误处理
      if (ev instanceof HttpResponseBase) {
        return handleData(injector, ev, newReq, next);
      }
      // 若一切都正常，则后续操作
      return of(ev);
    })
    // catchError((err: HttpErrorResponse) => handleData(injector, err, newReq, next))
  );
};
