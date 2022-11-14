import {Component} from '@angular/core';
import {IRadioOption} from "../shared/radio-button/radio-option";
import {Store} from "@ngxs/store";
import {UpdateSettings} from "./core/app.actions";
import {IAppSettings} from "./core/app-settings.interface";
import {LocalStorageHelper} from "./core/local-storage.helper";

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
  public state!: IAppSettings;

  private readonly fibonnaciSequence: number[] = [];

  constructor(
    private store: Store
  ) {
    const savedSettings = LocalStorageHelper.GetItem<IAppSettings>('settings');

    this.store.select(s => this.state = s.app);
    this.fibonnaciSequence = this.getFibonacciNumbers();

    console.log(savedSettings, 'SAVED SETTINGS');

    if (savedSettings) {
      this.updateAppSettings(savedSettings);
    }
  }

  public get totalWeightedPercentage(): number {
    const weightings = this.state.weightings;

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
    requestAnimationFrame(() => {
      if (this.totalWeightedPercentage !== 1) {
        return;
      }

      if (this.complexity && this.workload && this.risk && this.uncertainty) {
        const complexityValue = this.complexity.data * (this.state.weightings.complexity / 100);
        const workloadValue = this.workload.data * (this.state.weightings.workload / 100);
        const riskValue = this.risk.data * (this.state.weightings.risk / 100);
        const uncertaintyValue = this.uncertainty.data * (this.state.weightings.uncertainty / 100);
        const score = complexityValue + workloadValue + riskValue + uncertaintyValue;
        const lowestScore = this.state.effort.lowest;
        const highestScore = this.state.effort.highest;
        const lowestScoreIndex = this.fibonnaciSequence.indexOf(lowestScore);
        const highestScoreIndex = this.fibonnaciSequence.indexOf(highestScore);
        const limitedSequence = this.fibonnaciSequence.slice(lowestScoreIndex, highestScoreIndex + 1); // Slice removes just before the last index
        const increment = 5 / limitedSequence.length; // We have 5 levels of measure
        let index = 0;
        const mappings = limitedSequence.reduce((memo: Map<number, number>, item: number) => {
          memo.set(+index.toFixed(1), item);
          index = index + increment;

          return memo;
        }, new Map<number, number>());
        const rangeIndexes = [
          ...Array.from(mappings.keys()),
          5
        ];
        let correctedScore = +(score * increment).toFixed(1);

        correctedScore = (correctedScore === rangeIndexes[1])
          ? correctedScore - .1
          : (correctedScore === rangeIndexes[rangeIndexes.length - 2])
            ? correctedScore + .1
            : correctedScore;

        correctedScore = +correctedScore.toFixed(1);

        const matchingIndex = rangeIndexes.find((rangeIndex: number, arrIndex: number, arr: number[]) => {
          return correctedScore > rangeIndex && correctedScore <= arr[arrIndex + 1];
        }) ?? 0;

        console.log(complexityValue, 'COMPLEXITY');
        console.log(workloadValue, 'WORKLOAD');
        console.log(riskValue, 'RISK');
        console.log(uncertaintyValue, 'UNCERTAINTY');
        console.log(matchingIndex, 'MATCHING INDEX');
        console.log(rangeIndexes, 'RANGE INDEXES');
        console.log(lowestScore, 'LOWEST SCORE');
        console.log(lowestScoreIndex, 'LOWEST SCORE INDEX');
        console.log(highestScore, 'HIGHEST SCORE');
        console.log(highestScoreIndex, 'HIGHEST SCORE INDEX');
        console.log(correctedScore, 'SCORE');
        console.log(this.fibonnaciSequence, 'WHOLE SEQUENCE');
        console.log(limitedSequence, 'LIMITED SEQUENCE');
        console.log(mappings, 'MAPPINGS');

        this.score = mappings.get(matchingIndex);
      }
    });
  }

  public downLowestSprintStep(event: Event) {
    this.preventAll(event);

    const currentFibonacciValue = this.state.effort.lowest;
    const lowestValue = 1;

    if (currentFibonacciValue <= lowestValue) {
      this.state.effort.lowest = lowestValue;
    } else {
      const nextValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) + 1];

      this.state.effort.lowest = nextValue - currentFibonacciValue;
    }
  }

  public upLowestSprintStep(event: Event) {
    this.preventAll(event);

    const currentFibonacciValue = this.state.effort.lowest;
    const highestValue = this.fibonnaciSequence[this.fibonnaciSequence.length - 1];

    requestAnimationFrame(() => {
      if (currentFibonacciValue >= highestValue) {
        this.state.effort.lowest = highestValue;
      } else {
        const lastValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) - 1];

        this.state.effort.lowest = lastValue + currentFibonacciValue;
      }
    })
  }

  public downHighestSprintStep(event: Event) {
    this.preventAll(event);

    const currentFibonacciValue = this.state.effort.highest;
    const lowestValue = 1;

    if (currentFibonacciValue <= lowestValue) {
      this.state.effort.highest = lowestValue;
    } else {
      const nextValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) + 1];

      this.state.effort.highest = nextValue - currentFibonacciValue;
    }
  }

  public upHighestSprintStep(event: Event) {
    this.preventAll(event);

    const currentFibonacciValue = this.state.effort.highest;
    const highestValue = this.fibonnaciSequence[this.fibonnaciSequence.length - 1];

    if (currentFibonacciValue >= highestValue) {
      this.state.effort.lowest = highestValue;
    } else {
      const lastValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) - 1];

      this.state.effort.lowest = lastValue + currentFibonacciValue;
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

    numbers.shift(); // Remove the duplicate 1

    return numbers;
  }

  public updateModels() {
    requestAnimationFrame(() => {
      this.updateAppSettings({
        weightings: this.state.weightings,
        effort: this.state.effort
      });
      this.updateScore();
    });
  }

  private updateAppSettings(settings: IAppSettings) {
    this.store.dispatch(new UpdateSettings(settings));
  }
}
