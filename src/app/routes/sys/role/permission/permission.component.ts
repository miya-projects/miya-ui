import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {STData} from '@delon/abc/st';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {copy} from '@delon/util';
import {NzTreeNodeOptions} from 'ng-zorro-antd/core/tree/nz-tree-base-node';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzTreeComponent} from 'ng-zorro-antd/tree';
import {browseTree} from '../../../../shared/utils';

@Component({
  selector: 'app-sys-role-permission',
  template: `
    <div nz-row style="margin-bottom: 15px;">
      <div nz-col nzOffset="2">
        显示Code
        <nz-switch [(ngModel)]="showCode"></nz-switch>
      </div>
      <div nz-col nzOffset="6">
        <nz-tag [nzColor]="'#108ee9'" *ngIf="role?.isSystem">
          系统角色
        </nz-tag>
      </div>
      <div nz-col [nzSpan]="2" [nzOffset]="9">
        <button (click)="onDelete.emit(this.id)" nz-button nzType="primary" nzDanger acl="sys:role:delete">删除
        </button>
      </div>
    </div>

    <div style="height: 65vh;overflow-y: auto;">
      <nz-tree
        #tree
        [nzData]="business"
        [nzExpandAll]="expandAll"
        [nzCheckedKeys]="defaultCheckedKeys"
        nzCheckable
        [nzTreeTemplate]="nzTreeTemplate"
      >
        <ng-template #nzTreeTemplate let-node let-origin="origin">
          <span>
            <span class="folder-name">
              {{ node.title }}
              <ng-container *ngIf="showCode">
                {{node.key}}
                <i nz-icon nzType="copy" nzTheme="outline" (click)="copy(node.key);"></i>
              </ng-container>
            </span>
          </span>
        </ng-template>
      </nz-tree>
    </div>
    <div nz-row>
      <div nz-col nzSpan="5" nzOffset="20">
        <button (click)="save(this.id)" nz-button nzType="primary" acl="sys:role:edit">保存</button>
      </div>
    </div>
  `,
})

//   [nzSelectedKeys]="defaultSelectedKeys"
export class SysRolePermissionComponent implements OnInit {
  data: STData[] = [];
  expandAll: boolean = false;
  // 默认选中的keys，即拥有的权限
  defaultCheckedKeys: any[] = [];

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onDelete = new EventEmitter<string>();

  // 角色
  @Input() id!: string;
  /**
   * 功能结构
   */
  @Input() business: any[] = [];
  role: any;
  @ViewChild('tree', {static: false}) tree!: NzTreeComponent;

  showCode: boolean = false;

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private messageSrv: NzMessageService,
    private modalSrv: NzModalService,
  ) {
  }

  copy(content: string): void {
    copy(content).then(() => {
      this.messageSrv.success('复制成功');
    });
  }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    // todo 优化
    this.http.get('/sys/role/' + this.id).subscribe(role => {
      this.role = role;
      let res = role.business;
      const acls = res.map((i: any) => i.fullCode);
      this.expandAll = true;
      this.defaultCheckedKeys = acls;
    });
  }

  private parseNode(nodes: NzTreeNodeOptions[]): any[] {
    const list = [];
    // @ts-ignore
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].isLeaf) {
        list.push(nodes[i]);
      } else {
        // @ts-ignore
        let children = this.parseNode(nodes[i].children);
        for (let j = 0; j < children.length; j++) {
          list.push(children[j]);
        }
      }
    }
    return list;
  }

  /**
   * 保存角色权限
   * @param id
   */
  save(id: string): void {
    let checkedNodeList = this.tree.getCheckedNodeList();
    let checkedNodeListFlat = checkedNodeList.map(node => {
      if (node.origin.isLeaf) {
        return [node];
      } else {
        return this.parseNode(node.origin.children as NzTreeNodeOptions[]);
      }
    });
    const codes = [];
    for (let i = 0; i < checkedNodeListFlat.length; i++) {
      for (let j = 0; j < checkedNodeListFlat[i].length; j++) {
        codes.push(checkedNodeListFlat[i][j]);
      }
    }
    this.http.put(`/sys/role/${this.id}/business`, {
      codes: codes.map(i => i.key)
    }).subscribe(res => {
      this.messageSrv.success('操作成功');
    });
  }
}
