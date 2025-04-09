import { Component, OnInit } from '@angular/core';
import { SFSchema, SFUISchema } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
    selector: 'app-sys-role-edit',
    templateUrl: './edit.component.html',
    standalone: false
})
export class SysRoleEditComponent implements OnInit {
  schema: SFSchema = {
    properties: {
      name: { type: 'string', title: '名称' },
      description: { type: 'string', title: '角色描述' }
    },
    required: ['name']
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 16 }
    }
  };

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient
  ) {}

  ngOnInit(): void {}

  save(value: any): void {
    this.http.post(`/sys/role`, value).subscribe(res => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close(): void {
    this.modal.destroy();
  }
}
