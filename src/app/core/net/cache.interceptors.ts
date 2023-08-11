import {
  HttpContext,
  HttpContextToken,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CacheService} from '@delon/cache';
import {_HttpHeaders} from '@delon/theme/src/services/http/http.client';
import {Observable, of, Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import * as hash from 'hash.js';

export const IS_CACHE_ENABLED = new HttpContextToken<boolean>(() => false);

export const CACHE_ENABLE: {
  headers?: _HttpHeaders;
  observe?: 'body';
  reportProgress?: boolean;
  responseType: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  context?: HttpContext;
} = {
  responseType: 'json',
  context: new HttpContext().set(IS_CACHE_ENABLED, true)
}

/**
 * 用于缓存通用型http请求， 只支持GET
 */
@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(
    private cacheSrv: CacheService
  ) {
  }

  // 需要被缓存且正在进行中的请求
  private progressRequestMap: {[key: string]: Subject<any>} = {};

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 需要缓存，且是GET请求，读缓存
    let subject = this.progressRequestMap[CacheInterceptor.getKey(req)];
    if (req.context.get(IS_CACHE_ENABLED) && req.method === 'GET') {
      let res = this.cacheSrv.get(CacheInterceptor.getKey(req), {mode: 'none', type: 'm'});
      if (res) {
        return of(res);
      }else {
        if (subject) {
          // 已经在请求了，这时候就不要再次请求了，等那个请求回来复用那个请求的响应就好了
          return subject;
        }
        // 第一次请求，写入subject，后续进行复用请求响应
        subject = this.progressRequestMap[CacheInterceptor.getKey(req)] = new Subject<any>();
      }
    }
    return next.handle(req).pipe(tap(res => {
      // 需要缓存，且是GET请求，写缓存
      if (req.context.get(IS_CACHE_ENABLED)) {
        if (res instanceof HttpResponse) {
          this.cacheSrv.set(CacheInterceptor.getKey(req), res, {type: 'm'});
          if (subject) {
            // 有人正在等这个请求的响应，给他!
            subject.next(res);
            subject.complete();
            delete this.progressRequestMap[CacheInterceptor.getKey(req)];
          }
        }
      }
      return res;
    }));
  }

  private static getKey(req: HttpRequest<any>): string{
    return hash.sha256().update(JSON.stringify(req.urlWithParams)).digest('hex');
  }

}
