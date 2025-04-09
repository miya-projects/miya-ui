import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { _HttpClient, SettingsService } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
    styleUrls: ['./security.component.less'],
    selector: 'app-security-user-settings',
    templateUrl: './security.component.html',
    standalone: false
})
export class SecuritySettingsComponent implements OnInit, AfterViewInit {
  constructor(
    private settingsSrv: SettingsService,
    private http: _HttpClient,
    private msgSrv: NzMessageService
  ) {}

  @ViewChild('f')
  form!: UntypedFormControl;
  formData: any = {};

  ngOnInit(): void {}

  ngAfterViewInit(): void {}

  save() {
    let value = this.form.value;
    this.http
      .put('/sys/user/current/password', {
        ...value
      })
      .subscribe(res => {
        this.msgSrv.success('密码修改成功，下次进入系统可使用新密码登录');
        this.form.reset();
      });
  }
}
