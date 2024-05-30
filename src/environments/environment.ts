// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import * as MOCKDATA from '@_mock';
import { mockInterceptor, provideMockConfig } from '@delon/mock';
import { Environment } from '@delon/theme';

export const environment = {
  production: false,
  useHash: false,
  api: {
    baseUrl: '/api',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  providers: [provideMockConfig({ data: MOCKDATA })],
  interceptorFns: [mockInterceptor],
  // iconfont symbol项目地址
  iconfont: '//at.alicdn.com/t/font_2463422_dx9oyvqdonv.js'
} as Environment;
