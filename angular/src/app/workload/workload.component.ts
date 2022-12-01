import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IRadioOption} from "../../shared/radio-button/radio-option";
import {ScaleEnum} from "../core/scale.enum";

@Component({
  selector: 'app-workload',
  templateUrl: './workload.component.html',
  styleUrls: ['./workload.component.scss']
})
export class WorkloadComponent implements OnInit {
  @Input() workload?: IRadioOption;
  @Input() disabled: boolean = false;

  @Output() change: EventEmitter<IRadioOption> = new EventEmitter<IRadioOption>();

  public options: IRadioOption[] = [{
    label: 'None',
    value: ScaleEnum.none,
    data: 1,
    descriptiveItems: [
      'Work is not demanding at all',
      'No time at all'
    ]
  }, {
    label: 'Low',
    value: ScaleEnum.low,
    data: 2,
    descriptiveItems: [
      'Minimal effort required to stay on top of the situation',
      'It will take a little time'
    ]
  }, {
    label: 'Medium',
    value: ScaleEnum.medium,
    data: 3,
    descriptiveItems: [
      'Work demanding but manageable with moderate effort',
      'Will take a moderate amount of work'
    ]
  }, {
    label: 'High',
    value: ScaleEnum.high,
    data: 4,
    descriptiveItems: [
      'Very busy but able to manage the work',
      'A large amount of work must be completed'
    ]
  }, {
    label: 'Extreme',
    value: ScaleEnum.extreme,
    data: 5,
    descriptiveItems: [
      'Extreme effort and concentration required to complete the work',
      'A very large amount of work needs to be completed'
    ]
  }];

  public ngOnInit(): void {
    requestAnimationFrame(() => {
      this.setWorkload(this.options[0]);
    });
  }

  public setWorkload(option: IRadioOption) {
    this.workload = option;
    this.change.emit(option);
  }
}
