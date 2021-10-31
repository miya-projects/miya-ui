import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFComponent, SFSchema, SFSelectWidgetSchema } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Subject } from 'rxjs';
import { debounceTime} from 'rxjs/operators';
import { SysUserEditComponent } from './edit/edit.component';

@Component({
  selector: '<%= selector %>',
  templateUrl: './<%= dasherize(name) %>.component.html',<% if(!inlineStyle) { %><% } else { %>
  styleUrls: ['./<%= dasherize(name) %>.component.<%= style %>']<% } %><% if(!!viewEncapsulation) { %>,
  encapsulation: ViewEncapsulation.<%= viewEncapsulation %><% } if (changeDetection !== 'Default') { %>,
  changeDetection: ChangeDetectionStrategy.<%= changeDetection %><% } %>
})
export class <%= componentName %> implements OnInit, AfterViewInit {
  url = `/sysUser/list`;
  searchSchema: SFSchema = {
    properties: {
      name: {
        type: 'string',
        title: '姓名',
      },
      username: {
        type: 'string',
        title: '登陆名',
      },
      phone: {
        type: 'string',
        title: '手机',
      },
      accountStatus: {
        type: 'string',
        title: '账户状态',
        default: ['NORMAL'],
        ui: {
          widget: 'select',
          mode: 'multiple',
          asyncData: () => this.http.post('/dp/queryEnum', { key: 'SysUser.AccountStatus' }),
        } as SFSelectWidgetSchema,
      },
      sysRole: {
        type: 'string',
        title: '角色',
        ui: {
          widget: 'select',
          mode: 'multiple',
          asyncData: () => this.http.post('/dp/sysRole'),
        } as SFSelectWidgetSchema,
      },
    },
  };
  @ViewChild('st') private readonly st!: STComponent;
  @ViewChild('sf') private readonly sf!: SFComponent;
  columns: STColumn[] = [
    { title: '头像', type: 'img', width: '50px', index: 'avatar.url' },
    { title: '登陆名', index: 'username', sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '姓名', index: 'name', width: '50px', sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    { title: '手机', index: 'phone' },
    { title: '性别', index: 'sex', format: (item) => item.sex.label, sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    {
      title: '账户状态',
      index: 'accountStatus',
      format: (item) => item.accountStatus.label,
      sort: { reName: { ascend: 'asc', descend: 'desc' } },
    },
    { title: '角色', render: 'sysRole' },
    { title: '备注', index: 'remark' },
    { title: '创建时间', index: 'createdTime', sort: { reName: { ascend: 'asc', descend: 'desc' } } },
    {
      title: '',
      buttons: [
        // {text: '查看', click: (item: any) => `/form/${item.id}`},
        {
          text: '编辑',
          type: 'none',
          click: (record: any, modal?: any, instance?: STComponent): void => {
            this.modal.createStatic(SysUserEditComponent, { record }, { size: 'xl' }).subscribe(() => this.st.reload());
          },
        },
        {
          text: '更多',
          children: [
            {
              text: '删除',
              className: 'text-error',
              type: 'del',
              click: (record: any, modal?: any, instance?: STComponent) => {
                this.http.post('/sysUser/delete', { id: record.id }).subscribe(() => {
                  this.msgSrv.success('删除成功');
                  this.st.reload();
                });
              },
            },
          ],
        },
      ],
    },
  ];

  constructor(private http: _HttpClient, private modal: ModalHelper, private msgSrv: NzMessageService) {}

  subject: Subject<any> = new Subject<any>();
  ngOnInit(): void {
    this.subject.pipe(debounceTime(500)).subscribe((value) => this.st.reset(value));
  }

  add(): void {
    this.modal.createStatic(SysUserEditComponent, {}, { size: 'xl' }).subscribe(() => this.st.reload());
  }

  searchValueChange(e: any): void {
    this.subject.next(e.value);
  }

  ngAfterViewInit(): void {
    this.sf.reset(true);
  }
}
