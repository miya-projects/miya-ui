import { Component, OnInit, ViewChild } from '@angular/core';
import { SFComponent, SFSchema, SFUISchema } from '@delon/form';
import { SFSelectWidgetSchema } from '@delon/form/src/widgets/select/schema';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { map } from 'rxjs/operators';
import { CACHE_ENABLE } from '../../../../core/net/cache.interceptors';
import { browseTree } from '../../../../shared/utils';
import { SFUploadWidgetSchema } from '@delon/form/widgets/upload';
import { SFTreeSelectWidgetSchema } from '@delon/form/widgets/tree-select/schema';
import { NzUploadFile } from 'ng-zorro-antd/upload';

@Component({
    selector: 'app-sys-user-edit',
    templateUrl: './edit.component.html',
    standalone: false
})
export class SysUserEditComponent implements OnInit {
  // 传过来的参数
  record: any;
  formData: any = null;
  schema: SFSchema = {
    properties: {
      username: { type: 'string', title: '登录名' },
      name: { type: 'string', title: '姓名', maxLength: 15 },
      phone: { type: 'string', title: '手机号', format: 'mobile' },
      sex: { type: 'string', title: '性别' },
      avatar: { type: 'string', title: '头像' },
      remark: { type: 'string', title: '备注', maxLength: 150 },
      roles: { type: 'string', title: '角色' },
      departments: { type: 'string', title: '部门' }
    },
    required: ['username', 'name', 'phone']
  };
  ui: SFUISchema = {
    $sex: {
      widget: 'api-select',
      enumKey: 'SysUser.Sex'
      // asyncData: () => this.http.get('/sys/dp/enums', {key: 'SysUser.Sex'}, CACHE_ENABLE)
    } as SFSelectWidgetSchema,
    $avatar: {
      widget: 'api-upload',
      limitFileCount: 1
    } as SFUploadWidgetSchema,
    $roles: {
      widget: 'api-select',
      mode: 'multiple',
      grid: { span: 18 },
      asyncData: () => this.http.get('/sys/dp/role', null, CACHE_ENABLE)
    } as SFSelectWidgetSchema,
    $departments: {
      widget: 'api-tree-select',
      multiple: true,
      showSearch: true,
      grid: { span: 18 },
      asyncData: () =>
        this.http.get('/sys/department?noPage', null, CACHE_ENABLE).pipe(
          map((items: any) => {
            browseTree(items, (item: any) => {
              item.title = item.name;
              item.key = item.id;
              item.expanded = true;
              item.isLeaf = item.children.length === 0;
              item.icon = item.isLeaf ? 'file' : item.expanded ? 'folder-open' : 'folder';
            });
            return items;
          })
        )
    } as unknown as SFTreeSelectWidgetSchema,
    '*': {
      spanLabelFixed: 100,
      grid: { span: 9, gutter: 16 + 10 * 8 }
    }
  };

  @ViewChild('sf') private readonly sf!: SFComponent;
  nzFileList: NzUploadFile[] = [];

  constructor(
    private modal: NzModalRef,
    private msgSrv: NzMessageService,
    public http: _HttpClient
  ) {}

  ngOnInit(): void {
    if (this.record) {
      this.http.get(`/sys/user/${this.record.id}`).subscribe(res => {
        this.formData = res;
      });
    } else {
      this.formData = {};
    }
  }

  save(value: any): void {
    let url = '/sys/user';
    let method = 'post';
    if (this.record) {
      url = `/sys/user/${this.record.id}`;
      method = 'put';
    }
    this.http.request(method, url, { body: value }).subscribe(() => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close(): void {
    this.modal.destroy();
  }
}
