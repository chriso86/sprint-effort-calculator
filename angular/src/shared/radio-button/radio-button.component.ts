import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IRadioOption} from "./radio-option";

@Component({
  selector: 'app-radio-button',
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent {
  @Input() model?: IRadioOption;
  @Input() option!: IRadioOption;

  @Output() modelChange: EventEmitter<IRadioOption> = new EventEmitter<IRadioOption>();

  constructor() {
  }
}
