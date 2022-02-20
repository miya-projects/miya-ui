import {Component, Input, OnInit} from '@angular/core';
import {STColumn} from '@delon/abc/st';
import {NzCheckBoxOptionInterface} from 'ng-zorro-antd/checkbox/checkbox-group.component';

// todo 用户首选项存储
// 自定义table显示列
@Component({
  selector: 'app-custom-col',
  templateUrl: './customcol.component.html'
})
export class CustomColComponent implements OnInit {
  isVisible: boolean = false;
  customColumns: NzCheckBoxOptionInterface[] = [];

  @Input()
  originColumns: STColumn[] = [];
  // 未设置时默认展示的字段，不传显示所有
  @Input()
  defaultColumns: string[] = [];
  // 一直显示的，不参与自定义设置
  @Input()
  alwaysShow: string[] = [''];

  // 最终展示的
  public columns: STColumn[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.customColumns = this.originColumns.filter(col => this.alwaysShow.indexOf(col.title as string) === -1).map(col => {
      return {
        label: col.title as string,
        value: col.title as string,
        // 加载上一次的设置或使用默认
        checked: true
      }
    });
    this.reCalcColumns();
  }

  openSetting() {
    this.isVisible = true;
  }

  handleOk() {
    this.reCalcColumns();
    this.isVisible = false;
  }

  // 恢复默认设置
  resetDefault() {
    if (this.defaultColumns.length === 0){
      for (let i = 0; i < this.customColumns.length; i++) {
        this.customColumns[i].checked = true;
      }
      return;
    }
    for (let i = 0; i < this.customColumns.length; i++) {
      this.customColumns[i].checked = this.defaultColumns.indexOf(this.customColumns[i].value) !== -1
    }
  }

  reCalcColumns(): void{
    let checkedCols = this.customColumns.filter(col => col.checked).map(col => col.value);
    // 选中的 + 一直显示
    this.columns = this.originColumns.filter(col => (checkedCols.indexOf(col.title as string) != -1) || this.alwaysShow.indexOf(col.title as string) != -1);
  }

}
