import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {STChange, STColumn, STComponent, STData} from '@delon/abc/st';
import {SFComponent, SFSchema, SFTreeSelectWidgetSchema, SFUISchema} from '@delon/form';
import {_HttpClient} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzModalRef} from 'ng-zorro-antd/modal/modal-ref';
import {of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {CACHE_ENABLE} from '../../../core/net/cache.interceptors';
import {TreeNodeInterface, TreetableComponent} from '../../../shared/com/treetable/treetable.component';
import {browseTree} from '../../../shared/utils';

@Component({
  selector: 'app-sys-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.less']
})
export class SysDepartmentComponent implements OnInit, AfterViewInit {

  constructor(
    private msgSrv: NzMessageService,
    public http: _HttpClient,
    private modalService: NzModalService
  ) {
  }

  @ViewChild('sf')
  private readonly sf!: SFComponent;
  @ViewChild('addDepartmentTemplate')
  addDepartmentTemplate!: TemplateRef<any>;
  @ViewChild('treeTable')
  treeTable!: TreetableComponent;

  schema: SFSchema = {
    properties: {
      id: {type: 'string', title: 'id', ui: {hidden: true}},
      name: {type: 'string', title: '名称'},
      description: {type: 'string', title: '描述', maxLength: 15},
      parent: {type: 'string', title: '上级部门'},
    },
    required: ['name', 'description'],
  };
  ui: SFUISchema = {
    '*': {
      // spanLabel: 9,
      // spanControl: 21
    },
    $parent: {
      widget: 'api-tree-select',
      showSearch: true,
      asyncData: () => this.http.get('/sys/department?noPage', null, CACHE_ENABLE).pipe(map((items: any) => {
        browseTree(items, (item: any) => {
          item.title = item.name;
          item.key = item.id;
          item.expanded = true;
          item.isLeaf = item.children.length === 0;
          item.icon = item.isLeaf ? 'file' : item.expanded ? 'folder-open' : 'folder';
          let id = this.sf.getValue("/id");
          if (id === item.id){
            // 本部门和本部门的下级部门不可被直接修改为本部门的上级部门
            browseTree([item], (i: any) => {
              i.disabled = true;
            })
          }
        });
        return items;
      })),
    } as unknown as SFTreeSelectWidgetSchema,
  }
  departments: TreeNodeInterface[] = [];
  columns: STColumn[] = [
    {
      title: '部门名称', index: 'name', render: 'name'
    }, {
      title: '描述', index: 'description'
    }, {
      title: '操作', render: 'action'
    }
  ];

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  addDepartment(item?: any) {
    const modal: NzModalRef = this.modalService.create({
      nzContent: this.addDepartmentTemplate,
      nzComponentParams: {parent: item.id},
      nzOkLoading: false,
      nzStyle: {top: '30%'},
      nzOnOk: () => {
        modal.updateConfig({nzOkLoading: true});
        // @ts-ignore
        let body = {
          ...this.sf.value
        };
        this.http.post('/sys/department', body).pipe(catchError((err) => {
          modal.updateConfig({nzOkLoading: false});
          return of();
        })).subscribe(res => {
          modal.close();
          this.msgSrv.success('操作成功');
          this.treeTable.reload();
        });
        return false;
      }
    });
  }

  change($event: STChange<any>) {
    console.log($event);
  }

  delete(id: string) {
    this.modalService.confirm({
      nzTitle: '提示',
      nzContent: '确认要删除吗?',
      nzOnOk: () => {
        this.http.delete(`/sys/department/${  id}`).subscribe(res => {
          this.msgSrv.success("删除成功");
          this.treeTable.reload();
        })
      }
    })
  }

  modify(item: any) {
    const modal: NzModalRef = this.modalService.create({
      nzContent: this.addDepartmentTemplate,
      nzComponentParams: item,
      nzOkLoading: false,
      nzStyle: {top: '30%'},
      nzOnOk: () => {
        modal.updateConfig({nzOkLoading: true});
        // @ts-ignore
        let body = {
          ...this.sf.value
        };
        this.http.put('/sys/department', body).pipe(catchError((err) => {
          modal.updateConfig({nzOkLoading: false});
          return of();
        })).subscribe(res => {
          modal.close();
          this.msgSrv.success('操作成功');
          this.treeTable.reload();
        });
        return false;
      }
    });
  }
}
