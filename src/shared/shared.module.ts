import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radio-button/radio-button.component';

@NgModule({
  declarations: [
    RadioButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RadioButtonComponent
  ]
})
export class SharedModule {
}
