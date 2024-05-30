import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { TreetableComponent } from './treetable.component';

@Directive({
  selector: '[tree-row]'
})
export class TreeRowDirective implements OnInit {
  @Input('tree-row') id!: string;
  constructor(
    private readonly ref: TemplateRef<void>,
    public viewContainerRef: ViewContainerRef,
    private treeComponent: TreetableComponent
  ) {
    this.treeComponent = treeComponent;
    this.ref = ref;
  }

  ngOnInit(): void {
    for (let i = 0; i < this.treeComponent.columns.length; i++) {
      let column = this.treeComponent.columns[i];
      if (column.render && column.render === this.id) {
        column.__render = this.ref;
      }
    }
  }
}
