import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {STChange, STColumn, STComponent, STData} from '@delon/abc/st';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {copy} from '@delon/util';
import {NzMessageService} from 'ng-zorro-antd/message';
import {omit} from "../../../../shared/utils";

/**
 * 字典数据
 */
@Component({
  selector: 'app-sys-dict-data',
  templateUrl: './dictdata.component.html'
})
export class SysDictDataComponent implements OnInit {
  data: STData[] = [];

  @Input() code: string = '';
  // 字典id
  @Input() id: string = '';

  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    {title: '字典描述', index: 'label', render: 'nameTpl', width: '30%'},
    {title: '字典值', index: 'value', render: 'valueTpl', width: '30%'},
    {
      title: '',
      buttons: [
        {
          text: '编辑', iif: (i) => !i._edit, acl: 'sys:dict:edit', click: (i) => {
            this.st.setRow(i, {_edit: true, _label: i.label, _value: i.value}, {refreshSchema: true})
          }
        },
        {
          text: '保存', iif: (i) => {
            return i._edit;
          }, acl: 'sys:dict:edit', click: (i) => this.update({...i}, false)
        },
        {
          text: '取消',
          iif: (i) => i._edit,
          click: (i) => {
            this.st.setRow(i, {_edit: false}, {refreshSchema: true});
            if (i._temp) {
              this.st._data.shift();
              // this.st.reload();
            }
          },
        },
        {
          text: '删除',
          iif: (i) => !i._edit,
          acl: 'sys:dict:edit',
          pop: '确认删除?',
          click: (i) => this.deleteDictItem(i.id)
        },
      ],
    },
  ];

  @Output() readonly delete = new EventEmitter<string>();

  total: number = 0;
  pi: number = 1;
  ps: number = 20;

  constructor(
    public http: _HttpClient,
    private modalHelper: ModalHelper,
    private messageSrv: NzMessageService,
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
    this.http.get(`/sys/dict/${this.code}/item`, {page: this.pi - 1, size: this.ps}).subscribe((res) => {
      this.data = res.rows;
      this.total = res.total;
    });
  }

  change(e: STChange): void {
    if (e.type === 'pi') {
      this.pi = e.pi
      this.reload();
    }
  }

  /**
   * 删除字典项
   *
   * @param id
   * @private
   */
  private deleteDictItem(id: string): void {
    this.http.delete(`/sys/dict/item/${id}`).subscribe((res) => {
        this.messageSrv.success('删除成功');
        this.reload();
      }
    );
  }

  /**
   * 增加数据字典项
   *
   * @private
   */
  add(): void {
    if (this.st._data.length > 0 && this.st._data[0]._temp) {
      return
    }
    this.st.addRow({
      _temp: true,
      _edit: true
    });
  }

  save(value: any) {
    let url = `/sys/dict/${this.id}/item`;
    this.http.post(url, {
      ...value
    }).subscribe((res) => {
      this.reload();
    });
  }

  private update(i: STData, _edit: boolean): void {
    let keys = ['label', 'value']
    if (i._temp) {
      this.save(omit(i, keys))
      return;
    }
    let url = `/sys/dict/item/${i.id}`;
    this.http.put(url, omit(i, [...keys, 'id'])).subscribe((res) => {
      this.reload();
    });
  }
}
