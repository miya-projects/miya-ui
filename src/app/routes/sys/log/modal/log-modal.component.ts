import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {STColumn, STComponent} from '@delon/abc/st';
import {STRowClassName} from '@delon/abc/st/st.interfaces';

@Component({
  selector: 'app-sys-log-modal',
  templateUrl: './log-modal.component.html',
})
export class SysLogModalComponent implements OnInit, AfterViewInit {
  url = `/sys/log`;

  @Input() businessId: string = '';

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
    this.st.reset({
      businessId: this.businessId
    });
  }

  ngOnInit(): void {
  }

}
