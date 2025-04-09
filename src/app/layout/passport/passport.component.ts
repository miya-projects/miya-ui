import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { ALLOW_ANONYMOUS, DA_SERVICE_TOKEN } from '@delon/auth';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { _HttpClient, SettingsService } from '@delon/theme';
import { HttpContext } from '@angular/common/http';
import { ORIGIN_BODY } from '../../core/net/token';
import { NzButtonComponent } from 'ng-zorro-antd/button';

@Component({
  selector: 'layout-passport',
  template: `
    <div class="container" [style.background-image]="'url(' + backgroundUrl + ')'">
      <div class="login-div">
        <div class="wrap">
          <div class="top">
            <div class="head">
              <img class="logo" src="./assets/logo-color.svg"/>
              <span class="title">米娅</span>
            </div>
            <div class="desc">生活是一直这么艰辛，还是只有童年如此？——总是如此</div>
          </div>
          <router-outlet/>
          <global-footer [links]="links">
            Copyright
            <i class="anticon anticon-copyright"></i> 2021 <a href="//github.com/rxxy" target="_blank">Rxxy</a>
            <a nz-button nzType="link" (click)="acquireBackgroundUrl(false)">更换壁纸</a>
          </global-footer>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./passport.component.less'],
  standalone: true,
  imports: [RouterOutlet, GlobalFooterModule, NzIconModule, NzButtonComponent]
})
export class LayoutPassportComponent implements OnInit {
  private tokenService = inject(DA_SERVICE_TOKEN);
  private http: _HttpClient = inject(_HttpClient);
  private settingService: SettingsService = inject(SettingsService);

  links = [
    {
      title: '帮助',
      href: ''
    },
    {
      title: '隐私',
      href: ''
    },
    {
      title: '条款',
      href: ''
    }
  ];

  backgroundUrl: string = '';

  ngOnInit(): void {
    // this.tokenService.clear();
    this.acquireBackgroundUrl(true);
  }

  /**
   * 获取背景壁纸
   */
  acquireBackgroundUrl(useCache: boolean) {
    if (useCache) {
      let backgroundUrl = this.settingService.getData('backgroundUrl');
      if (backgroundUrl != null) {
        this.backgroundUrl = backgroundUrl;
        return;
      }
    }
    let url =
      'https://api.unsplash.com/photos/random/?client_id=MTCILkbkmeSSYZi7vhpNqCCz-yvxyrh4HFZ-DTIh83Y&orientation=landscape&count=1&query=cat';
    this.http
      .get(url, null, {
        context: new HttpContext().set(ALLOW_ANONYMOUS, true).set(ORIGIN_BODY, true)
      })
      .subscribe(res => {
        this.backgroundUrl = res[0].urls.full;
        this.settingService.setData('backgroundUrl', this.backgroundUrl);
      });
  }
}
