import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { STColumn } from '@delon/abc/st';
import { CACHE_ENABLE } from '../../../../core/net/cache.interceptors';

@Component({
    selector: 'app-system-enum-data',
    // templateUrl: './system-enum.component.html',
    template: `
    <st #st [data]="data" [columns]="columns" [page]="{ show: false }">
      <ng-template st-row="nameTpl" let-item let-index="index">
        <div nz-col [nzSpan]="6">
          <input *ngIf="item._edit" nz-input [(ngModel)]="item._label" />
          <ng-container *ngIf="!item._edit">{{ item.label }}</ng-container>
        </div>
      </ng-template>
      <ng-template st-row="valueTpl" let-item let-index="index" let-column="valueTpl">
        <div nz-col [nzSpan]="6">
          <input *ngIf="item._edit" nz-input [(ngModel)]="item._value" />
          <ng-container *ngIf="!item._edit">{{ item.value }}</ng-container>
        </div>
      </ng-template>
    </st>
  `,
    styles: [],
    standalone: false
})
export class SystemEnumDataComponent implements OnInit {
  data: any;
  @Input('key')
  key!: string;

  columns: STColumn[] = [
    { title: '枚举描述', index: 'label', render: 'nameTpl' },
    { title: '枚举值', index: 'value', render: 'valueTpl' }
  ];

  constructor(private http: _HttpClient) {}

  ngOnInit(): void {
    this.reload();
  }

  /**
   * 加载数据
   */
  reload(): void {
    this.http.get(`/sys/dp/enums`, { key: this.key }, CACHE_ENABLE).subscribe(list => {
      this.data = list;
    });
  }
}

@Component({
    selector: 'app-system-enum',
    templateUrl: './system-enum.component.html',
    styles: [],
    standalone: false
})
export class SystemEnumComponent implements OnInit {
  data: any;

  constructor(private http: _HttpClient) {}

  ngOnInit(): void {
    this.reload();
  }

  /**
   * 加载数据
   * @private
   */
  reload(): void {
    this.http.get('/sys/dp/enumsKey').subscribe(list => {
      this.data = list;
    });
  }
}
