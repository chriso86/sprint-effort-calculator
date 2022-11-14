import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IRadioOption} from "../../shared/radio-button/radio-option";
import {ScaleEnum} from "../core/scale.enum";

@Component({
  selector: 'app-risk',
  templateUrl: './risk.component.html',
  styleUrls: ['./risk.component.scss']
})
export class RiskComponent implements OnInit {
  @Input() risk?: IRadioOption;

  @Output() change: EventEmitter<IRadioOption> = new EventEmitter<IRadioOption>();

  public options: IRadioOption[] = [{
    label: 'None',
    value: ScaleEnum.none,
    data: 1,
    descriptiveItems: [
      'No risk',
      'Nothing can really go wrong'
    ]
  }, {
    label: 'Low',
    value: ScaleEnum.low,
    data: 2,
    descriptiveItems: [
      'Low risk',
      'Very little can go wrong, but there is small risk'
    ]
  }, {
    label: 'Medium',
    value: ScaleEnum.medium,
    data: 3,
    descriptiveItems: [
      'Moderate risk',
      'A fair amount can go wrong and cause damages'
    ]
  }, {
    label: 'High',
    value: ScaleEnum.high,
    data: 4,
    descriptiveItems: [
      'High risk',
      'Many things could go wrong and should be given careful focus'
    ]
  }, {
    label: 'Extreme',
    value: ScaleEnum.extreme,
    data: 5,
    descriptiveItems: [
      'Extreme risk',
      'Critical risk factor which should be managed carefully'
    ]
  }];

  public ngOnInit(): void {
    requestAnimationFrame(() => {
      this.setRisk(this.options[0]);
    });
  }

  public setRisk(option: IRadioOption) {
    this.risk = option;
    this.change.emit(option);
  }
}
