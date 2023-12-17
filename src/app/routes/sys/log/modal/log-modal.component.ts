import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {STColumn, STComponent} from '@delon/abc/st';
import {STRowClassName} from '@delon/abc/st/st.interfaces';
import {SFComponent, SFDateWidgetSchema, SFSchema} from "@delon/form";
import {DATE_RANGES} from "../../../../shared/utils";
import {debounceTime, map} from "rxjs/operators";

@Component({
  selector: 'app-sys-log-modal',
  templateUrl: './log-modal.component.html',
})
export class SysLogModalComponent implements OnInit, AfterViewInit {
  url = `/sys/log`;

  @Input() businessId: string = '';

  searchSchema: SFSchema = {
    properties: {
      createdTime: {
        type: 'string',
        title: '日期',
        ui: {
          widget: 'date',
          format: 'yyyy-MM-dd',
          mode: 'range',
          ranges: {...DATE_RANGES.TODAY, ...DATE_RANGES.YESTERDAY, ...DATE_RANGES.DAYS7, ...DATE_RANGES.DAYS30},
        } as SFDateWidgetSchema,
      },
      operatorName: {
        type: 'string',
        title: '操作人',
      },
      business: {
        type: 'string',
        title: '所属模块',
      },
    },
  };

  @ViewChild('sf') private readonly sf!: SFComponent;
  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    { title: '时间', index: 'createdTime', width: 130, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '操作人', index: 'operatorName', width: 100, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '业务模块', index: 'business', width: 130, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '操作类型', index: 'operationType', width: 130, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '日志', index: 'content', width: 200 },
    { title: '其他信息', index: 'extra', width: 200, render: 'extra' },
  ];
  rowClassName: STRowClassName = () => 'st-row-text';

  constructor() {}

  ngAfterViewInit(): void {
    this.sf.formValueChange.pipe(debounceTime(500), map(i => i.value))
      .subscribe((value) => this.st.reset({
        ...value,
        businessId: this.businessId
      }));
    this.sf.reset(true);
  }

  ngOnInit(): void {
  }

}
