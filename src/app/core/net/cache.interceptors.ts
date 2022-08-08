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
import {Observable, of} from 'rxjs';
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

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.context.get(IS_CACHE_ENABLED) && req.method === 'GET') {
      let res = this.cacheSrv.get(CacheInterceptor.getKey(req), {mode: 'none', type: 'm'});
      if (res) {
        return of(res);
      }
    }
    return next.handle(req).pipe(tap(res => {
      if (req.context.get(IS_CACHE_ENABLED)) {
        if (res instanceof HttpResponse) {
          this.cacheSrv.set(CacheInterceptor.getKey(req), res, {type: 'm'});
        }
      }
      return res;
    }));
  }

  private static getKey(req: HttpRequest<any>): string{
    return hash.sha256().update(JSON.stringify(req.urlWithParams)).digest('hex');
  }

}
