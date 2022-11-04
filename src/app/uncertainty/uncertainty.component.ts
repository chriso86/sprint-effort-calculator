import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IRadioOption} from "../../shared/radio-button/radio-option";
import {ScaleEnum} from "../core/scale.enum";

@Component({
  selector: 'app-uncertainty',
  templateUrl: './uncertainty.component.html',
  styleUrls: ['./uncertainty.component.scss']
})
export class UncertaintyComponent implements OnInit {
  @Input() uncertainty?: IRadioOption;

  @Output() change: EventEmitter<IRadioOption> = new EventEmitter<IRadioOption>();

  public options: IRadioOption[] = [{
    label: 'None',
    value: ScaleEnum.none,
    data: 1,
    descriptiveItems: [
      'No unknowns',
      'All is known that can be known'
    ]
  }, {
    label: 'Low',
    value: ScaleEnum.low,
    data: 2,
    descriptiveItems: [
      'A few unknowns',
      'Almost everything is clean',
    ]
  }, {
    label: 'Medium',
    value: ScaleEnum.medium,
    data: 3,
    descriptiveItems: [
      'There are a good number of unknowns',
      'Research may be required'
    ]
  }, {
    label: 'High',
    value: ScaleEnum.high,
    data: 4,
    descriptiveItems: [
      'There is a lot of uncertainty',
      'Research is required in order to complete the task'
    ]
  }, {
    label: 'Extreme',
    value: ScaleEnum.extreme,
    data: 5,
    descriptiveItems: [
      'Almost nothing is certain',
      'Research is required in order to accomplish anything here'
    ]
  }];

  public ngOnInit(): void {
    this.setUncertainty(this.options[0]);
  }

  public setUncertainty(option: IRadioOption) {
    this.uncertainty = option;
    this.change.emit(option);
  }
}
