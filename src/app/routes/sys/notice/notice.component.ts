import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { STColumn, STComponent, STData, STPage, STReq, STRes } from '@delon/abc/st';
import { STRowClassName } from '@delon/abc/st/st.interfaces';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { SysUserEditComponent } from '../user/edit/edit.component';
import { SysNoticeEditComponent } from './edit/edit.component';

@Component({
  selector: 'app-sys-notice',
  templateUrl: './notice.component.html',
})
export class SysNoticeComponent implements OnInit, AfterViewInit {
  url = `/sysNotice/list`;

  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    { title: '标题', index: 'title', width: 300 },
    { title: '内容', index: 'content', width: 300 },
    { title: '发布时间', index: 'createdTime', width: 600 },
    { title: '是否启用', index: 'enable', width: 600 },
  ];
  rowClassName: STRowClassName = () => 'st-row-text';

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private messageSrc: NzMessageService,
    private modalSrc: NzModalService,
  ) {}

  ngAfterViewInit(): void {
    this.reload();
  }

  ngOnInit(): void {}

  /**
   * 加载数据
   * @private
   */
  reload(): void {
    this.st.reload();
  }

  add(): void {
    this.modal.createStatic(SysNoticeEditComponent, {}, { size: 'xl' }).subscribe(() => this.st.reload());
  }
}
