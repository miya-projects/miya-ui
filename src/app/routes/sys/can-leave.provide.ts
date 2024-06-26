import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { SysDictComponent } from './dict/dict.component';
// import { GuardComponent } from './guard.component';

@Injectable()
export class CanLeaveProvide {
  constructor(private confirmSrv: NzModalService) {}

  canDeactivate(
    component: SysDictComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    return new Observable(observer => {
      this.confirmSrv.confirm({
        nzTitle: '确认要离开吗？',
        nzContent: '你已经填写了部分表单离开会放弃已经填写的内容。',
        nzOkText: '离开',
        nzCancelText: '取消',
        nzOnOk: () => {
          observer.next(true);
          observer.complete();
        },
        nzOnCancel: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }
}
