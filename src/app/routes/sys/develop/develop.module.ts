import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { DevelopRoutingModule } from './develop-routing.module';
import { SystemEnumComponent, SystemEnumDataComponent } from './system-enum/system-enum.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

const COMPONENTS: Type<void>[] = [SystemEnumComponent, SystemEnumDataComponent];

@NgModule({
  imports: [SharedModule, DevelopRoutingModule, NzEmptyModule],
  declarations: COMPONENTS
})
export class DevelopModule {}
