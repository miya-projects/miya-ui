import {
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
  private refreshTokenType: 're-request' | 'auth-refresh' = 'auth-refresh';
  private refreshToking = false;
  private refreshToken$: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private injector: Injector, @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService) {
    if (this.refreshTokenType === 'auth-refresh') {
      this.buildAuthRefresh();
    }
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
   * 刷新 Token 请求
   */
  private refreshTokenRequest(): Observable<any> {
    const model = this.tokenSrv.get();
    return this.http.post(`/api/auth/refresh`, null, null, { headers: { refresh_token: model?.refresh_token || '' } });
  }

  // #region 刷新Token方式一：使用 401 重新刷新 Token

  private tryRefreshToken(ev: HttpResponseBase, req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    // 1、若请求为刷新Token请求，表示来自刷新Token可以直接跳转登录页
    if ([`/api/auth/refresh`].some((url) => req.url.includes(url))) {
      this.toLogin();
      return throwError(ev);
    }
    // 2、如果 `refreshToking` 为 `true` 表示已经在请求刷新 Token 中，后续所有请求转入等待状态，直至结果返回后再重新发起请求
    if (this.refreshToking) {
      return this.refreshToken$.pipe(
        filter((v) => !!v),
        take(1),
        switchMap(() => next.handle(this.reAttachToken(req))),
      );
    }
    // 3、尝试调用刷新 Token
    this.refreshToking = true;
    this.refreshToken$.next(null);

    return this.refreshTokenRequest().pipe(
      switchMap((res) => {
        // 通知后续请求继续执行
        this.refreshToking = false;
        this.refreshToken$.next(res);
        // 重新保存新 token
        this.tokenSrv.set(res);
        // 重新发起请求
        return next.handle(this.reAttachToken(req));
      }),
      catchError((err) => {
        this.refreshToking = false;
        this.toLogin();
        return throwError(err);
      }),
    );
  }

  /**
   * 重新附加新 Token 信息
   *
   * > 由于已经发起的请求，不会再走一遍 `@delon/auth` 因此需要结合业务情况重新附加新的 Token
   */
  private reAttachToken(req: HttpRequest<any>): HttpRequest<any> {
    // 以下示例是以 NG-ALAIN 默认使用 `SimpleInterceptor`
    const token = this.tokenSrv.get()?.token;
    return req.clone({
      setHeaders: {
        token: `Bearer ${token}`,
      },
    });
  }

  // #endregion

  // #region 刷新Token方式二：使用 `@delon/auth` 的 `refresh` 接口
  private buildAuthRefresh(): void {
    this.tokenSrv.refresh
      .pipe(
        filter(() => !this.refreshToking),
        switchMap(() => {
          this.refreshToking = true;
          return this.refreshTokenRequest();
        }),
      )
      .subscribe(
        (res) => {
          // TODO: Mock expired value
          res.expired = +new Date() + 1000 * 60 * 5;
          this.refreshToking = false;
          this.tokenSrv.set(res);
        },
        () => this.toLogin(),
      );
  }

  // #endregion
  /**
   * 跳转到登录页
   * @private
   */
  private toLogin(): void {
    this.notification.error(`未登录或登录已过期，请重新登录。`, ``);
    this.goTo('/passport/login');
  }

  /**
   * 处理请求结果，状态码不为200，统一处理，状态码为200，响应body中success为false，进行catch处理
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
    const body = (ev as HttpResponse<any>).body;
    if (!body) {
      // 预期外
      return throwError(ev);
    }
    if (req.responseType === 'blob'){
      return of(ev);
    }
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
   * @param ev
   * @param req
   * @param next
   * @private
   */
  private handleError(ev: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): void {
    switch (ev.status) {
      case 401:
        // if (this.refreshTokenType === 're-request') {
        //   return this.tryRefreshToken(ev, req, next);
        // }
        this.toLogin();
        break;
      // case 500:
      //   // this.goTo(`/exception/${ev.status}`);
      //   break;
      default:
        let errorText: string = CODEMESSAGE[ev.status] || ev.statusText;
        errorText = (ev as HttpErrorResponse).error?.msg;
        // todo 不太友好
        this.notification.error(`请求错误 ${ev.status}: ${ev.url}`, errorText);
        break;
    }
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
        this.handleError(ev, newReq, next);
        throw ev;
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
