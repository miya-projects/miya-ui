import {Component, OnInit, ViewChild} from '@angular/core';
import {STColumn, STComponent, STData} from '@delon/abc/st';
import {STRowClassName} from '@delon/abc/st/st.interfaces';
import {_HttpClient, ModalHelper} from '@delon/theme';
import {NzMessageService} from 'ng-zorro-antd/message';
import {NzModalService} from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-sys-config',
  templateUrl: './config.component.html',
})
export class SysConfigComponent implements OnInit {
  url = `/sys/dict/item/list`;
  data: STData[] = [];

  @ViewChild('st') private readonly st!: STComponent;
  columns: STColumn[] = [
    { title: '分组', index: 'group', render: 'group', width: 100 },
    { title: '配置项', index: 'key', render: 'key', width: 200 },
    { title: '配置值', index: 'val', render: 'val', width: 400 },
    { title: '描述', index: 'desc', render: 'desc', width: 300 },
    { title: '操作', render: 'action', width: 300 },

  ];
  rowClassName: STRowClassName = () => 'st-row-text';

  constructor(
    private http: _HttpClient,
    private modal: ModalHelper,
    private messageSrc: NzMessageService,
    private modalSrc: NzModalService,
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
    this.http.get('/sys/config/internal').subscribe((list) => {
      this.data = list;
    });
  }

  saveValue(group: string, code: string, value: string | null): void {
    let body: { configKey: string; value: any, group: string } = {
      configKey: code,
      value: undefined,
      group: group
    };
    if (value !== null) {
      body.value = value;
    }
    this.http.put('/sys/config', body).subscribe(() => {
      this.messageSrc.success('配置成功');
      this.reload();
    });
  }
}
