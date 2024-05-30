import { Component, OnInit } from '@angular/core';
import { _HttpClient, ModalHelper } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { forkJoin } from 'rxjs';
import { SysRoleEditComponent } from './edit/edit.component';
import { browseTree } from '../../../shared/utils';

@Component({
  selector: 'app-sys-role',
  templateUrl: './role.component.html'
})
export class SysRoleComponent implements OnInit {
  roles: any;
  business: any;
  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private messageSrv: NzMessageService,
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
    forkJoin([this.http.get('/sys/dp/role'), this.http.get('/sys/role/business')]).subscribe(([roles, business]) => {
      browseTree(business, (node: any) => {
        node.title = node.name;
        node.key = node.fullCode;
        node.selectable = false;
        if (!node.children) {
          node.isLeaf = true;
          // 这里有坑，暂时先这么实现，不能使用节点的checked实现
          //https://github.com/NG-ZORRO/ng-zorro-antd/issues/4472
          //https://github.com/NG-ZORRO/ng-zorro-antd/issues/6536
          // if (acls.indexOf(node.fullCode) != -1){
          //   node.checked = true
          // }
        }
      });
      this.business = business;
      this.roles = roles;
    });
  }

  /**
   * 新建角色
   */
  add(): void {
    this.modal.createStatic(SysRoleEditComponent).subscribe(this.reload.bind(this));
  }
  /**
   * 删除角色
   *
   * @param id
   */
  delete(id: string): void {
    this.modalSrv.confirm({
      nzTitle: '提示',
      nzContent: '是否要删除?',
      nzOnOk: () => {
        this.http.delete(`/sys/role/${id}`).subscribe(res => {
          this.messageSrv.success('操作成功');
          this.reload();
        });
      }
    });
  }
}
