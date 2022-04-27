import {Component, OnInit} from '@angular/core';
import { SettingsService, User } from '@delon/theme';
import { LayoutDefaultOptions } from '@delon/theme/layout-default';
import { environment } from '@env/environment';
import {Router} from "@angular/router";
import {StartupService} from "@core";

@Component({
  selector: 'layout-basic',
  template: `
    <layout-default [options]="options" [asideUser]="asideUserTpl" [content]="contentTpl" [nav]="navTpl">
      <layout-default-header-item direction="left" hidden="pc">
        <div layout-default-header-item-trigger (click)="searchToggleStatus = !searchToggleStatus">
          <i nz-icon nzType="search"></i>
        </div>
      </layout-default-header-item>
      <layout-default-header-item direction="middle">
        <header-search class="alain-default__search" [toggleChange]="searchToggleStatus"></header-search>
      </layout-default-header-item>
      <layout-default-header-item direction="right" hidden="mobile">
        <div layout-default-header-item-trigger nz-dropdown [nzDropdownMenu]="settingsMenu" nzTrigger="click" nzPlacement="bottomRight">
          <i nz-icon nzType="setting"></i>
        </div>
        <nz-dropdown-menu #settingsMenu="nzDropdownMenu">
          <div nz-menu style="width: 200px;">
            <div nz-menu-item>
              <header-fullscreen></header-fullscreen>
            </div>
            <div nz-menu-item>
              <header-clear-storage></header-clear-storage>
            </div>
          </div>
        </nz-dropdown-menu>
      </layout-default-header-item>

      <layout-default-header-item direction="right" hidden="mobile">
        <div layout-default-header-item-trigger (click)="toDown()" title="下载中心">
          <i nz-icon nzType="download" nzTheme="outline"></i>
        </div>
      </layout-default-header-item>

      <layout-default-header-item direction="right">
        <header-notify></header-notify>
      </layout-default-header-item>
      <layout-default-header-item direction="right">
        <header-user></header-user>
      </layout-default-header-item>
      <!--        左边-->
      <ng-template #asideUserTpl>
        <div nz-dropdown nzTrigger="click" [nzDropdownMenu]="userMenu" class="alain-default__aside-user">
          <nz-avatar class="alain-default__aside-user-avatar" [nzSrc]="user.avatar"></nz-avatar>
          <div class="alain-default__aside-user-info">
            <strong>{{ user.name }}</strong>
            <p class="mb0">{{ user.email }}</p>
          </div>
        </div>
        <nz-dropdown-menu #userMenu="nzDropdownMenu">
          <ul nz-menu>
            <li nz-menu-item routerLink="/pro/account/center">个人中心</li>
            <li nz-menu-item routerLink="/sys/user-settings">个人设置</li>
          </ul>
        </nz-dropdown-menu>
      </ng-template>
      <ng-template #navTpl>
        <layout-default-nav class="d-block py-lg" [openStrictly]="openStrictly" [maxLevelIcon]="4"></layout-default-nav>
      </ng-template>
      <ng-template #contentTpl>
        <router-outlet></router-outlet>

        <global-footer style="position: absolute;bottom: 0px;left: 50%;">
<!--          <global-footer-item href="https://ng-alain.com/" blankTarget>帮助</global-footer-item>-->
<!--          <global-footer-item href="https://github.com/ng-alain" blankTarget>-->
<!--            <i nz-icon nzType="github"></i>-->
<!--          </global-footer-item>-->
<!--          <global-footer-item href="https://ng-alain.surge.sh/" blankTarget>预览</global-footer-item>-->
          Copyright<i nz-icon nzType="copyright" class="mx-sm"></i>2021 版本:<a href="javascript:void()" class="mx-sm">{{version}}</a>
        </global-footer>

      </ng-template>
    </layout-default>

    <setting-drawer *ngIf="showSettingDrawer"></setting-drawer>
    <theme-btn></theme-btn>
  `,
})
export class LayoutBasicComponent implements OnInit{
  options: LayoutDefaultOptions = {
    logoExpanded: `./assets/logo-full.svg`,
    logoCollapsed: `./assets/logo.svg`,
  };
  // 改为true后不自动跟随url自动展开菜单
  openStrictly = false;
  searchToggleStatus = false;
  showSettingDrawer = !environment.production;
  get user(): User {
    return this.settings.user;
  }

  get version(): string{
    return this.settings.app.version;
  }

  constructor(private settings: SettingsService, private router: Router,
              private startupService: StartupService) {}

  toDown(){
    this.router.navigateByUrl('/sys/down');
  }

  ngOnInit(): void {
    this.startupService.load();
  }

}
