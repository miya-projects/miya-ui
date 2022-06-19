import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import {NzEmptyModule} from 'ng-zorro-antd/empty';
import {NzTreeModule} from 'ng-zorro-antd/tree';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import {ComModule} from '../../shared/com/com.module';
import { CanLeaveProvide } from './can-leave.provide';
import {SysDictDataComponent} from './dict/data/dictdata.component';
import { SysDictComponent } from './dict/dict.component';
import { DictEditComponent } from './dict/edit/edit.component';
import { SysLogComponent } from './log/log.component';
import { SysNoticeEditComponent } from './notice/edit/edit.component';
import { SysNoticeComponent } from './notice/notice.component';
import { SysRoleEditComponent } from './role/edit/edit.component';
import {SysRolePermissionComponent} from './role/permission/permission.component';
import { SysRoleComponent } from './role/role.component';

import { SysRoutingModule } from './sys-routing.module';
import { SysUserComponent } from './user/user.component';
import { SysUserEditComponent } from './user/edit/edit.component';
import { SysUserViewComponent } from './user/view/view.component';
import { SysConfigComponent } from './config/config.component';
import {BasicSettingsComponent} from './usersettings/basic/basic.component';
import {SecuritySettingsComponent} from './usersettings/security/security.component';
import {UserSettingsComponent} from './usersettings/usersettings.component';
import { SysDepartmentSelectComponent } from './department/select/select.component';
import { SysDepartmentComponent } from './department/department.component';
import {SysDownComponent} from "./down/down.component";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {SysLogModalComponent} from "./log/modal/log-modal.component";

const COMPONENTS: Array<Type<void>> = [
  SysDictComponent,
  SysDictDataComponent,
  DictEditComponent,

  SysUserComponent,
  SysUserEditComponent,
  SysUserViewComponent,

  SysConfigComponent,

  SysRoleComponent,
  SysRolePermissionComponent,
  SysRoleEditComponent,

  SysNoticeComponent,
  SysNoticeEditComponent,

  SysLogComponent,
  SysLogModalComponent,

  SysDownComponent,

  UserSettingsComponent,
  BasicSettingsComponent,
  SecuritySettingsComponent,
  SysDepartmentSelectComponent,
  SysDepartmentComponent];

@NgModule({
  imports: [SharedModule, SysRoutingModule, NzTreeModule, NzEmptyModule, NzUploadModule, ComModule, NzBreadCrumbModule],
  declarations: COMPONENTS,
  providers: [CanLeaveProvide],
})
export class SysModule {}
