import {inject, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {MenuService} from "@delon/theme";
import {StartupService} from "@core";
import {map} from "rxjs/operators";
import {ACLService} from "@delon/acl";

/**
 * 进行路由的权限校验，未配置到menu或者未配置acl的路由不进行校验，所以该守卫可全局使用
 */

export const aclCanActivate: CanActivateFn = ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const startupSrv = inject(StartupService)
  const aclSrv = inject(ACLService);
  const router = inject(Router);
  const menuSrv = inject(MenuService);

  return startupSrv.load().pipe(map(() => {
    let menu = menuSrv.find({url: state.url, recursive: true})
    if (menu && menu.acl) {
      // 如果跳转路由是一个菜单，且配置了acl，需要进行acl校验
      if (!aclSrv.can(menu.acl)) {
        return router.createUrlTree(['/exception/403'])
      }
    }
    return true;
  }))
}
