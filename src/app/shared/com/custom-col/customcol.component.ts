import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {STColumn, STComponent} from '@delon/abc/st';
import {NzCheckboxOption, NzCheckBoxOptionInterface} from 'ng-zorro-antd/checkbox/checkbox-group.component';
import {STColumnTitle} from '@delon/abc/st/st.interfaces';
import {PreferencesService} from '../../../core/preferences/preferences.service';

// 自定义table显示列
@Component({
  selector: 'app-custom-col',
  templateUrl: './customcol.component.html',
  standalone: false
})
export class CustomColComponent implements OnInit, AfterViewInit {
  // 是否显示模态框
  isVisibleModal: boolean = false;
  // 支持自定义是否展示的列
  selectedColumns: (string | number)[] = [];

  // 表格字段可选项
  columnsOptions: NzCheckboxOption[] = [];

  // 全选按钮ngModel
  allChecked: boolean = this.selectedColumns.length === this.columnsOptions.length;

  allColumns: STColumn[] = [];
  // 未设置时默认展示的字段，不传显示所有
  @Input()
  defaultColumns: (string | number)[] = [];
  // 一直显示的，不参与自定义设置
  @Input()
  alwaysShow: string[] = [''];
  // 偏好配置保存的key，实际保存会使用customTableKey:${key}
  @Input()
  key: string | undefined = undefined;

  // 表格st的引用
  @Input() st!: STComponent;

  constructor(private preferencesService: PreferencesService) {
  }

  ngAfterViewInit(): void {
    this.allColumns = this.st!.columns as STColumn[];
    this.columnsOptions = this.st!.columns!.map(col => {
      let item: NzCheckboxOption = {
        label: "", value: "", disabled: false
      }
      if (typeof col.title === 'string') {
        item.label = col.title as string;
        item.value = col.title as string;
      } else {
        item.label = (col.title as STColumnTitle).text as string;
        item.value = (col.title as STColumnTitle).text as string;
      }
      if (this.alwaysShow.indexOf(item.value) !== -1) {
        item.disabled = true;
      }
      return item;
    })
    this.resetSelected();
    this.updateTableColumns()
  }

  // 是否是半选状态
  get indeterminate(): boolean {
    return this.selectedColumns.length > 1 && this.selectedColumns.length !== this.columnsOptions.length;
  }

  ngOnInit(): void {

  }

  // 重置选中的列
  resetSelected() {
    let checkedCols: string[];
    if (this.key) {
      checkedCols = this.preferencesService.get(`customTableKey:${this.key}`);
      if (checkedCols && checkedCols.length > 0) {
        this.selectedColumns = checkedCols;
      } else {
        // 没设置首选项，用默认的
        this.resetDefault();
      }
    } else {
      this.resetDefault();
    }
  }

  openSetting() {
    this.resetSelected();
    this.isVisibleModal = true;
  }

  handleOk() {
    if (this.key) {
      this.preferencesService.save(`customTableKey:${this.key}`, this.selectedColumns);
    }
    this.isVisibleModal = false;
    this.updateTableColumns()
  }

  // 恢复默认设置
  resetDefault() {
    if (this.defaultColumns.length === 0) {
      this.selectedColumns = this.columnsOptions.map(item => item.value)
      return;
    }
    this.selectedColumns = this.columnsOptions.map(item => item.value).filter(item => this.defaultColumns.indexOf(item) !== -1)
  }

  // 点击全选按钮回调
  updateAllChecked(checked: boolean) {
    if (checked) {
      this.selectedColumns = this.columnsOptions.map(item => item.value);
    } else {
      this.selectedColumns = [...this.alwaysShow]
    }
  }

  checkboxGroupChange($event: any) {
    this.allChecked = this.columnsOptions.length === this.selectedColumns.length;
  }

  /**
   * 更新表格最终显示的字段
   */
  updateTableColumns() {
    let columns = this.allColumns!.filter(col => {
      if (typeof col.title === 'string') {
        return this.selectedColumns.indexOf(col.title) !== -1
      } else {
        return this.selectedColumns.indexOf((col.title as STColumnTitle).text as string) !== -1
      }
    })
    console.log(columns)
    this.st.resetColumns({
      columns: columns,
      emitReload: true
    }).then(() => {})
  }
}
