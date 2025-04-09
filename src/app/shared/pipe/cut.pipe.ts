import { Pipe, PipeTransform } from '@angular/core';

/**
 * 数据截断
 */
@Pipe({
    name: 'cut',
    standalone: false
})
export class CutPipe implements PipeTransform {
  /**
   * 数据截断函数
   *
   * @param value 原始值
   * @param length  最多保留长度
   */
  transform(value: string, length: number): string {
    value = value || '';
    return value.substr(0, length);
  }
}
