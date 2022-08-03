import {Component, OnInit, ViewChild} from '@angular/core';
import {
  SFComponent,
  SFSchema,
  SFTreeSelectWidgetSchema,
  SFUISchema,
  SFUploadWidgetSchema,
} from '@delon/form';
import {SFSelectWidgetSchema} from '@delon/form/src/widgets/select/schema';
import {_HttpClient} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef} from 'ng-zorro-antd/modal';
import {map} from 'rxjs/operators';
import {CrudService} from '../../../../core/crud/crud.service';
import {CACHE_ENABLE} from '../../../../core/net/cache.interceptors';
import {browseTree} from '../../../../shared/utils';

@Component({
  selector: 'app-sys-user-edit',
  templateUrl: './edit.component.html',
})
export class SysUserEditComponent implements OnInit {
  // 传过来的参数
  record: any;
  formData: any = null;
  schema: SFSchema = {
    properties: {
      username: {type: 'string', title: '登录名'},
      name: {type: 'string', title: '姓名', maxLength: 15},
      phone: {type: 'string', title: '手机号', format: 'mobile'},
      sex: {type: 'string', title: '性别'},
      avatar: {type: 'string', title: '头像'},
      remark: {type: 'string', title: '备注', maxLength: 150},
      roles: {type: 'string', title: '角色'},
      departments: {type: 'string', title: '部门'},
    },
    required: ['username', 'name', 'phone'],
  };
  ui: SFUISchema = {
    $sex: {
      widget: 'api-select',
      enumKey: 'SysUser.Sex',
    } as SFSelectWidgetSchema,
    $avatar: {
      widget: 'api-upload',
      limitFileCount: 1,
    } as SFUploadWidgetSchema,
    $roles: {
      widget: 'api-select',
      mode: 'multiple',
      grid: {span: 24},
      width: 876,
      asyncData: () => this.http.get('/sys/dp/role', null, CACHE_ENABLE),
    } as SFSelectWidgetSchema,
    $departments: {
      widget: 'api-tree-select',
      multiple: true,
      showSearch: true,
      grid: {span: 24},
      width: 876,
      asyncData: () => this.http.get('/sys/department?noPage', null, CACHE_ENABLE).pipe(map((items: any) => {
        browseTree(items, (item: any) => {
          item.title = item.name;
          item.key = item.id;
          item.expanded = true;
          item.isLeaf = item.children.length === 0;
          item.icon = item.isLeaf ? 'file' : item.expanded ? 'folder-open' : 'folder';
        });
        return items;
      })),
    } as unknown as SFTreeSelectWidgetSchema,
    // departments
    '*': {
      width: 300,
      spanLabelFixed: 100,
      grid: {span: 12},
    },
  };

  @ViewChild('sf') private readonly sf!: SFComponent;

  constructor(private modal: NzModalRef,
              private msgSrv: NzMessageService, public http: _HttpClient, public crudSrv: CrudService) {
  }

  ngOnInit(): void {
    if (this.record) {
      this.http.get(`/sys/user/${this.record.id}`).subscribe((res) => {
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
      url = `/sys/user/${  this.record.id}`;
      method = 'put';
    }
    this.http.request(method, url, {body: value}).subscribe((res) => {
      this.msgSrv.success('保存成功');
      this.modal.close(true);
    });
  }

  close(): void {
    this.modal.destroy();
  }
}
