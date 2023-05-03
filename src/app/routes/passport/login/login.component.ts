import {Component, Inject, OnDestroy, Optional} from '@angular/core';
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {StartupService} from '@core';
import {ReuseTabService} from '@delon/abc/reuse-tab';
import {ALLOW_ANONYMOUS, DA_SERVICE_TOKEN, ITokenService, SocialOpenType, SocialService} from '@delon/auth';
import {_HttpClient, SettingsService} from '@delon/theme';
import {environment} from '@env/environment';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzTabChangeEvent} from 'ng-zorro-antd/tabs';
import {LoginType} from './login.service';
import {HttpContext} from "@angular/common/http";

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  constructor(
    fb: UntypedFormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    private socialService: SocialService,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
  ) {
    this.form = fb.group({
      userName: ['admin', [Validators.required]],
      password: ['123456', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern(/^1\d{10}$/)]],
      captcha: [null, [Validators.required]],
      remember: [true],
    });
  }

  // #region fields

  get userName(): AbstractControl {
    return this.form.controls.userName;
  }

  get password(): AbstractControl {
    return this.form.controls.password;
  }

  get mobile(): AbstractControl {
    return this.form.controls.mobile;
  }

  get captcha(): AbstractControl {
    return this.form.controls.captcha;
  }

  form: UntypedFormGroup;
  error = '';
  public errorForPhoneLogin = '';

  type: LoginType = LoginType.USERNAME_AND_PASSWORD;

  // #region get captcha

  count = 0;
  interval$: any;

  // #endregion

  switch({index}: NzTabChangeEvent): void {
    this.type = index!;
  }

  /**
   * 获取验证码
   */
  getCaptcha(): void {
    if (this.mobile.invalid) {
      this.mobile.markAsDirty({onlySelf: true});
      this.mobile.updateValueAndValidity({onlySelf: true});
      return;
    }
    this.http
      .post('/sys/user/current/sendVerifyCode', {
        phone: this.mobile.value,
      }, null, {
        context: new HttpContext().set(ALLOW_ANONYMOUS, true)
      })
      .subscribe(() => {
        this.count = 59;
        this.interval$ = setInterval(() => {
          this.count -= 1;
          if (this.count <= 0) {
            clearInterval(this.interval$);
          }
        }, 1000);
      });
  }

  // #endregion

  submit(): void {
    if (this.type === LoginType.USERNAME_AND_PASSWORD) {
      this.userNameAndPasswordLogin();
    } else if (this.type === LoginType.PHONE_AND_VERIFY_CODE) {
      this.phoneAndVVerifyCodeLogin();
    } else {
      this.msg.error('未知的登录方式');
    }
  }

  /**
   * 执行手机号和验证码登录
   */
  phoneAndVVerifyCodeLogin(): void {
    this.errorForPhoneLogin = '';
    this.mobile.markAsDirty();
    this.mobile.updateValueAndValidity();
    this.captcha.markAsDirty();
    this.captcha.updateValueAndValidity();
    if (this.mobile.invalid || this.captcha.invalid) {
      return;
    }
    this.http
      .post('/sys/user/current/loginByPhone', {
        phone: this.mobile.value,
        verifyCode: this.captcha.value,
      })
      .subscribe({
        next: (data: any) => {
          this.loginSuccessHandle(data);
        },
        error: (body) => {
          this.errorForPhoneLogin = body.msg;
        },
      });
  }

  /**
   * 执行用户名和密码登录
   */
  userNameAndPasswordLogin(): void {
    this.error = '';
    this.userName.markAsDirty();
    this.userName.updateValueAndValidity();
    this.password.markAsDirty();
    this.password.updateValueAndValidity();
    if (this.userName.invalid || this.password.invalid) {
      return;
    }
    this.http
      .post('/sys/user/current/login', {
        userName: this.userName.value,
        password: this.password.value,
      })
      .subscribe({
        next: (data) => {
          this.loginSuccessHandle(data);
        },
        error: (body) => {
          this.error = body.msg;
        }
      });
  }

  loginSuccessHandle(data: any) {
    // 清空路由复用信息
    this.reuseTabService.clear();
    // 设置用户Token信息
    this.tokenService.set(data);
    // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
    this.startupSrv.load(true).subscribe(() => {
      let url = this.tokenService.referrer!.url || '/';
      if (url.includes('/passport')) {
        url = '/';
      }
      this.router.navigateByUrl(url);
    });
  }

  // #region social

  open(type: string, openType: SocialOpenType = 'href'): void {
    this.msg.info("待接入")
    return;
    let url = ``;
    let callback = ``;
    // tslint:disable-next-line: prefer-conditional-expression
    if (environment.production) {
      callback = `https://ng-alain.github.io/ng-alain/#/passport/callback/${type}`;
    } else {
      callback = `http://localhost:4200/#/passport/callback/${type}`;
    }
    switch (type) {
      case 'auth0':
        url = `//cipchk.auth0.com/login?client=8gcNydIDzGBYxzqV0Vm1CX_RXH-wsWo5&redirect_uri=${decodeURIComponent(callback)}`;
        break;
      case 'github':
        url = `//github.com/login/oauth/authorize?client_id=9d6baae4b04a23fcafa2&response_type=code&redirect_uri=${decodeURIComponent(
          callback,
        )}`;
        break;
      case 'weibo':
        url = `https://api.weibo.com/oauth2/authorize?client_id=1239507802&response_type=code&redirect_uri=${decodeURIComponent(callback)}`;
        break;
    }
    if (openType === 'window') {
      this.socialService
        .login(url, '/', {
          type: 'window',
        })
        .subscribe((res) => {
          if (res) {
            this.settingsService.setUser(res);
            this.router.navigateByUrl('/');
          }
        });
    } else {
      this.socialService.login(url, '/', {
        type: 'href',
      });
    }
  }

  // #endregion

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
