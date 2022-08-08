import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SystemEnumComponent} from "./system-enum/system-enum.component";

const routes: Routes = [
  {path: 'system-enum', component: SystemEnumComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevelopRoutingModule {
}
