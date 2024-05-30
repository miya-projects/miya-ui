import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CutPipe } from './cut.pipe';

export const PIPES = [CutPipe];

@NgModule({
  declarations: PIPES,
  imports: [CommonModule],
  exports: [...PIPES]
})
export class PipeModule {
  constructor() {}
}
