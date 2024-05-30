import { HttpContextToken } from '@angular/common/http';

/**
 * 在http请求中，需要原始返回数据。默认会返回body.data，为false
 */
export const ORIGIN_BODY: HttpContextToken<boolean> = new HttpContextToken<boolean>(() => false);
