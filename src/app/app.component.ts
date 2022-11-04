import {Component, OnChanges, SimpleChanges} from '@angular/core';
import {IRadioOption} from "../shared/radio-button/radio-option";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public complexity?: IRadioOption;
  public workload?: IRadioOption;
  public risk?: IRadioOption;
  public uncertainty?: IRadioOption;
  public score?: number;

  public setComplexity(option: IRadioOption) {
    this.complexity = option;
    this.updateScore();
  }

  public setWorkload(option: IRadioOption) {
    this.workload = option;
    this.updateScore();
  }

  public setRisk(option: IRadioOption) {
    this.risk = option;
    this.updateScore();
  }

  public setUncertainty(option: IRadioOption) {
    this.uncertainty = option;
    this.updateScore();
  }

  public updateScore(): void {
    if (this.complexity && this.workload && this.risk && this.uncertainty) {
      const mappings = {
        1: 1,
        2: 2,
        3: 3,
        4: 5,
        5: 8
      };
      const getMapping = (value: any): number => {
        // @ts-ignore
        return mappings[value];
      }

      const complexityValue = getMapping(this.complexity.data);
      const workloadValue = getMapping(this.workload.data);
      const riskValue = getMapping(this.risk.data);
      const uncertaintyValue = getMapping(this.uncertainty.data);
      const values = [
        complexityValue,
        workloadValue,
        riskValue,
        uncertaintyValue
      ];
      const average = values.reduce((a, b) => a + b, 0) / values.length;

      if (average > 1.5 && average <= 3) {
        this.score = 3;
        return;
      }

      if (average > 3 && average <= 5) {
        this.score = 5;
        return;
      }

      if (average > 5 && average <= 8) {
        this.score = 8;
        return;
      }

      if ((average > 8 && average <= 13) || average > 13) {
        this.score = 13;
        return;
      }

      this.score = 1;
    }
  }
}
