import { Component, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzInputDirective } from 'ng-zorro-antd/input/input.directive';

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => PasswordComponent),
  multi: true
};

@Component({
  selector: 'app-com-password',
  templateUrl: './password.component.html',
  styles: [
    `
      i {
        cursor: pointer;
      }
    `
  ],
  providers: [EXE_COUNTER_VALUE_ACCESSOR]
})
export class PasswordComponent implements OnInit, ControlValueAccessor {
  passwordVisible = false;

  @Input('value')
  public value?: string;

  @Input('placeholder')
  placeholder: any = '';

  @ViewChild('inputElement')
  inputElement!: NzInputDirective;

  onChange: any;

  constructor() {}

  ngOnInit(): void {}

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {}

  writeValue(obj: any): void {
    this.value = obj;
  }
}
