import { Environment } from '@delon/theme';

export const environment = {
  production: true,
  useHash: false,
  api: {
    baseUrl: './backend/api',
    refreshTokenEnabled: true,
    refreshTokenType: 'auth-refresh'
  },
  // iconfont symbol项目地址
  iconfont: '//at.alicdn.com/t/font_2463422_dx9oyvqdonv.js'
} as Environment;
