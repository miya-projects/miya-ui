import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

import { ConfigAble } from './configable';

/**
 * 用户偏好配置
 */
@Injectable({
  providedIn: 'root'
})
export class PreferencesService {
  // 当前用户的偏好配置
  private preferences: object = {};

  constructor(private http: _HttpClient) {
    // this.monitorSrv.isLoading();
  }

  /**
   * 保存配置
   * @param key
   * @param value
   */
  save(key: string, value: any) {
    let item: { [key: string]: any } = {};
    item[key] = value;
    Object.assign(this.preferences, item);
    this.http
      .put('/sys/user/current/preferences', {
        preferences: JSON.stringify(this.preferences)
      })
      .subscribe(res => {});
  }

  /**
   * 获取配置
   * @param key
   */
  get(key: string): any {
    // @ts-ignore
    return this.preferences[key];
  }

  /**
   * 获取配置的一部分，支持动态保存
   * @param key
   */
  getPreferences(key: string): ConfigAble {
    let get = this.get.bind(this);
    let save = this.save.bind(this, key);
    return {
      getValue() {
        return get(key);
      },
      saveValue(value: any) {
        save(value);
      }
    };
  }

  /**
   * 注册配置, 注册后，根据onChange事件来自动保存配置内容
   * @param key
   * @param onChange 配置更新观察者
   */
  registerConfig(key: string, onChange: Observable<any>) {
    onChange.subscribe(value => {
      this.save(key, value);
    });
  }

  // 初始化
  init(preferences: string) {
    this.preferences = JSON.parse(preferences);
  }
}
