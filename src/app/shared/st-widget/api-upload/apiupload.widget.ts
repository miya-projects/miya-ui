import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {ControlWidget, SelectWidget, SFValue, UploadWidget} from '@delon/form';
import {NzModalService} from 'ng-zorro-antd/modal';
import {NzUploadFile} from 'ng-zorro-antd/upload';

/**
 * 1. 规范化文件对象，方便回显内容
 * 2. 文件预览逻辑
 */
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'sf-upload',
  templateUrl: './upload.widget.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
})
// tslint:disable-next-line:component-class-suffix
export class ApiuploadWidget extends UploadWidget implements OnInit {
  static readonly KEY = 'api-upload';

  /**
   * 给upload赋值的时候调用该方法
   * @param value 组件值
   */
  reset(value: SFValue): void {
    if (value == null){
      super.reset(value);
      return;
    }
    if (value instanceof Array) {
      value = value.map(i => this.normalize(i));
    } else {
      value = [this.normalize(value)];
    }
    super.reset(value);
  }

  setValue(value: SFValue) {
    if (value == null){
      super.setValue(value);
      return;
    }
    if (value instanceof Array) {
      value = value.map(i => this.normalize(i));
    } else {
      value = [this.normalize(value)];
    }
    super.setValue(value);
  }

  /**
   * 格式修正
   * @param value
   */
  normalize(value: any): NzUploadFile {
    if (value.__proto__ === Object.prototype) {
      return {
        uid: value.id,
        name: value.name,
        showDownload: true,
        status: 'done',
        response: value
      } as NzUploadFile
    }
    return value;
  }

  private IMAGE_SUFFIX = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];

  handlePreview = (file: NzUploadFile) => {
    if (this.ui.preview) {
      this.ui.preview(file);
      return;
    }
    const _url = file.thumbUrl || file.url;
    if (!_url) {
      return;
    }
    // 只支持预览图像
    let name = file.name;
    let suffix = name.substring(name.lastIndexOf('.')+1)
    if (this.IMAGE_SUFFIX.indexOf(suffix) != -1){
      this.injector.get<NzModalService>(NzModalService).create({
        nzContent: `<img src="${_url}" class="img-fluid"  alt="${file.name}"/>`,
        nzFooter: null
      });
    }

  };
}
