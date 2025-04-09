import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { DictEditComponent } from './edit/edit.component';

@Component({
    selector: 'app-sys-dict',
    templateUrl: './dict.component.html',
    standalone: false
})
export class SysDictComponent implements OnInit {
  dicts: any;

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private messageSrc: NzMessageService,
    private modalSrv: NzModalService
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  /**
   * 加载数据
   *
   * @private
   */
  reload(): void {
    this.http.get('/sys/dict', { page: 0, size: 200 }).subscribe(list => {
      this.dicts = list.rows;
    });
  }

  /**
   * 新建字典
   */
  add(): void {
    this.modal.createStatic(DictEditComponent).subscribe(this.reload.bind(this));
  }

  /**
   * 删除字典及字典数据
   *
   * @param id
   */
  deleteDict(id: string): void {
    this.modalSrv.confirm({
      nzTitle: '提示',
      nzContent: '是否要删除?',
      nzOnOk: () => {
        this.http.delete(`/sys/dict/${id}`).subscribe(() => {
          this.messageSrc.success('删除成功');
          this.reload();
        });
      }
    });
  }
}
