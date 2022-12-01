import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { ArrowIconButtonComponent } from './arrow-icon-button/arrow-icon-button.component';
import { ButtonComponent } from './button/button.component';
import {SecFlexLayoutModule} from "./flex-layout.module";
import {FormsModule} from "@angular/forms";
import {MatTooltipModule} from "@angular/material/tooltip";

@NgModule({
  declarations: [
    RadioButtonComponent,
    ArrowIconButtonComponent,
    ButtonComponent
  ],
  imports: [
    CommonModule,
    SecFlexLayoutModule
  ],
  exports: [
    RadioButtonComponent,
    ArrowIconButtonComponent,
    SecFlexLayoutModule,
    FormsModule,
    MatTooltipModule,
    ButtonComponent
  ]
})
export class SharedModule {
}
