import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {MenuService} from "@delon/theme";
import {StartupService} from "@core";
import {map} from "rxjs/operators";
import {ACLService} from "@delon/acl";

/**
 * 进行路由的权限校验，未配置到menu或者未配置acl的路由不进行校验，所以该守卫可全局使用
 */
@Injectable({
  providedIn: 'root'
})
export class AclGuard implements CanActivate {

  constructor(
    private menuSrv: MenuService,
    private startupSrv: StartupService,
    private aclSrv: ACLService,
    private router: Router
  ) {
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.startupSrv.load().pipe(map(() => {
      let menu = this.menuSrv.find({url: state.url, recursive: true})
      if (menu && menu.acl) {
        // 如果跳转路由是一个菜单，且配置了acl，需要进行acl校验
        if (!this.aclSrv.can(menu.acl)) {
          return this.router.createUrlTree(['/exception/403'])
        }
      }
      return true;
    }))
  }
}
