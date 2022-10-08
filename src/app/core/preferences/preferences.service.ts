import {Injectable} from "@angular/core";
import {_HttpClient} from "@delon/theme";

/**
 * 用户偏好配置
 */
@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  // 当前用户的偏好配置
  private preferences: object = {};

  constructor(
    private http: _HttpClient,
  ) {
    // this.monitorSrv.isLoading();
  }

  save(key: string, value: any) {
    let item: {[key:string]: any} = {};
    item[key] = value;
    Object.assign(this.preferences, item);
    this.http.put('/sys/user/current/preferences', {
      preferences: JSON.stringify(this.preferences)
    }).subscribe(res => {
      console.log(res)
    })
  }

  get(key: string): any {
    // @ts-ignore
    return this.preferences[key];
  }

  // 初始化
  init(preferences: string) {
    this.preferences = JSON.parse(preferences);
  }
}
