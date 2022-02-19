import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SysDepartmentComponent} from './department/department.component';
import {SysDictComponent} from './dict/dict.component';
import {SysLogComponent} from './log/log.component';
import {SysNoticeComponent} from './notice/notice.component';
import {SysRoleComponent} from './role/role.component';
import {SysUserComponent} from './user/user.component';
import {SysConfigComponent} from './config/config.component';
import {BasicSettingsComponent} from './usersettings/basic/basic.component';
import {SecuritySettingsComponent} from './usersettings/security/security.component';
import {UserSettingsComponent} from './usersettings/usersettings.component';
import {SysDownComponent} from "./down/down.component";

const routes: Routes = [
  // 离开路由监听 canDeactivate: [CanLeaveProvide]
  {path: 'dict', component: SysDictComponent},
  {path: 'user', component: SysUserComponent},
  {path: 'role', component: SysRoleComponent},
  {path: 'department', component: SysDepartmentComponent},
  {path: 'config', component: SysConfigComponent},
  {path: 'notice', component: SysNoticeComponent},
  {path: 'log', component: SysLogComponent},
  {path: 'down', component: SysDownComponent},
  {
    path: 'user-settings', component: UserSettingsComponent,
    children: [
      {path: '', redirectTo: 'basic', pathMatch: 'full'},
      {path: 'basic', component: BasicSettingsComponent, data: {title: '基本信息'}},
      {path: 'security', component: SecuritySettingsComponent, data: {title: '修改密码'}},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SysRoutingModule {
}
