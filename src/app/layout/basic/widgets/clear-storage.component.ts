import { ChangeDetectionStrategy, Component, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'header-clear-storage',
  template: `
    <i nz-icon nzType="tool"></i>
    清理本地缓存
  `,
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '[class.d-block]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderClearStorageComponent {
  constructor(
    private modalSrv: NzModalService,
    private messageSrv: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private srv: ITokenService,
    private router: Router,
  ) {}

  @HostListener('click')
  _click(): void {
    this.modalSrv.confirm({
      nzTitle: '确认要清除所有的local storage?',
      nzOnOk: () => {
        localStorage.clear();
        this.messageSrv.success('清理成功，即将返回重新登录!');
        setTimeout(() => {
          this.router.navigateByUrl(this.srv.login_url as string);
        }, 2000);
      },
    });
  }
}
