import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import {  SettingsService, User } from '@delon/theme';
import { LayoutDefaultModule, LayoutDefaultOptions } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnComponent } from '@delon/theme/theme-btn';
import { environment } from '@env/environment';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

import { HeaderFullScreenComponent } from './widgets/fullscreen.component';
import { HeaderSearchComponent } from './widgets/search.component';
import { HeaderUserComponent } from './widgets/user.component';

@Component({
  selector: 'layout-basic',
  template: `
    <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [customError]="null">
      <!--<layout-default-header-item direction="left">-->
      <!--  <a layout-default-header-item-trigger href="//github.com/ng-alain/ng-alain" target="_blank">-->
      <!--    <i nz-icon nzType="github"></i>-->
      <!--  </a>-->
      <!--</layout-default-header-item>-->
      <!--<layout-default-header-item direction="left" hidden="mobile">-->
      <!--  <a layout-default-header-item-trigger routerLink="/passport/lock">-->
      <!--    <i nz-icon nzType="lock"></i>-->
      <!--  </a>-->
      <!--</layout-default-header-item>-->
      <layout-default-header-item direction="left" hidden="pc">
        <div layout-default-header-item-trigger (click)="searchToggleStatus = !searchToggleStatus">
          <i nz-icon nzType="search"></i>
        </div>
      </layout-default-header-item>
      <layout-default-header-item direction="middle">
        <header-search class="alain-default__search" [toggleChange]="searchToggleStatus"/>
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile" style="display: flex;">
        <div layout-default-header-item-trigger (click)="toDown()" title="下载中心">
          <i nz-icon nzType="download" nzTheme="outline"></i>
        </div>
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <div layout-default-header-item-trigger nz-dropdown [nzDropdownMenu]="settingsMenu" nzTrigger="click"
             nzPlacement="bottomRight">
          <i nz-icon nzType="setting"></i>
        </div>
        <nz-dropdown-menu #settingsMenu="nzDropdownMenu">
          <div nz-menu style="width: 200px;">
            <div nz-menu-item>
              <header-fullscreen/>
            </div>
            <!--<div nz-menu-item>-->
            <!--  <header-clear-storage />-->
            <!--</div>-->
          </div>
        </nz-dropdown-menu>
      </layout-default-header-item>
      <layout-default-header-item direction="right">
        <header-user/>
      </layout-default-header-item>
      <ng-template #asideUserTpl>
        <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="userMenu" class="alain-default__aside-user">
          <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar"/>
          <div class="alain-default__aside-user-info">
            <strong>{{ user.name }}</strong>
            <p class="mb0">{{ user.email }}</p>
          </div>
        </div>
        <nz-dropdown-menu #userMenu="nzDropdownMenu">
          <ul nz-menu>
            <!--<li nz-menu-item routerLink="/pro/account/center">个人中心</li>-->
            <li nz-menu-item routerLink="/sys/user-settings">个人设置</li>
          </ul>
        </nz-dropdown-menu>
      </ng-template>
      <ng-template #contentTpl>
        <router-outlet/>
      </ng-template>
    </layout-default>
    @if (showSettingDrawer) {
      <setting-drawer/>
    }
    <theme-btn/>
  `,
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    LayoutDefaultModule,
    SettingDrawerModule,
    ThemeBtnComponent,
    NzIconModule,
    NzMenuModule,
    NzDropDownModule,
    NzAvatarModule,
    HeaderSearchComponent,
    HeaderFullScreenComponent,
    HeaderUserComponent
  ]
})
export class LayoutBasicComponent implements OnInit {
  private readonly settings = inject(SettingsService);
  private router: Router = inject(Router);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  options: LayoutDefaultOptions = {
    logoExpanded: `./assets/logo-full.svg`,
    logoCollapsed: `./assets/logo.svg`
  };
  searchToggleStatus = false;
  showSettingDrawer = !environment.production && false;
  get user(): User {
    return this.settings.user;
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ startup }) => {

    });
  }

  toDown() {
    this.router.navigateByUrl('/sys/down');
  }
}
