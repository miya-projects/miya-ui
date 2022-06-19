import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SelectWidget, SFValue, TreeSelectWidget} from '@delon/form';
import {_HttpClient} from '@delon/theme';

/**
 * 支持对象形式的treeselect
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sf-tree-select',
  templateUrl: './treeselect.widget.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class ApiTreeSelectWidget extends TreeSelectWidget implements OnInit {
  static readonly KEY = 'api-tree-select';

  /**
   * 给sf值的时候调用该方法
   *
   * @param value 组件值
   */
  reset(value: SFValue): void {
    if (value instanceof Array) {
      value = value.map((i) => this.normalize(i));
    } else {
      value = this.normalize(value);
    }
    this.setValue(value);
    super.reset(value);
  }

  normalize(value: any): string {
    if (value == null) {
      return value;
    }
    if (value.__proto__ === Object.prototype) {
      if (Object.keys(value).indexOf('id') !== -1) {
        return value.id;
      } else if (Object.keys(value).indexOf('value') !== -1) {
        return value.value;
      } else if (Object.keys(value).indexOf('key') !== -1) {
        return value.key;
      }
    }
    return value;
  }

  ngOnInit() {
    super.ngOnInit();
  }

  private get http(): _HttpClient {
    return this.injector.get(_HttpClient);
  }

}
