import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData, STPage, STReq, STRes } from '@delon/abc/st';
import { STRowClassName } from '@delon/abc/st/st.interfaces';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import {SFComponent, SFDateWidgetSchema, SFSchema, SFSelectWidgetSchema} from '@delon/form';
import {debounceTime, map} from 'rxjs/operators';
import {DATE_RANGES} from '../../../shared/utils';
import {CACHE_ENABLE} from "../../../core/net/cache.interceptors";

@Component({
  selector: 'app-sys-down',
  templateUrl: './down.component.html',
})
export class SysDownComponent implements OnInit, AfterViewInit {
  url = `/sys/download`;
  searchSchema: SFSchema = {
    properties: {
      createdTime: {
        type: 'string',
        title: '时间',
        ui: {
          widget: 'date',
          format: 'yyyy-MM-dd',
          mode: 'range',
          ranges: {...DATE_RANGES.TODAY, ...DATE_RANGES.YESTERDAY, ...DATE_RANGES.DAYS7, ...DATE_RANGES.DAYS30},
        } as SFDateWidgetSchema,
      },
      user: {
        type: 'string',
        title: '操作人',
        ui: {
          widget: 'select',
          mode: 'multiple',
          asyncData: () => this.http.get('/sys/dp/users', null, CACHE_ENABLE),
        } as SFSelectWidgetSchema,
      }
    },
  };
  @ViewChild('st') private readonly st!: STComponent;
  @ViewChild('sf') private readonly sf!: SFComponent;
  columns: STColumn[] = [
    // widget: {type: 'text'}
    { title: '时间', index: 'createdTime', width: 130, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '操作人', index: 'user', width: 100, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '下载内容', index: 'name', width: 130},
    { title: '下载时间', index: 'downloadTime', width: 130, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '文件', index: 'fileName', width: 200 },
    { title: '其他信息', index: 'extra', width: 300, format: (item) => JSON.stringify(item.extra), render: 'extra' },
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
