import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { _HttpClient, SettingsService } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadChangeParam } from 'ng-zorro-antd/upload/interface';
import { CACHE_ENABLE } from '../../../../core/net/cache.interceptors';

@Component({
    styleUrls: ['./basic.component.less'],
    selector: 'app-basic-user-settings',
    templateUrl: './basic.component.html',
    standalone: false
})
export class BasicSettingsComponent implements OnInit, AfterViewInit {
  url = `/sys/user/list`;
  user: any;
  avatar: NzUploadFile[] = [];
  sexOptions: any[] = [];

  constructor(
    private settingsSrv: SettingsService,
    private http: _HttpClient,
    private msgSrv: NzMessageService,
    private cdf: ChangeDetectorRef
  ) {}

  @ViewChild('f')
  form!: UntypedFormControl;

  ngOnInit(): void {
    this.user = {};
    this.http.get('/sys/dp/enums', { key: 'SysUser.Sex' }, CACHE_ENABLE).subscribe(res => {
      this.sexOptions = res;
      this.user = {
        ...this.settingsSrv.user,
        sex: this.settingsSrv.user['sex']?.value
      };
      this.cdf.markForCheck();
      this.cdf.detectChanges();

      this.avatar = [
        {
          name: '',
          uid: '',
          showDownload: false,
          status: 'done',
          response: this.user.avatar,
          isUploading: false
        }
      ] as NzUploadFile[];
    });
  }

  add(): void {}

  ngAfterViewInit(): void {}

  public avatarChange({ file }: NzUploadChangeParam): void {
    if (file.status === 'done') {
      this.user.avatar = file.response.url;
    }
  }

  save() {
    let value = this.form.value;
    this.http
      .put('/sys/user/current', {
        ...value,
        avatar: Array.isArray(this.avatar) ? this.avatar[this.avatar.length - 1].response.id : this.avatar
      })
      .subscribe(() => {
        this.msgSrv.success('操作成功');
      });
  }
}
