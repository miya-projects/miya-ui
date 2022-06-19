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
  let o: {[key: string]: Date[]} = {};
  o[label] = range;
  return o;
}
/**
 * 日期范围快捷方式定义
 */
export const DATE_RANGES = {
  TODAY: of("今天", [new Date(), new Date()]),
  YESTERDAY: of("昨天", [ addDays(new Date(), -1), addDays(new Date(), -1)]),
  /**
   * 近7天
   */
  DAYS7: of("近7天", [addDays(new Date(), -7), new Date()]),
  /**
   * 近30天
   */
  DAYS30: of("近30天", [addDays(new Date(), -30), new Date()]),
}
