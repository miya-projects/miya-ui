import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema, SFUploadWidgetSchema, UploadWidget } from '@delon/form';
import { SFSelectWidgetSchema } from '@delon/form/src/widgets/select/schema';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
  selector: 'app-sys-notice-edit',
  templateUrl: './edit.component.html',
})
export class SysNoticeEditComponent implements OnInit {
  // 传过来的参数
  record: any;
  formData: any = null;
  schema: SFSchema = {
    properties: {
      id: { type: 'string', ui: { hidden: true } },
      title: { type: 'string', title: '标题', ui: { width: 1000 } },
      content: {
        type: 'string',
        title: '内容',
        ui: {
          width: 1000,
          widget: 'ueditor',
          config: {},
        },
      },
      userIds: {
        type: 'string',
        title: '通知用户',
        ui: {
          width: 1000,
          widget: 'select',
          mode: 'multiple',
          asyncData: () => this.http.post('/sys/dp/users'),
        } as SFSelectWidgetSchema,
      },
    },
    required: ['title', 'content', 'userIds'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 20, gutter: 4 },
    },
  };

  @ViewChild('sf') private readonly sf!: SFComponent;

  constructor(private modal: NzModalRef, private msgSrv: NzMessageService, public http: _HttpClient) {}

  ngOnInit(): void {
    if (this.record) {
      this.http.get(`/sys/user/detail${  this.record.id}`).subscribe((res) => {
        if (res.avatar) {
          res.avatar = [res.avatar];
        }
        // @ts-ignore
        let keys = Object.keys(this.schema.properties);
        let fd: any = {};
        keys.forEach((k) => {
          fd[k] = res[k];
        });
        this.formData = fd;
      });
    } else {
      this.formData = {};
    }
  }

  save(value: any): void {
    let url = '/sysNotice/sendNotices';
    this.http.post(url, value).subscribe((res) => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close(): void {
    this.modal.destroy();
  }
}
