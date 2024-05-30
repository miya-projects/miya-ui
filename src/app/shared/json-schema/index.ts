import type { SFWidgetProvideConfig } from '@delon/form';
// import { withCascaderWidget } from '@delon/form/widgets/cascader';

import { TestWidget } from './test/test.widget';
import { withUploadWidget } from '@delon/form/widgets/upload';
import { ApiSelectWidget } from '../st-widget/api-select/apiselect.widget';
import { ApiTreeSelectWidget } from '../st-widget/api-tree-select/api-treeselect-widget.component';
import { ApiuploadWidget } from '../st-widget/api-upload/apiupload.widget';

export const SF_WIDGETS: SFWidgetProvideConfig[] = [
  { KEY: TestWidget.KEY, type: TestWidget },
  { KEY: 'api-upload', type: ApiuploadWidget },
  { KEY: ApiSelectWidget.KEY, type: ApiSelectWidget },
  { KEY: ApiTreeSelectWidget.KEY1, type: ApiTreeSelectWidget },

  // Non-built-in widget registration method
  // withCascaderWidget()
  withUploadWidget()
];
