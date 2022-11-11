import {Component} from '@angular/core';
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
  public isAdvancedSettingsOpen = false;
  public weightings = {
    complexity: 25,
    workload: 25,
    risk: 25,
    uncertainty: 25
  };
  public effort = {
    lowest: 1,
    highest: 13
  };

  private fibonnaciSequence: number[] = [];

  constructor() {
    this.fibonnaciSequence = this.getFibonacciNumbers();
  }

  public get totalWeightedPercentage(): number {
    const weightings = this.weightings;

    return (weightings.complexity * 0.01)
      + (weightings.workload * 0.01)
      + (weightings.risk * 0.01)
      + (weightings.uncertainty * 0.01)
  }

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

  public downLowestSprintStep(event: Event) {
    this.preventAll(event);

    const currentFibonacciValue = this.effort.lowest;
    const lowestValue = 1;

    if (currentFibonacciValue <= lowestValue) {
      this.effort.lowest = lowestValue;
    } else {
      const nextValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) + 1];

      this.effort.lowest = nextValue - currentFibonacciValue;
    }
  }

  public upLowestSprintStep(event: Event) {
    this.preventAll(event);

    const currentFibonacciValue = this.effort.lowest;
    const highestValue = this.fibonnaciSequence[this.fibonnaciSequence.length - 1];

    requestAnimationFrame(() => {
      if (currentFibonacciValue >= highestValue) {
        this.effort.lowest = highestValue;
      } else {
        const lastValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) - 1];

        this.effort.lowest = lastValue + currentFibonacciValue;
      }
    })
  }

  public downHighestSprintStep(event: Event) {
    this.preventAll(event);

    const currentFibonacciValue = this.effort.highest;
    const lowestValue = 1;

    if (currentFibonacciValue <= lowestValue) {
      this.effort.highest = lowestValue;
    } else {
      const nextValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) + 1];

      this.effort.highest = nextValue - currentFibonacciValue;
    }
  }

  public upHighestSprintStep(event: Event) {
    this.preventAll(event);

    const currentFibonacciValue = this.effort.highest;
    const highestValue = this.fibonnaciSequence[this.fibonnaciSequence.length - 1];

    if (currentFibonacciValue >= highestValue) {
      this.effort.lowest = highestValue;
    } else {
      const lastValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) - 1];

      this.effort.lowest = lastValue + currentFibonacciValue;
    }
  }

  private preventAll(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private getFibonacciNumbers() {
    const numbers = [1, 1];
    const upperCalculationLimit = 10; // Increment 100 times
    let j = 1;

    while (j <= upperCalculationLimit) {
      numbers.push(numbers[j - 1] + numbers[j]);
      j++;
    }

    return numbers;
  }
}
