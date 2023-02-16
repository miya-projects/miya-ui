import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpResponseBase,
} from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService, TokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { environment } from '@env/environment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as qs from 'qs';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, debounceTime, filter, finalize, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import {ORIGIN_BODY} from "./token";

const CODEMESSAGE: { [key: number]: string } = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '调用接口参数错误，请检查',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {

  constructor(private injector: Injector, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
  }

  private get notification(): NzNotificationService {
    return this.injector.get(NzNotificationService);
  }

  private get tokenSrv(): ITokenService {
    return this.injector.get(DA_SERVICE_TOKEN);
  }

  private get http(): _HttpClient {
    return this.injector.get(_HttpClient);
  }

  private goTo(url: string): void {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }


  /**
   * 跳转到登录页
   */
  private toLogin(): void {
    this.notification.error(`未登录或登录已过期，请重新登录。`, ``);
    this.goTo('/passport/login');
  }

  /**
   * 处理请求结果，状态码不为200，统一处理，状态码为200，响应body中success为false，进行catch处理
   *
   * @param ev  响应对象
   * @param req 请求对象
   * @param next
   * @private
   */
  private handleData(ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // 业务层级错误处理
    if (!(ev instanceof HttpResponse)) {
      return of(ev);
    }
    if (req.responseType !== 'json'){
      return of(ev);
    }
    const body = (ev as HttpResponse<any>).body;
    if (!body) {
      // 没返回数据
      return throwError(() => new Error('返回数据为空'));
    }
    let originBody: boolean = req.context.get(ORIGIN_BODY);
    if (originBody){
      return of(ev);
    }
    // 下面开始展开响应数据
    if (!body.success) {
      if (body.code === -2147483648) {
        // 未定义标准code，需要打提示
        this.injector.get(NzMessageService).error(body.msg);
      } else {
        // 业务级别的错误处理，都在预期内，落到具体调用方处理
        // 继续抛出错误中断后续所有 Pipe、subscribe 操作，因此：
        // 还没发现有不需要打提示特殊处理的地方，有的话就加个参数
        this.injector.get(NzMessageService).error(body.msg);
      }
      return throwError(body);
    }
    // @ts-ignore
    return of(new HttpResponse(Object.assign(ev.clone(), { body: body.data })));
  }

  /**
   * http请求状态码错误处理
   *
   * @param ev
   * @param req
   * @param next
   * @private
   */
  private handleError(ev: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    switch (ev.status) {
      case 401:
        this.toLogin();
        return of(ev);
      case 400:
        this.notification.error('请求错误', ev.error.msg);
        return of(ev);
      // case 500:
      //   // this.goTo(`/exception/${ev.status}`);
      //   break;
      default:
        let errorText = CODEMESSAGE[ev.status] || ev.statusText;
        errorText = (ev as HttpErrorResponse).error?.msg;
        this.notification.error(`请求错误 ${ev.status}: ${ev.url}`, errorText);
        break;
    }
    throw ev.error;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 统一加上服务端前缀
    let url = req.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = environment.SERVER_URL + url;
    }
    let updateReq = {};
    if (!(req.body instanceof FormData)) {
      updateReq = {
        body: qs.stringify(req.body, { arrayFormat: 'repeat', allowDots: true }),
        headers: req.headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8'),
      };
    }
    const newReq = req.clone({
      url,
      ...updateReq,
    });
    return next.handle(newReq).pipe(
      // 先catch http状态码异常
      catchError((ev: HttpErrorResponse) => {
        return this.handleError(ev, newReq, next);
      }),
      mergeMap((ev) => {
        if (ev instanceof HttpResponseBase) {
          return this.handleData(ev, newReq, next);
        }
        return of(ev);
      }),
    );
  }
}
