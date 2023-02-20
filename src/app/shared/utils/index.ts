import {addDays} from 'date-fns';

/**
 * 遍历一颗树
 *
 * @param data  待遍历数据
 * @param callback  遍历每个数据执行的回调
 */
export function browseTree(data: any[], callback: Function): void {
  data.forEach((r) => {
    callback(r);
    if (r.children) {
      browseTree(r.children, callback);
    }
  });
}


const of = (label: string, range: Date[]) => {
  let o: { [key: string]: Date[] } = {};
  o[label] = range;
  return o;
}
/**
 * 日期范围快捷方式定义
 */
export const DATE_RANGES = {
  TODAY: of("今天", [new Date(), new Date()]),
  YESTERDAY: of("昨天", [addDays(new Date(), -1), addDays(new Date(), -1)]),
  /**
   * 近7天
   */
  DAYS7: of("近7天", [addDays(new Date(), -7), new Date()]),
  /**
   * 近30天
   */
  DAYS30: of("近30天", [addDays(new Date(), -30), new Date()]),
}

/**
 * 调用下载文件
 * @param filename  弹出下载框默认的文件名
 * @param byte  文件二进制流
 */
export function download(filename: string, byte: Blob): void {
  const a = document.createElement("a");
  a.download = filename;
  a.href = window.URL.createObjectURL(byte as Blob);
  a.click();
}

/**
 * 去除对象中指定key之外的所有key， omit({a:1,b:2}, 'a') => {a: 1}
 * @param obj   去除的对象
 * @param ignoreKys 忽略的key
 * @return 一个新对象
 */
export function omit(obj: {
  [key: string]: any
}, ignoreKys: string[]): object {
  let result: {
    [key: string]: any
  } = {};
  for (let i = 0; i < ignoreKys.length; i++) {
    result[ignoreKys[i]] = obj[ignoreKys[i]];
  }
  return result;
}

