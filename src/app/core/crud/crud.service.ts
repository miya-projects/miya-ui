import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {finalize, tap} from 'rxjs/operators';

/**
 * 效率工具，提供写CRUD时最常用的方法，进一步解放生产力
 */
@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(
  ) {
    // this.monitorSrv.isLoading();
  }

}

/**
 * 监控http请求情况
 * 1. 是否正在加载
 */
// @Injectable({
//   providedIn: 'root'
// })
// export class HttpMonitorService implements HttpInterceptor {
//
//   private httpQueue: HttpRequest<any>[] = [];
//
//   /**
//    * 请求增加到队列中去
//    * @param request
//    * @private
//    */
//   private add(request: HttpRequest<any>): void {
//     this.httpQueue.push(request);
//   }
//
//   /**
//    * 从队列移除该请求
//    * @param request
//    * @private
//    */
//   private remove(request: HttpRequest<any>): void {
//     for (let i = 0, n = 0; i < this.httpQueue.length; i++) {
//       if (this.httpQueue[i] === request) {
//         this.httpQueue.splice(i, 1);
//       }
//     }
//   }
//
//   intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     this.add(req);
//     return next.handle(req).pipe(
//       finalize(() => {
//         this.remove(req);
//       })
//     );
//   }
//
//   /**
//    * 当前是否有请求正在加载
//    */
//   public isLoading(): boolean{
//     return this.httpQueue.length > 0;
//   }
//
// }
