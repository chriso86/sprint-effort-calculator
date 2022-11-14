import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IRadioOption} from "../../shared/radio-button/radio-option";
import {ScaleEnum} from "../core/scale.enum";

@Component({
  selector: 'app-complexity',
  templateUrl: './complexity.component.html',
  styleUrls: ['./complexity.component.scss']
})
export class ComplexityComponent implements OnInit {
  @Input() complexity?: IRadioOption;

  @Output() change: EventEmitter<IRadioOption> = new EventEmitter<IRadioOption>();

  public options: IRadioOption[] = [{
    label: 'None',
    value: ScaleEnum.none,
    data: 1,
    descriptiveItems: [
      'No problem',
      'Basic practice'
    ]
  }, {
    label: 'Low',
    value: ScaleEnum.low,
    data: 2,
    descriptiveItems: [
      'Simple problem',
      'Well known standard procedures and practices',
      'No special resources or procedures'
    ]
  }, {
    label: 'Medium',
    value: ScaleEnum.medium,
    data: 3,
    descriptiveItems: [
      'Complicated problem',
      'Manageable with standard procedures and practices',
      'Need of analysis and coordination'
    ]
  }, {
    label: 'High',
    value: ScaleEnum.high,
    data: 4,
    descriptiveItems: [
      'Complicated problem',
      'Exceeds the ordinary capacity of the individual',
      'Requires extra resources'
    ]
  }, {
    label: 'Extreme',
    value: ScaleEnum.extreme,
    data: 5,
    descriptiveItems: [
      'Complex problem',
      'Exceeds the ordinary capacity of the individual',
      'Requires extra resources',
      'Requires innovation'
    ]
  }];

  public ngOnInit(): void {
    requestAnimationFrame(() => {
      this.setComplexity(this.options[0]);
    });
  }

  public setComplexity(option: IRadioOption) {
    this.complexity = option;
    this.change.emit(option);
  }
}
