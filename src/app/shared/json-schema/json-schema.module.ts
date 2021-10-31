import { NgModule } from '@angular/core';
import { DelonFormModule, WidgetRegistry } from '@delon/form';
import { SharedModule } from '../shared.module';
import { UEditorModule } from 'ngx-ueditor';

import { UeditorWidgetComponent } from './widgets/ueditor/ueditor.widget';

export const SCHEMA_THIRDS_COMPONENTS = [UeditorWidgetComponent];

@NgModule({
  declarations: SCHEMA_THIRDS_COMPONENTS,
  imports: [SharedModule, DelonFormModule.forRoot(), UEditorModule],
  exports: [...SCHEMA_THIRDS_COMPONENTS, UEditorModule],
})
export class JsonSchemaModule {
  constructor(widgetRegistry: WidgetRegistry) {
    widgetRegistry.register(UeditorWidgetComponent.KEY, UeditorWidgetComponent);
    // widgetRegistry.register(UEditorWidget.KEY, UEditorWidget);
  }
}
