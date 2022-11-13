import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {STColumn, STComponent, STData, STRes} from '@delon/abc/st';
import {CacheService} from '@delon/cache';
import {SFComponent, SFSchema, SFSelectWidgetSchema} from '@delon/form';
import {ModalHelper, _HttpClient} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {debounceTime, map} from 'rxjs/operators';
import {CACHE_ENABLE} from '../../../core/net/cache.interceptors';
import {SysDepartmentSelectComponent} from '../department/select/select.component';
import {SysUserEditComponent} from './edit/edit.component';
import {SysLogModalComponent} from "../log/modal/log-modal.component";
import {download} from "../../../shared/utils";

@Component({
  selector: 'app-sys-user',
  templateUrl: './user.component.html'
})
export class SysUserComponent implements OnInit, AfterViewInit {

  searchSchema: SFSchema = {
    properties: {
      name: {type: 'string', title: '姓名',},
      username: {type: 'string', title: '登陆名',},
      phone: {type: 'string', title: '手机',},
      accountStatus: {
        type: 'string', title: '账户状态', default: ['NORMAL'],
        ui: {
          widget: 'api-select',
          mode: 'multiple',
          enumKey: 'SysUser.AccountStatus',
        } as SFSelectWidgetSchema,
      },
      roles: {
        type: 'string', title: '角色',
        ui: {
          widget: 'select',
          mode: 'multiple',
          asyncData: () => this.http.get('/sys/dp/role', null, CACHE_ENABLE),
        } as SFSelectWidgetSchema,
      },
      departments: {
        type: 'string', title: '部门',
        ui: {
          hidden: true
        },
      },
    },
  };
  @ViewChild('st') private readonly st!: STComponent;
  @ViewChild('sf') private readonly sf!: SFComponent;
  @ViewChild('sysDepartmentSelectComponent') private readonly sysDepartmentSelectComponent!: SysDepartmentSelectComponent;

  columns: STColumn[] = [
    {title: '头像', type: 'img', width: '60px', index: 'avatar.url'},
    {title: '登录名', index: 'username', sort: {reName: {ascend: 'asc', descend: 'desc'}}},
    {title: '姓名', index: 'name', sort: {reName: {ascend: 'asc', descend: 'desc'}}},
    {title: '手机', index: 'phone'},
    {title: '性别', index: 'sex', format: (item) => item.sex?.label, sort: {reName: {ascend: 'asc', descend: 'desc'}}},
    {
      title: '账户状态',
      index: 'accountStatus',
      render: 'accountStatus',
      format: (item) => item.accountStatus.label,
      sort: {reName: {ascend: 'asc', descend: 'desc'}},
    },
    {title: '角色', render: 'roles'},
    {title: '部门', render: 'departments'},
    {title: '备注', index: 'remark'},
    {title: '创建时间', index: 'createdTime', sort: {reName: {ascend: 'asc', descend: 'desc'}}},
    {
      title: '',
      buttons: [
        // {text: '查看', click: (item: any) => `/form/${item.id}`},
        {
          text: '编辑',
          type: 'none',
          acl: 'sys:user:edit',
          click: (record: any, modal?: any, instance?: STComponent): void => {
            this.modal.createStatic(SysUserEditComponent, {record}, {size: 'xl'}).subscribe(() => this.st.reload());
          },
        },
        {
          text: '更多',
          acl: ['sys:user:delete', 'sys:user:freeze', 'sys:user:unfreeze', 'sys:user:resetPassword'],
          children: [
            {
              text: '删除',
              className: 'text-error',
              type: 'del',
              acl: 'sys:user:delete',
              click: (record: any, modal?: any, instance?: STComponent) => {
                this.http.delete(`/sys/user/${record.id}`).subscribe(() => {
                  this.msgSrv.success('删除成功');
                  this.st.reload();
                });
              },
            },
            {
              text: '停用',
              acl: 'sys:user:freeze',
              click: (record) =>
                this.http.put(`/sys/user/${record.id}/blocks`).subscribe(() => {
                  this.msgSrv.success('停用成功');
                  this.st.reload();
                }),
              iif: (record) => record.accountStatus.value === 'NORMAL',
            },
            {
              text: '启用',
              acl: 'sys:user:unfreeze',
              click: (record) =>
                this.http.delete(`/sys/user/${record.id}/blocks`).subscribe(() => {
                  this.msgSrv.success('启用成功');
                  this.st.reload();
                }),
              iif: (record) => record.accountStatus.value === 'LOCKED',
            }, {
              text: '重置密码',
              type: 'del',
              acl: 'sys:user:resetPassword',
              pop: '确认重置密码吗?',
              click: (record) =>
                this.http.put(`/sys/user/${record.id}/password`).subscribe(() => {
                  this.msgSrv.success('已重置密码为123456');
                  this.st.reload();
                }),
            }, {
              text: '操作日志',
              click: (record) =>
                this.modal.createStatic(SysLogModalComponent, {businessId: record.id}, {size: 'xl'}).subscribe(() => {})
            },
            // {
            //   text: `权限配置(待开发)`,
            //   click: (record) => console.log('222', record),
            //   iif: (record) => record.id % 2 === 0,
            //   iifBehavior: 'disabled',
            //   tooltip: 'This is tooltip',
            // },
          ],
        },
      ],
    },
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService, private cacheSrv: CacheService) {
  }

  ngOnInit(): void {
  }

  add(): void {
    this.modal.createStatic(SysUserEditComponent, {}, {size: 'xl'}).subscribe(() => this.st.reload());
  }

  ngAfterViewInit(): void {
    this.sf.formValueChange.pipe(debounceTime(500), map(i => i.value)).subscribe((value) => this.st.reset(value));
    this.sysDepartmentSelectComponent.onSelect.subscribe((value) => this.sf.setValue('/departments', value));
    this.sf.reset(true);
  }


  /**
   * 导出用户
   */
  down() {
    this.http.get("/sys/user/export", this.sf.value,{responseType: 'blob', observe: 'response'})
      .subscribe(res => {
        let reg = new RegExp('filename=(.+)');
        let exec = reg.exec(res.headers.get('content-disposition') as string);
        let filename = 'export.xlsx';
        if (exec != null && exec.length >= 2){
          filename = decodeURI(exec[1]);
        }
        download(filename, res.body as Blob);
    });
  }
}
