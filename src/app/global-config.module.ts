import {HttpClient} from '@angular/common/http';
import {
  Component,
  ComponentFactoryResolver,
  Injector,
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { throwIfAlreadyLoaded } from '@core';
import { STData } from '@delon/abc/st';
import { ErrorData } from '@delon/form/src/errors';
import { SFSelectWidgetSchema } from '@delon/form/src/widgets/select/schema';
import { DelonMockModule } from '@delon/mock';
import { AlainThemeModule } from '@delon/theme';
import { AlainConfig, ALAIN_CONFIG } from '@delon/util';
import {AlainACLType} from '@delon/util/config/acl/acl.type';

// Please refer to: https://ng-alain.com/docs/global-config
// #region NG-ALAIN Config

import { DelonACLModule } from '@delon/acl';


const alainConfigFactory = (injector: Injector, resolver: ComponentFactoryResolver, http: HttpClient): AlainConfig => {
  return {
    st: {
      modal: { size: 'lg' },
      pi: 0,
      ps: 20,
      req: {
        reName: {
          pi: 'page',
          ps: 'size',
        },
        type: 'page',
        // method: 'POST',
        allInBody: true,
        // 默认延迟加载
        lazyLoad: true,
      },
      res: {
        process: (data: STData[], rawData?: any): STData[] => {
          if (Array.isArray(rawData)){
            return rawData;
          }
          return rawData.rows;
        },
      },
      page: {
        showSize: true,
        pageSizes: [20, 50, 10, 200],
        showQuickJumper: true,
        total: true,
        zeroIndexed: true,
      },
      loadingDelay: 1000,
      singleSort: {
        nameSeparator: ',',
      },
      multiSort: {
        separator: ' ',
        nameSeparator: ',',
        arrayParam: true,
        global: false,
      },
    },
    sf: {
      autocomplete: 'off',
      button: {
        // submit: '搜索',
        // reset: '重置',
        // search: '搜索'
      },
      ui: {
        errors: {
          format(errorData: ErrorData): string {
            switch (errorData.params?.format) {
              case 'mobile':
                return '手机号格式不正确';
            }
            return '格式不正确';
          },
        },
        ...({
          resReName: 'id',
          urlReName: 'url',
          action: '/sys/file/upload',
        } as SFUploadWidgetSchema),
        ...({
          allowClear: true,
          // width: 200,
          // showSearch: true,
        } as SFSelectWidgetSchema),
      } as SFUISchemaItem,
    },
    pageHeader: { homeI18n: 'home' },
    lodop: {
      license: `A59B099A586B3851E0F0D7FDBF37B603`,
      licenseA: `C94CEE276DB2187AE6B65D56B3FC2848`,
    },
    cache: {
      expire: 60 * 10,
      prefix: 'cache_',
      // request(key): Observable<any>{
      //   // @ts-ignore
      //   let reqObj = key as object;
      //   // @ts-ignore
      //   return http.post(reqObj.url as string, reqObj.body as object);
      // }
    },
    auth: { login_url: '/passport/login', token_exp_offset: 0 },
    acl: {
      preCan: (roleOrAbility: number | number[] | string | string[] | AlainACLType): AlainACLType | null => {
        if(typeof roleOrAbility === 'string'){
          // @ts-ignore
          return { ability: Array.isArray(roleOrAbility)?roleOrAbility:[roleOrAbility]  }
        }
        // @ts-ignore
        return roleOrAbility
      }
    },
    image: {
      error: 'data:image/png;base64,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'
    } as AlainImageConfig
  }

};

const alainModules = [AlainThemeModule.forRoot(), DelonACLModule.forRoot(), DelonMockModule.forRoot()];
const alainProvides = [{ provide: ALAIN_CONFIG, useFactory: alainConfigFactory, deps: [Injector, ComponentFactoryResolver, HttpClient]  }];

// mock
import { environment } from '@env/environment';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import {Observable} from 'rxjs';
import * as MOCKDATA from '../../_mock';


if (!environment.production) {
  // alainConfig.mock = { data: MOCKDATA };
  DelonMockModule.forRoot({ data: MOCKDATA })
}

// #region reuse-tab
/**
 * 若需要[路由复用](https://ng-alain.com/components/reuse-tab)需要：
 * 1、在 `shared-delon.module.ts` 导入 `ReuseTabModule` 模块
 * 2、注册 `RouteReuseStrategy`
 * 3、在 `src/app/layout/default/default.component.html` 修改：
 *  ```html
 *  <section class="alain-default__content">
 *    <reuse-tab #reuseTab></reuse-tab>
 *    <router-outlet (activate)="reuseTab.activate($event)"></router-outlet>
 *  </section>
 *  ```
 */
// import { RouteReuseStrategy } from '@angular/router';
// import { ReuseTabService, ReuseTabStrategy } from '@delon/abc/reuse-tab';
// alainProvides.push({
//   provide: RouteReuseStrategy,
//   useClass: ReuseTabStrategy,
//   deps: [ReuseTabService],
// } as any);

// #endregion

// #endregion

// Please refer to: https://ng.ant.design/docs/global-config/en#how-to-use
// #region NG-ZORRO Config

// 全局变更加载中样式
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  template: `
    <ng-template #nzIndicatorTpl>
      <span class="ant-spin-dot">
        <i nz-icon [nzType]="'loading'"></i>
      </span>
    </ng-template>
  `,
})
export class SpinLoadingComponent {
  @ViewChild('nzIndicatorTpl', { static: true })
  nzIndicator!: TemplateRef<void>;
}

const nzConfigFactory = (injector: Injector, resolver: ComponentFactoryResolver): NzConfig => {
  const factory = resolver.resolveComponentFactory(SpinLoadingComponent);
  const { nzIndicator } = factory.create(injector).instance;
  return {
    spin: {
      // 先不变更
      nzIndicator,
    },
  };
};

import { NzConfig, NZ_CONFIG } from 'ng-zorro-antd/core/config';
import { SFUISchemaItem, SFUploadWidgetSchema, UploadWidget } from '@delon/form';
import {AlainImageConfig} from "@delon/util/config/abc";

const zorroProvides = [{ provide: NZ_CONFIG, useFactory: nzConfigFactory, deps: [Injector, ComponentFactoryResolver] }];

// #endregion

@NgModule({
  declarations: [SpinLoadingComponent],
  imports: [...alainModules, NzIconModule],
  providers: [{ provide: ALAIN_CONFIG, useFactory: alainConfigFactory }],
})
export class GlobalConfigModule {
  constructor(@Optional() @SkipSelf() parentModule: GlobalConfigModule) {
    throwIfAlreadyLoaded(parentModule, 'GlobalConfigModule');
  }

  static forRoot(): ModuleWithProviders<GlobalConfigModule> {
    return {
      ngModule: GlobalConfigModule,
      providers: [...alainProvides, ...zorroProvides],
    };
  }
}
