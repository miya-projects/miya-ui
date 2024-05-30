import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, JWTTokenModel, SocialOpenType, SocialService } from '@delon/auth';
import { _HttpClient, I18nPipe, SettingsService } from '@delon/theme';
import { environment } from '@env/environment';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabChangeEvent, NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { LoginType } from './login.service';
import { NgIf } from '@angular/common';
import { HotkeyDirective } from '@delon/abc/hotkey';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    I18nPipe,
    NzCheckboxModule,
    NzTabsModule,
    NzAlertModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzToolTipModule,
    NzIconModule,
    NgIf,
    HotkeyDirective
  ]
})
export class UserLoginComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly settingsService = inject(SettingsService);
  private readonly socialService = inject(SocialService);
  private readonly reuseTabService = inject(ReuseTabService, { optional: true });
  private readonly tokenService = inject(DA_SERVICE_TOKEN);
  private readonly startupSrv = inject(StartupService);
  protected readonly http = inject(_HttpClient);
  private readonly cdr = inject(ChangeDetectorRef);
  protected readonly msgSrv = inject(NzMessageService);

  form = inject(FormBuilder).nonNullable.group({
    userName: ['admin', [Validators.required]],
    password: ['123456', [Validators.required]],
    mobile: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
    captcha: [null, [Validators.required]],
    remember: [true]
  });

  error = '';
  errorForPhoneLogin = '';
  type = 0;
  loading = false;

  count = 0;
  interval$: any;

  switch({ index }: NzTabChangeEvent): void {
    this.type = index!;
  }

  getCaptcha(): void {
    const mobile = this.form.controls.mobile;
    if (mobile.invalid) {
      mobile.markAsDirty({ onlySelf: true });
      mobile.updateValueAndValidity({ onlySelf: true });
      return;
    }
    this.count = 59;
    this.interval$ = setInterval(() => {
      this.count -= 1;
      if (this.count <= 0) {
        clearInterval(this.interval$);
      }
    }, 1000);
  }

  submit(): void {
    this.error = '';
    if (this.type === LoginType.USERNAME_AND_PASSWORD) {
      this.userNameAndPasswordLogin();
    } else if (this.type === LoginType.PHONE_AND_VERIFY_CODE) {
      this.phoneAndVVerifyCodeLogin();
    } else {
      this.msgSrv.error('未知的登录方式');
    }
    // if (this.type === 0) {
    //   const { userName, password } = this.form.controls;
    //   userName.markAsDirty();
    //   userName.updateValueAndValidity();
    //   password.markAsDirty();
    //   password.updateValueAndValidity();
    //   if (userName.invalid || password.invalid) {
    //     return;
    //   }
    // } else {
    //   const { mobile, captcha } = this.form.controls;
    //   mobile.markAsDirty();
    //   mobile.updateValueAndValidity();
    //   captcha.markAsDirty();
    //   captcha.updateValueAndValidity();
    //   if (mobile.invalid || captcha.invalid) {
    //     return;
    //   }
    // }
    //
    // // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // // 然一般来说登录请求不需要校验，因此加上 `ALLOW_ANONYMOUS` 表示不触发用户 Token 校验
    // this.loading = true;
    // this.cdr.detectChanges();
    // this.http
    //   .post(
    //     '/login/account',
    //     {
    //       type: this.type,
    //       userName: this.form.value.userName,
    //       password: this.form.value.password
    //     },
    //     null,
    //     {
    //       context: new HttpContext().set(ALLOW_ANONYMOUS, true)
    //     }
    //   )
    //   .pipe(
    //     finalize(() => {
    //       this.loading = false;
    //       this.cdr.detectChanges();
    //     })
    //   )
    //   .subscribe(res => {
    //     if (res.msgSrv !== 'ok') {
    //       this.error = res.msgSrv;
    //       this.cdr.detectChanges();
    //       return;
    //     }
    //     // 清空路由复用信息
    //     this.reuseTabService?.clear();
    //     // 设置用户Token信息
    //     // TODO: Mock expired value
    //     res.user.expired = +new Date() + 1000 * 60 * 5;
    //     this.tokenService.set(res.user);
    //     // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
    //     this.startupSrv.load().subscribe(() => {
    //       let url = this.tokenService.referrer!.url || '/';
    //       if (url.includes('/passport')) {
    //         url = '/';
    //       }
    //       this.router.navigateByUrl(url);
    //     });
    //   });
  }

  /**
   * 执行手机号和验证码登录
   */
  phoneAndVVerifyCodeLogin(): void {
    const { mobile, captcha } = this.form.controls;
    this.errorForPhoneLogin = '';
    mobile.markAsDirty();
    mobile.updateValueAndValidity();
    captcha.markAsDirty();
    captcha.updateValueAndValidity();
    if (mobile.invalid || captcha.invalid) {
      return;
    }
    this.http
      .post('/sys/user/current/loginByPhone', {
        phone: mobile.value,
        verifyCode: captcha.value
      })
      .subscribe({
        next: (data: any) => {
          this.loginSuccessHandle(data);
        },
        error: body => {
          this.errorForPhoneLogin = body.msgSrv;
        }
      });
  }

  /**
   * 执行用户名和密码登录
   */
  userNameAndPasswordLogin(): void {
    this.error = '';
    const { userName, password } = this.form.controls;
    userName.markAsDirty();
    userName.updateValueAndValidity();
    password.markAsDirty();
    password.updateValueAndValidity();
    if (userName.invalid || password.invalid) {
      return;
    }
    this.http
      .post('/sys/user/current/login', {
        userName: userName.value,
        password: password.value
      })
      .subscribe({
        next: res => {
          this.loginSuccessHandle(res);
        },
        error: body => {
          this.error = body.msgSrv;
        }
      });
  }

  loginSuccessHandle(res: any) {
    // 清空路由复用信息
    this.reuseTabService?.clear();
    // 设置用户Token信息
    this.tokenService.set({
      token: res.token,
      expired: 1000000000
    } as JWTTokenModel);

    let url = this.tokenService.referrer!.url || '/';
    if (url.includes('/passport')) {
      url = '/';
    }
    this.router.navigateByUrl(url);
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }

  ngOnInit(): void {}
}
