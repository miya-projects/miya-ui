import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { _HttpClient } from '@delon/theme';

export interface TreeNodeInterface {
  id: string;
  name: string;
  level?: number;
  _expand?: boolean;
  children?: TreeNodeInterface[];
  parent?: TreeNodeInterface;

  [key: string]: any;
}

@Component({
  selector: 'app-treetable',
  templateUrl: './treetable.component.html',
  styles: [
    `
      i {
        cursor: pointer;
      }
    `
  ]
})
export class TreetableComponent implements OnInit {
  // 数据加载完成
  @Output()
  readonly dataReady = new EventEmitter<TreeNodeInterface[]>();
  @Input('data')
  data!: TreeNodeInterface[] | string;
  @Input('columns')
  columns!: any[];
  // 展开为数组的数据
  expandedData: TreeNodeInterface[] = [];
  page: any = {
    page: 1,
    pageSize: 20
  };
  nzData!: TreeNodeInterface[];
  nzFrontPagination: boolean = false;
  constructor(private http: _HttpClient) {}

  /**
   * 主要目的是当节点缩起来的时候将子节点也缩起来
   *
   * @param array
   * @param data
   * @param $event
   */
  collapse(array: TreeNodeInterface[], data: TreeNodeInterface, $event: boolean): void {
    if (!$event) {
      if (data.children) {
        data.children.forEach(d => {
          const target = array.find(a => a.id === d.id)!;
          target._expand = false;
          this.collapse(array, target, false);
        });
      } else {
        return;
      }
    }
  }
  // expandedData

  collapseAll() {
    for (let i = 0; i < this.expandedData.length; i++) {
      this.expandedData[i]._expand = false;
    }
  }

  expandAll() {
    for (let i = 0; i < this.expandedData.length; i++) {
      this.expandedData[i]._expand = true;
    }
  }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    if (typeof this.data === 'string') {
      this.http
        .get(this.data as string, {
          ...this.page,
          page: this.page.page - 1
        })
        .subscribe(res => {
          this.nzData = res.rows;
          this.page = {
            total: res.total,
            page: res.currentPage + 1,
            pageSize: res.pageSize
          };
          this.expandedData = this.convertTreeToList(this.nzData);
          this.dataReady.emit(this.expandedData);
        });
    } else {
      this.nzFrontPagination = true;
      this.nzData = this.data;
      this.expandedData = this.convertTreeToList(this.nzData);
    }
  }

  /**
   * tree节点转数组
   *
   * @param root
   */
  convertTreeToList(root: TreeNodeInterface[]): TreeNodeInterface[] {
    const stack: TreeNodeInterface[] = [];
    // 最终生成的数组
    const array: TreeNodeInterface[] = [];
    const hashMap: { [key: string]: boolean } = {};
    if (!root || root.length === 0) {
      return array;
    }
    for (let i = root.length - 1; i >= 0; i--) {
      stack.push({ ...root[i], level: 0, _expand: false });
    }
    while (stack.length !== 0) {
      const node = stack.pop()!;
      if (!hashMap[node.id]) {
        hashMap[node.id] = true;
        array.push(node);
      }
      if (node.children) {
        for (let i = node.children.length - 1; i >= 0; i--) {
          stack.push({ ...node.children[i], level: node.level! + 1, _expand: false, parent: node });
        }
      }
    }
    return array;
  }
}
