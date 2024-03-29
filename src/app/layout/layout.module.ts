import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { NoticeIconModule } from '@delon/abc/notice-icon';
import { LayoutDefaultModule } from '@delon/theme/layout-default';
import { SettingDrawerModule } from '@delon/theme/setting-drawer';
import { ThemeBtnModule } from '@delon/theme/theme-btn';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpinModule } from 'ng-zorro-antd/spin';

import { LayoutBasicComponent } from './basic/basic.component';
import { HeaderClearStorageComponent } from './basic/widgets/clear-storage.component';
import { HeaderFullScreenComponent } from './basic/widgets/fullscreen.component';
import { HeaderNotifyComponent } from './basic/widgets/notify.component';
import { HeaderSearchComponent } from './basic/widgets/search.component';
import { HeaderUserComponent } from './basic/widgets/user.component';
import { LayoutBlankComponent } from './blank/blank.component';

const COMPONENTS = [LayoutBasicComponent, LayoutBlankComponent];

const HEADERCOMPONENTS = [
  HeaderSearchComponent,
  HeaderFullScreenComponent,
  HeaderClearStorageComponent,
  HeaderUserComponent,
  HeaderNotifyComponent,
];

// passport
import { LayoutPassportComponent } from './passport/passport.component';
import {NzButtonModule} from "ng-zorro-antd/button";
import {_HttpClient} from "@delon/theme";
const PASSPORT = [LayoutPassportComponent];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ThemeBtnModule,
        SettingDrawerModule,
        LayoutDefaultModule,
        NoticeIconModule,
        GlobalFooterModule,
        NzDropDownModule,
        NzInputModule,
        NzAutocompleteModule,
        NzGridModule,
        NzFormModule,
        NzSpinModule,
        NzBadgeModule,
        NzAvatarModule,
        NzIconModule,
        NzButtonModule,
    ],
  declarations: [...COMPONENTS, ...HEADERCOMPONENTS, ...PASSPORT],
  exports: [...COMPONENTS, ...PASSPORT],
  providers: [_HttpClient]
})
export class LayoutModule {}
