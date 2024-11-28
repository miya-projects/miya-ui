import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DelonFormModule, SFValue } from '@delon/form';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzUploadChangeParam, NzUploadComponent, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import {EMPTY, Observable, of} from 'rxjs';
import { UploadWidget } from '@delon/form/widgets/upload';

import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzButtonComponent } from 'ng-zorro-antd/button';

/**
 * 1. 规范化文件对象，方便回显内容
 * 2. 文件预览逻辑
 */
@Component({
  selector: 'sf-upload',
  templateUrl: './upload.widget.html',
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None,
  imports: [DelonFormModule, NzUploadComponent, NgSwitch, NgSwitchDefault, NgSwitchCase, NzIconDirective, NzButtonComponent],
  standalone: true
})
export class ApiuploadWidget extends UploadWidget implements OnInit {
  static readonly KEY1 = 'api-upload';

  /**
   * 给upload赋值的时候调用该方法
   *
   * @param value 组件值
   */
  override reset(value: SFValue): void {
    if (value == null) {
      super.reset(value);
      return;
    }
    if (value instanceof Array) {
      value = value.map(i => this.normalize(i));
    } else {
      value = [this.normalize(value)];
    }
    super.reset(value);
    if (this.i.limitFileCount > 1) {
      this.setValue(value.map((i: any) => i.response.id));
      return;
    }
    this.setValue(value[0]?.response?.id);
  }

  handleChange(e: NzUploadChangeParam) {
    this.change(e);
    if (e.type === 'success' || e.type === 'removed') {
      if (this.i.limitFileCount > 1) {
        this.setValue(e.fileList.map(i => i.response.id));
        return;
      }
      this.setValue(e.fileList[0]?.response?.id);
    }
  }

  /**
   * 格式修正
   *
   * @param value
   */
  normalize(value: any): NzUploadFile {
    if (value.__proto__ === Object.prototype) {
      return {
        uid: value.id,
        name: value.name,
        showDownload: true,
        status: 'done',
        response: value,
        url: value.url
      } as NzUploadFile;
    }
    return {
      uid: '0',
      name: `${value.substring(value.lastIndexOf('/') + 1, value.length)}`,
      showDownload: true,
      status: 'done',
      response: value,
      url: value
    } as NzUploadFile;
  }

  override change(args: NzUploadChangeParam) {
    super.change(args);
    const {file, fileList, type} = args;
    if (type === 'error') {
      this.formProperty.setErrors({
        keyword: "上传失败",
        // message: "上传失败提示信息"
      })
      return;
    }
    if (fileList.length === 0) {
      if (this.i.multiple) {
        this.formProperty.setValue([], false);
      } else {
        this.formProperty.setValue(null, false);
      }
      return;
    }

    let data = this.ui.data;
    let dataObservable: Observable<any>;
    if (typeof data === 'function') {
      let dataResult = (data as (file: NzUploadFile) => {} | Observable<{}>)(fileList[0]);
      if (dataResult instanceof Observable) {
        dataObservable = dataResult;
      } else {
        dataObservable = of(dataResult);
      }
    } else {
      dataObservable = of(data);
    }
    dataObservable.subscribe(i => {
      if (i?.formatType === 'Object') {
        this.formProperty.setValue(fileList[0]?.response?.id, false);
      } else {
        this.formProperty.setValue(
          fileList.map(f => f.response?.id),
          false
        );
      }
    });
  }

  private IMAGE_SUFFIX = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];

  override handlePreview = (file: NzUploadFile) => {
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
    let suffix = name.substring(name.lastIndexOf('.') + 1);
    if (this.IMAGE_SUFFIX.indexOf(suffix) == -1 && suffix != '默认头像') {
      this.injector.get(NzMessageService).error('只支持预览图像');
      return;
    }
    this.injector.get<NzModalService>(NzModalService).create({
      nzContent: `<img src="${_url}" class="img-fluid"  alt="${file.name}"/>`,
      nzFooter: null
    });
  };
}
