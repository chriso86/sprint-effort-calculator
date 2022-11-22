import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { ArrowIconButtonComponent } from './arrow-icon-button/arrow-icon-button.component';

@NgModule({
  declarations: [
    RadioButtonComponent,
    ArrowIconButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    RadioButtonComponent,
    ArrowIconButtonComponent
  ]
})
export class SharedModule {
}
