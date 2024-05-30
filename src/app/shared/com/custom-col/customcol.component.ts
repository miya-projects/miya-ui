import { Component, Input, OnInit } from '@angular/core';
import { STColumn } from '@delon/abc/st';
import { NzCheckBoxOptionInterface } from 'ng-zorro-antd/checkbox/checkbox-group.component';
import { STColumnTitle } from '@delon/abc/st/st.interfaces';
import { PreferencesService } from '../../../core/preferences/preferences.service';

// 自定义table显示列
@Component({
  selector: 'app-custom-col',
  templateUrl: './customcol.component.html'
})
export class CustomColComponent implements OnInit {
  // 是否显示模态框
  isVisibleModal: boolean = false;
  // 支持自定义是否展示的列
  customColumns: NzCheckBoxOptionInterface[] = [];

  // 全选按钮ngModel
  allChecked: boolean = this.customColumns.filter(col => col.checked).length === this.customColumns.length;

  @Input()
  originColumns: STColumn[] = [];
  // 未设置时默认展示的字段，不传显示所有
  @Input()
  defaultColumns: string[] = [];
  // 一直显示的，不参与自定义设置
  @Input()
  alwaysShow: string[] = [''];
  // 偏好配置保存的key，实际保存会使用customTableKey:${key}
  @Input()
  key: string | undefined = undefined;

  // 最终展示的
  public columns: STColumn[] = [];

  constructor(private preferencesService: PreferencesService) {}

  get indeterminate(): boolean {
    return new Set(this.customColumns.map(col => col.checked)).size > 1;
  }

  ngOnInit(): void {
    let customColumns = this.originColumns
      .map(col => {
        if (typeof col.title === 'string') {
          return col.title as string;
        }
        return (col.title as STColumnTitle).text as string;
      })
      .filter(title => this.alwaysShow.indexOf(title) === -1);

    this.customColumns = customColumns.map(title => {
      return {
        label: title,
        value: title
      };
    });
    this.resetSelected();
    this.reCalcColumns();
  }

  // 重置选中的列
  resetSelected() {
    let checkedCols: string[];
    let obj: { [key: string]: boolean } = {};
    if (this.key) {
      checkedCols = this.preferencesService.get(`customTableKey:${this.key}`);
      if (checkedCols) {
        checkedCols.forEach(col => {
          obj[col] = true;
        });
        this.customColumns.forEach(col => {
          col.checked = !!obj[col.label];
        });
      } else {
        // 没设置首选项，用默认的
        this.resetDefault();
      }
    } else {
      this.customColumns.forEach(col => {
        col.checked = true;
      });
    }
  }

  openSetting() {
    this.resetSelected();
    this.isVisibleModal = true;
  }

  handleOk() {
    this.reCalcColumns();
    if (this.key) {
      let checkedCols = this.customColumns.filter(col => col.checked).map(col => col.value);
      this.preferencesService.save(`customTableKey:${this.key}`, checkedCols);
    }
    this.isVisibleModal = false;
  }

  // 恢复默认设置
  resetDefault() {
    if (this.defaultColumns.length === 0) {
      for (let i = 0; i < this.customColumns.length; i++) {
        this.customColumns[i].checked = true;
      }
      return;
    }
    for (let i = 0; i < this.customColumns.length; i++) {
      this.customColumns[i].checked = this.defaultColumns.indexOf(this.customColumns[i].value) !== -1;
    }
  }

  reCalcColumns(): void {
    let checkedCols = this.customColumns.filter(col => col.checked).map(col => col.value);
    // 选中的 + 一直显示
    this.columns = this.originColumns.filter(
      col => checkedCols.indexOf(col.title as string) != -1 || this.alwaysShow.indexOf(col.title as string) != -1
    );
  }

  // 点击全选按钮回调
  updateAllChecked(checked: boolean) {
    this.customColumns.forEach(col => (col.checked = checked));
  }

  checkboxGroupChange($event: any) {
    this.allChecked = this.customColumns.filter(col => col.checked).length === this.customColumns.length;
  }
}
