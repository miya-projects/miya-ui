// tslint:disable: no-duplicate-imports
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, Injector, LOCALE_ID, NgModule, Type } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { UEditorModule } from 'ngx-ueditor';

// #region default language
// Reference: https://ng-alain.com/docs/i18n
import { default as ngLang } from '@angular/common/locales/zh';
import { DELON_LOCALE, zh_CN as delonLang } from '@delon/theme';
import { zhCN as dateLang } from 'date-fns/locale';
import { NZ_DATE_LOCALE, NZ_I18N, zh_CN as zorroLang } from 'ng-zorro-antd/i18n';
const LANG = {
  abbr: 'zh',
  ng: ngLang,
  zorro: zorroLang,
  date: dateLang,
  delon: delonLang,
};
// register angular
import { registerLocaleData } from '@angular/common';
registerLocaleData(LANG.ng, LANG.abbr);
const LANG_PROVIDES = [
  { provide: LOCALE_ID, useValue: LANG.abbr },
  { provide: NZ_I18N, useValue: LANG.zorro },
  { provide: NZ_DATE_LOCALE, useValue: LANG.date },
  { provide: DELON_LOCALE, useValue: LANG.delon },
];
// #endregion

// #region JSON Schema form (using @delon/form)
import { JsonSchemaModule, SharedModule } from '@shared';
const FORM_MODULES = [JsonSchemaModule];
// #endregion

// #region Http Interceptors
import { DefaultInterceptor, StartupService } from '@core';
import { JWTInterceptor } from '@delon/auth';
const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: CacheInterceptor, multi: true },
];
// #endregion

// #region global third module
const GLOBAL_THIRD_MODULES: Array<Type<any>> = [];
// #endregion

// #region Startup Service
export function StartupServiceFactory(startupService: StartupService): () => Promise<void> {
  return () => startupService.load();
}
// const APPINIT_PROVIDES = [
  // StartupService,
  // {
  //   provide: APP_INITIALIZER,
  //   useFactory: StartupServiceFactory,
  //   deps: [StartupService],
  //   multi: true,
  // },
// ];
// #endregion

import { Observable } from 'rxjs';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import {CacheInterceptor} from './core/net/cache.interceptors';
import { GlobalConfigModule } from './global-config.module';
import { LayoutModule } from './layout/layout.module';
import { RoutesModule } from './routes/routes.module';
import {ComModule} from './shared/com/com.module';
import { STWidgetModule } from './shared/st-widget/st-widget.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    GlobalConfigModule.forRoot(),
    CoreModule,
    SharedModule,
    LayoutModule,
    RoutesModule,
    STWidgetModule,
    ComModule,
    NzMessageModule,
    NzNotificationModule,
    ...FORM_MODULES,
    ...GLOBAL_THIRD_MODULES,
    UEditorModule.forRoot({
      // **注：** 建议使用本地路径；以下为了减少 ng-alain 脚手架的包体大小引用了CDN，可能会有部分功能受影响
      js: [`//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.config.js`, `//apps.bdimg.com/libs/ueditor/1.4.3.1/ueditor.all.min.js`],
      options: {
        UEDITOR_HOME_URL: `//apps.bdimg.com/libs/ueditor/1.4.3.1/`,
      },
    }),
  ],
  providers: [...LANG_PROVIDES, ...INTERCEPTOR_PROVIDES],
  bootstrap: [AppComponent],
})
export class AppModule {}
