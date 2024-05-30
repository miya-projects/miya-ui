import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CustomColComponent } from './custom-col/customcol.component';
import { PasswordComponent } from './password/password.component';
import { TreeRowDirective } from './treetable/tree-row.directive';
import { TreetableComponent } from './treetable/treetable.component';
import { NzDividerModule } from 'ng-zorro-antd/divider';

export const COMPONENTS = [PasswordComponent, TreetableComponent, TreeRowDirective, CustomColComponent];

@NgModule({
  declarations: COMPONENTS,
  imports: [
    NzInputModule,
    FormsModule,
    NzIconModule,
    NzTableModule,
    CommonModule,
    NzButtonModule,
    NzModalModule,
    NzCheckboxModule,
    NzDividerModule
  ],
  exports: [...COMPONENTS]
})
export class ComModule {
  constructor() {}
}
