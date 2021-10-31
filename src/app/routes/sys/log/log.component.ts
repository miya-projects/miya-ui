import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData, STPage, STReq, STRes } from '@delon/abc/st';
import { STRowClassName } from '@delon/abc/st/st.interfaces';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {SFComponent, SFDateWidgetSchema, SFSchema, SFSelectWidgetSchema} from '@delon/form';
import {debounceTime, map} from 'rxjs/operators';
import {DATE_RANGES} from '../../../shared/utils';

@Component({
  selector: 'app-sys-notice',
  templateUrl: './log.component.html',
})
export class SysLogComponent implements OnInit, AfterViewInit {
  url = `/sys/log`;
  searchSchema: SFSchema = {
    properties: {
      createdTime: {
        type: 'string',
        title: '创建日期',
        ui: {
          widget: 'date',
          format: 'yyyy-MM-dd',
          mode: 'range',
          ranges: {...DATE_RANGES.TODAY, ...DATE_RANGES.YESTERDAY, ...DATE_RANGES.DAYS7, ...DATE_RANGES.DAYS30},
        } as SFDateWidgetSchema,
      },
      content: {
        type: 'string',
        title: '日志内容',
      },
      operatorName: {
        type: 'string',
        title: '操作人',
      },
      business: {
        type: 'string',
        title: '所属模块',
      },
      businessId: {
        type: 'string',
        title: '业务数据id',
      },
    },
  };
  @ViewChild('st') private readonly st!: STComponent;
  @ViewChild('sf') private readonly sf!: SFComponent;
  columns: STColumn[] = [
    // widget: {type: 'text'}
    { title: '时间', index: 'createdTime', width: 130, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '操作人', index: 'operatorName', width: 100, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '业务模块', index: 'business', width: 130, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '操作类型', index: 'operationType', width: 130, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '日志', index: 'content', width: 200 },
    { title: '其他信息', index: 'extra', width: 300, format: (item) => JSON.stringify(item.extra), render: 'extra' },
    { title: '业务数据id', index: 'businessId', width: 150 },
  ];
  rowClassName: STRowClassName = () => 'st-row-text';

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private messageSrc: NzMessageService,
    private modalSrc: NzModalService,
  ) {}

  ngAfterViewInit(): void {
    this.sf.formValueChange.pipe(debounceTime(500), map(i => i.value)).subscribe((value) => this.st.reset(value));
    this.sf.reset(true);
  }

  ngOnInit(): void {
  }

}
