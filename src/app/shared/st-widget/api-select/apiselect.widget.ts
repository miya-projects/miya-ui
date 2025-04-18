import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DelonFormModule, SelectWidget, SFValue } from '@delon/form';
import { _HttpClient } from '@delon/theme';
import { CACHE_ENABLE } from '../../../core/net/cache.interceptors';
import { NzOptionComponent, NzOptionGroupComponent, NzSelectComponent } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { NzIconDirective } from 'ng-zorro-antd/icon';

/**
 * 支持对象形式的select
 */
@Component({
    selector: 'sf-select',
    templateUrl: './select.widget.html',
    preserveWhitespaces: false,
    encapsulation: ViewEncapsulation.None,
    imports: [DelonFormModule, NzSelectComponent, FormsModule, NzOptionComponent, NzOptionGroupComponent, NgIf, NgForOf, NzIconDirective]
})
export class ApiSelectWidget extends SelectWidget implements OnInit {
  static readonly KEY = 'api-select';

  /**
   * 给sf值的时候调用该方法
   *
   * @param value 组件值
   */
  override reset(value: SFValue): void {
    if (value instanceof Array) {
      value = value.map(i => this.normalize(i));
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
      }
    }
    return value;
  }

  override ngOnInit() {
    super.ngOnInit();
    if (this.ui['enumKey'] && this.ui.asyncData) {
      console.warn('enum和asyncData不可同时使用');
      return;
    }
    if (this.ui['enumKey']) {
      this.ui.asyncData = () => {
        return this.http.get(
          '/sys/dp/enums',
          {
            key: this.ui['enumKey']
          },
          CACHE_ENABLE
        );
      };
    }
  }

  private get http(): _HttpClient {
    return this.injector.get(_HttpClient);
  }
}
