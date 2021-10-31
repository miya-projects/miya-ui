import {InjectionToken, NgModule, Optional, SkipSelf} from '@angular/core';
import {CrudService} from './crud/crud.service';
import { throwIfAlreadyLoaded } from './module-import-guard';

@NgModule({
  providers: [
    { provide: InjectionToken, useClass: CrudService, multi: true },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
