import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {STColumn, STComponent} from '@delon/abc/st';
import {STRowClassName} from '@delon/abc/st/st.interfaces';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalComponent, NzModalService} from 'ng-zorro-antd/modal';
import {SFComponent, SFDateWidgetSchema, SFSchema} from '@delon/form';
import {debounceTime, map} from 'rxjs/operators';
import {DATE_RANGES} from '../../../shared/utils';

@Component({
  selector: 'app-sys-log',
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
        title: '业务数据ID',
      },
    },
  };
  @ViewChild('st') private readonly st!: STComponent;
  @ViewChild('sf') private readonly sf!: SFComponent;
  @ViewChild("detailModalComponent") private readonly detailModalComponent!: NzModalComponent;
  columns: STColumn[] = [
    { title: '时间', index: 'createdTime', width: 130, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '操作人', index: 'operatorName', width: 80, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '业务模块', index: 'business', width: 100, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '操作类型', index: 'operationType', width: 130, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '日志', index: 'content', width: 200 },
    { title: '其他信息', index: 'extra', width: 300, format: (item) => JSON.stringify(item.extra), render: 'extra' },
    { title: '业务数据ID', index: 'businessId', width: 150 },
  ];
  rowClassName: STRowClassName = () => 'st-row-text';
  logDetail: any = [];

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

  openDetail(extra: any) {
    this.logDetail = extra;
    this.detailModalComponent.open();
  }

  closeDetail(): boolean {
    this.detailModalComponent.close();
    return true;
  }
  colors = [
    'magenta','orange','lime','green','cyan','blue','geekblue','purple'
  ];
  color(key: any) {
    let k = key.substring(0, Math.min(3, key.length));
    let num = k.split('').reduce((p: any, c: string) => {
      return p + c.charCodeAt(0);
    }, 0);
    return this.colors[num % this.colors.length]
  }
}
