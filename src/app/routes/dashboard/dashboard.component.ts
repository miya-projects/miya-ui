import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { PageHeaderModule } from '@delon/abc/page-header';
import { StartupService } from '@core';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [PageHeaderModule]
})
export class DashboardComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
