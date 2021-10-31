import { NgModule } from '@angular/core';
import { STWidgetRegistry } from '@delon/abc/st';
import { WidgetRegistry } from '@delon/form';
// import { STWidgetRegistry } from '@delon/abc/st';
import { SharedModule } from '@shared';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {NzTreeSelectModule} from 'ng-zorro-antd/tree-select';
import {NzUploadModule} from 'ng-zorro-antd/upload';
import { ApiSelectWidget } from './api-select/apiselect.widget';
import {ApiTreeSelectWidget} from './api-tree-select/api-treeselect-widget.component';
import {ApiuploadWidget} from './api-upload/apiupload.widget';
export const STWIDGET_COMPONENTS = [ApiSelectWidget, ApiuploadWidget, ApiTreeSelectWidget];

@NgModule({
  declarations: STWIDGET_COMPONENTS,
  imports: [SharedModule, NzSelectModule, NzUploadModule, NzTreeSelectModule],
  exports: [...STWIDGET_COMPONENTS],
})
export class STWidgetModule {
  constructor(widgetRegistry: WidgetRegistry) {
    // widgetRegistry.register(STImgWidget.KEY, STImgWidget);
    widgetRegistry.register(ApiSelectWidget.KEY, ApiSelectWidget);
    widgetRegistry.register(ApiTreeSelectWidget.KEY, ApiTreeSelectWidget);
    widgetRegistry.register(ApiuploadWidget.KEY, ApiuploadWidget);
  }
}
