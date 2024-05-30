import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/core/tree/nz-tree-base-node';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzFormatEmitEvent, NzTreeComponent } from 'ng-zorro-antd/tree';
import { browseTree } from '../../../../shared/utils';

@Component({
  selector: 'app-sys-department-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.less']
})
export class SysDepartmentSelectComponent implements OnInit, AfterViewInit {
  searchValue = '';
  departments: NzTreeNodeOptions[] = [];
  @Output() onSelect = new EventEmitter<string>();

  @ViewChild('nzTreeComponent')
  nzTreeComponent!: NzTreeComponent;

  constructor(
    private msgSrv: NzMessageService,
    private http: _HttpClient
  ) {}

  ngOnInit(): void {
    this.reload();
  }

  ngAfterViewInit(): void {}

  reload(): void {
    this.http.get('/sys/department?noPage').subscribe(res => {
      this.convertData(res);
      this.departments = res;
    });
  }

  convertData(treeList: any) {
    browseTree(treeList, (item: any) => {
      item.title = item.name;
      item.key = item.id;
      item.expanded = true;
      item.isLeaf = item.children.length === 0;
      item.icon = item.isLeaf ? 'file' : item.expanded ? 'folder-open' : 'folder';
    });
  }

  onClick(e: NzFormatEmitEvent) {
    let selectedKeys: NzTreeNode[] = e!.selectedKeys as NzTreeNode[];
    if (selectedKeys && selectedKeys.length > 0) {
      this.onSelect.next(selectedKeys[0].key);
    } else {
      this.onSelect.next('');
    }
  }
}
