/**
 * 所有左侧菜单在此注册
 */
import { Menu } from '@delon/theme/src/services/menu/interface';
import { environment } from '@env/environment';

const data: Menu[] = [
  {
    text: '主导航',
    group: true,
    children: [
      {
        text: 'Dashboard',
        link: '/dashboard',
        icon: { type: 'icon', value: 'appstore' },
      },
      {
        text: '系统',
        icon: { type: 'icon', value: 'tool' },
        acl: 'sys',
        children: [
          {
            text: '用户',
            link: '/sys/user',
            icon: { type: 'icon', value: 'user' },
            acl: 'sys:user:view',
          },
          {
            text: '角色',
            link: '/sys/role',
            icon: { type: 'icon', value: 'team' },
            acl: 'sys:role:view',
          },
          {
            text: '部门',
            link: '/sys/department',
            icon: { type: 'icon', value: 'team' },
            acl: 'sys:department:view',
          },
          {
            text: '参数',
            link: '/sys/config',
            icon: { type: 'icon', value: 'setting' },
            acl: 'sys:config:view',
          },
          {
            text: '日志',
            link: '/sys/log',
            icon: { type: 'iconfont', iconfont: 'icon-log' },
            acl: 'sys:log:view',
          },
          {
            text: '字典',
            link: '/sys/dict',
            icon: { type: 'icon', value: 'book' },
            acl: 'sys:dict:view',
          },
          {
            text: '通知',
            link: '/sys/notice',
            icon: { type: 'icon', value: 'tool' },
            hide: true,
          },
          {
            text: '开发',
            link: '/sys/document',
            icon: { type: 'icon', value: 'bars' },
            acl: 'sys:develop',
            _open: true,
            children: [
              {
                text: '接口文档',
                externalLink: environment.SERVER_URL.replace('api', 'doc.html'),
                target: '_blank',
                icon: { type: 'iconfont', iconfont: 'icon-document' },
              },
              {
                text: 'Ng-alain演示站',
                externalLink: 'https://ng-alain.gitee.io/#/dashboard/v1',
                target: '_blank',
                icon: { type: 'iconfont', iconfont: 'icon-demo' },
              },
              {
                text: '文档',
                externalLink: 'https://ng-alain.gitee.io/#/dashboard/v1',
                target: '_blank',
                icon: { type: 'iconfont', iconfont: 'icon-document' },
                children: [
                  {
                    text: 'Ng-Alain',
                    externalLink: 'https://ng-alain.com/docs/getting-started/zh',
                    target: '_blank',
                    icon: { type: 'img', value: 'https://ng-alain.com/assets/img/logo-color.svg' },
                  },
                  {
                    text: 'Ng-Zorro',
                    externalLink: 'https://ng.ant.design/components/overview/zh',
                    target: '_blank',
                    icon: { type: 'img', value: 'https://ng.ant.design/assets/img/logo.svg' },
                  }
                ]
              },
              {
                text: '源码',
                externalLink: 'https://ng-alain.gitee.io/#/dashboard/v1',
                target: '_blank',
                icon: { type: 'iconfont', iconfont: 'icon-source' },
                children: [
                  {
                    text: 'Ng-Alain',
                    externalLink: 'https://github1s.com/ng-alain/ng-alain/',
                    target: '_blank',
                    icon: { type: 'img', value: 'https://ng-alain.com/assets/img/logo-color.svg' },
                  },
                  {
                    text: 'Delon',
                    externalLink: 'https://github1s.com/ng-alain/delon',
                    target: '_blank',
                  },
                  {
                    text: 'Ng-Zorro-antd',
                    externalLink: 'https://github1s.com/NG-ZORRO/ng-zorro-antd',
                    target: '_blank',
                  },
                ]
              },
            ],
          },
        ]
      },
    ],
  },
];

export default data;
