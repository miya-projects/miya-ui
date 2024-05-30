import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Provider } from '@angular/core';
import { ActivatedRouteSnapshot, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN } from '@delon/auth';
import { App, MenuService, SettingsService, TitleService } from '@delon/theme';
import type { NzSafeAny } from 'ng-zorro-antd/core/types';
import { map, Observable, of } from 'rxjs';

import Menus from '../../routes/menu';
import { PreferencesService } from '../preferences/preferences.service';
import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';
import { environment } from '@env/environment';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
export function provideStartup(): Provider[] {
  return [
    StartupService
    // {
    //   provide: APP_INITIALIZER,
    //   useFactory: (startupService: StartupService) => () => startupService.load(),
    //   deps: [StartupService],
    //   multi: true
    // }
  ];
}

/**
 * 路由前的准备数据
 * todo 加载时间太长可能有长时间白屏
 * @param route
 * @param state
 */
export function appResolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<any> {
  return inject(StartupService).load();
}

@Injectable()
export class StartupService {
  private menuService = inject(MenuService);
  private settingService = inject(SettingsService);
  private tokenService = inject(DA_SERVICE_TOKEN);
  private aclService = inject(ACLService);
  private titleService = inject(TitleService);
  private httpClient = inject(HttpClient);
  private router = inject(Router);
  private preferencesService = inject(PreferencesService);

  constructor(iconSrv: NzIconService) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
    if (environment['iconfont']) {
      iconSrv.fetchFromIconfont({
        scriptUrl: environment['iconfont']
      });
    }
  }

  private handleAppData(res: NzSafeAny): void {
    // Application information: including site name, description, year
    this.settingService.setApp(res.app);
    // User information: including name, avatar, email address
    this.settingService.setUser(res.user);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Menu data, https://ng-alain.com/theme/menu
    this.menuService.add(res.menu ?? []);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = res.app?.name;
  }

  load(noCache: boolean = false): Observable<boolean> {
    let app = this.settingService.getApp();
    if (app && !noCache) {
      return of(true);
    }
    return this.httpClient.get('/sys/user/current').pipe(
      map((res: any) => {
        //清除权限
        this.aclService.set([]);
        this.aclService.setFull(false);
        this.menuService.clear();

        const appData = res.systemMeta;
        const user: any = (res as any).user;
        user.avatar = user?.avatar?.url;
        user.email = '891841484@qq.com';
        this.settingService.setApp(appData as App);
        this.settingService.setData('unreadNoticeAmount', res.unreadNoticeAmount);
        this.settingService.setUser(user);
        if (user.superAdmin) {
          this.aclService.setFull(true);
        }

        // 节点拆分和平铺，用来控制父节点显隐
        let flatFun = (business: string): string[] => {
          let split: string[] = business.split(':');
          if (split.length === 1) {
            return split;
          }
          split.pop();
          return flatFun(split.join(':')).concat([business]);
        };
        let businesses = user.business
          .map((i: string): string[] => flatFun(i))
          .reduce((acc: string[], business: string[]) => acc.concat(business), []);
        businesses = Array.from(new Set(businesses));
        this.aclService.attachAbility(businesses);
        this.menuService.add(Menus);
        this.titleService.suffix = appData.name;

        this.preferencesService.init(res.user.preferences?.front || '{}');
        return true;
      })
    );
  }
}
