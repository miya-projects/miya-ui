import { Component, Inject, OnInit } from '@angular/core';
import {ALLOW_ANONYMOUS, DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {_HttpClient, SettingsService} from "@delon/theme";
import {HttpClient, HttpContext} from "@angular/common/http";
import {ORIGIN_BODY} from "../../core/net/token";

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
})
export class LayoutPassportComponent implements OnInit {
  links = [
    {
      title: '帮助',
      href: '',
    },
    {
      title: '隐私',
      href: '',
    },
    {
      title: '条款',
      href: '',
    },
  ];

  backgroundUrl: string = '';

  constructor(@Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
              private http: _HttpClient,
              private settingService: SettingsService) {}

  ngOnInit(): void {
    // this.tokenService.clear();
    this.acquireBackgroundUrl(true);
  }

  /**
   * 获取背景壁纸
   */
  acquireBackgroundUrl(useCache: boolean) {
    if (useCache){
      let backgroundUrl = this.settingService.getData("backgroundUrl")
      if (backgroundUrl != null) {
        this.backgroundUrl = backgroundUrl;
        return;
      }
    }
    let url = 'https://api.unsplash.com/photos/random/?client_id=MTCILkbkmeSSYZi7vhpNqCCz-yvxyrh4HFZ-DTIh83Y&orientation=landscape&count=1&query=cat'
    this.http.get(url, null, {
      context: new HttpContext().set(ALLOW_ANONYMOUS, true).set(ORIGIN_BODY, true)
    }).subscribe(res => {
      this.backgroundUrl = res[0].urls.regular;
      this.settingService.setData("backgroundUrl", this.backgroundUrl);
    })
  }
}
