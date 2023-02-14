import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Injector } from '@angular/core';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { App, MenuService, SettingsService, TitleService } from '@delon/theme';
import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';
import Menus from '../../routes/menu';
import { environment } from '@env/environment';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {PreferencesService} from "../preferences/preferences.service";

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable({
  providedIn: 'root',
})
export class StartupService implements Resolve<any>{
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: HttpClient,
    private preferencesService: PreferencesService,
    private injector: Injector,
  ) {
    // 如果icon放到cdn上，可以修改资源的位置
    // iconSrv.changeAssetsSource('');
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
    // 加载 动态iconfont
    if (environment.iconfont) {
      iconSrv.fetchFromIconfont({
        scriptUrl: environment.iconfont,
      });
    }
  }

  private viaHttp(resolve: any, reject: any): void {
    this.httpClient.get('/sys/user/current').subscribe({
      next: (res: any) => {
          //清除权限
          this.aclService.set([]);
          this.aclService.setFull(false);
          this.menuService.clear();

          const appData = res.systemMeta;
          const user: any = (res as any).user;
          user.avatar = user.avatar;
          user.email = '891841484@qq.com';
          this.settingService.setApp(appData as App);
          this.settingService.setData('unreadNoticeAmount', res.unreadNoticeAmount);
          this.settingService.setUser(user);
          if (user.superAdmin) {
            this.aclService.setFull(true);
          }

          // 节点拆分和平铺，用来控制父节点显隐
          let flatFun = (business: string): string[] => {
            let split: string[] = business.split(":");
            if (split.length === 1){
              return split;
            }
            split.pop();
            return flatFun(split.join(":")).concat([business]);
          }
          let businesses = user.business.map((i: string):string[] => flatFun(i)).reduce((acc: string[], business: string[]) => acc.concat(business), [])
          businesses = Array.from(new Set(businesses));
          this.aclService.attachAbility(businesses);
          this.menuService.add(Menus);
          this.titleService.suffix = appData.name;

          this.preferencesService.init(res.user.preferences?.front || "{}");
      },
      error: err => {
        resolve({});
      },
      complete: () => {
        resolve({});
      }
    });
  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.viaHttp(resolve, reject);
    });
  }

  /**
   * 路由前的准备数据
   * todo 加载时间太长可能有长时间白屏
   * @param route
   * @param state
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.load();
  }
}
