import {ErrorHandler, InjectionToken, NgModule, Optional, SkipSelf} from '@angular/core';
import {CrudService} from './crud/crud.service';
import { throwIfAlreadyLoaded } from './module-import-guard';
import {CustomErrorHandler} from "./custom-error-handler";

@NgModule({
  providers: [
    { provide: InjectionToken, useClass: CrudService, multi: true },
    { provide: ErrorHandler, useClass: CustomErrorHandler },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
