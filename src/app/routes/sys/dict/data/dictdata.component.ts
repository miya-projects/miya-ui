import {Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import {STChange, STColumn, STComponent, STData} from '@delon/abc/st';
import {SFSchema, SFUISchema} from '@delon/form';
import {_HttpClient, ModalHelper} from '@delon/theme';
import { copy } from '@delon/util';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalRef, NzModalService} from 'ng-zorro-antd/modal';

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
    { title: '字典描述', index: 'label', render: 'nameTpl' },
    { title: '字典值', index: 'value', render: 'valueTpl' },
    {
      title: '',
      buttons: [
        { text: '编辑', iif: (i) => !i._edit, acl: 'sys:dict:edit', click: (i) => {this.st.setRow(i, { _edit: true, _label: i.label, _value: i.value }, { refreshSchema: true })} },
        { text: '保存', iif: (i) => {
            return i._edit;
          }, acl: 'sys:dict:edit', click: (i) => this.updateRow({
            ...i,
            label: i._label,
            value: i._value
          }, false) },
        {
          text: '取消',
          iif: (i) => i._edit,
          click: (i) => {
            this.st.setRow(i, { _edit: false }, { refreshSchema: true });
            if (i._temp) {
              this.data.shift();
              // this.st.reload();
            }
          },
        },
        { text: '删除', iif: (i) => !i._edit, acl: 'sys:dict:edit' ,click: (i) => this.deleteDictItem(i.id) },
      ],
    },
  ];

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onDelete = new EventEmitter<string>();

  total: number = 0;
  pi: number = 1;
  ps: number = 20;

  constructor(
    public http: _HttpClient,
    private modalHelper: ModalHelper,
    private messageSrv: NzMessageService,
    private modalSrv: NzModalService,
  ) {}

  copy(content: string): void {
    copy(content).then(() => {
      this.messageSrv.success('复制成功');
    });
  }

  ngOnInit(): void {
    this.reload();
  }

  reload(): void {
    this.http.get(`/sys/dict/${this.code}/item`, { page: this.pi - 1, size: this.ps }).subscribe((res) => {
      this.data = res.rows;
      this.total = res.total;
    });
  }

  change(e: STChange): void {
    if (e.type === 'pi'){
      this.pi = e.pi
      this.reload();
    }
  }

  private updateRow(i: STData, _edit: boolean): void {
    let url = `/sys/dict/item/${i.id}`;
    let keys: string[] = Object.keys(i).filter((v) => !v.startsWith('_'));
    let o = {};
    keys.forEach((k) => {
      // @ts-ignore
      o[k] = i[k];
    });
    this.http.put(url, o).subscribe((res) => {
      // this.st.setRow(i, {_edit}, {refreshSchema: true});
      this.reload();
    });
  }

  /**
   * 删除字典项
   * @param id
   * @private
   */
  private deleteDictItem(id: string): void {
    this.modalSrv.confirm({
      nzTitle: '提示',
      nzContent: '确认删除?',
      nzOnOk: () => {
        this.http.delete('/sys/dict/item/' + id).subscribe((res) => {
          this.messageSrv.success('删除成功');
          this.reload();
        });
      },
    });
  }

  @ViewChild("addRef")
  private readonly addRef!: TemplateRef<any>;

  private modal!: NzModalRef;

  schema: SFSchema = {
    properties: {
      label: { type: 'string', title: '字典描述' },
      value: { type: 'string', title: '字典值' },
    },
    required: ['label', 'value'],
  };
  ui: SFUISchema = {
    '*': {
      spanLabelFixed: 100,
      grid: { span: 16 },
    },
  };

  /**
   * 增加数据字典项
   * @private
   */
  add(): void {
    this.modal = this.modalSrv.create({
      nzContent: this.addRef,
      nzFooter: null
    });
  }

  close(): void {
    this.modal.destroy();
  }

  save(value: any) {
    let url = `/sys/dict/${this.id}/item`;
    this.http.post(url, {
      ...value
    }).subscribe((res) => {
      this.reload();
      this.modal.close(true);
    });
  }
}
