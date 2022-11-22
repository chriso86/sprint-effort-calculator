import {Component} from '@angular/core';
import {IRadioOption} from "../shared/radio-button/radio-option";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {UpdateSettings} from "./core/app.actions";
import {IAppSettings, IEffort, IWeightings} from "./core/app-settings.interface";
import {LocalStorageHelper} from "./core/local-storage.helper";
import {Observable} from "rxjs";
import {AppState} from "./core/app.state";

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
  public weightings!: IWeightings;
  public effort!: IEffort;
  public scoreMappings?: Map<number, number> = new Map<number, number>();

  @Select(AppState.weightings) weightings$!: Observable<IWeightings>;
  @Select(AppState.effort) effort$!: Observable<IEffort>;

  private readonly fibonnaciSequence: number[] = [];

  constructor(
    private store: Store,
    private actions$: Actions
  ) {
    const savedSettings = LocalStorageHelper.GetItem<IAppSettings>('settings');

    this.fibonnaciSequence = this.getFibonacciNumbers();

    this.weightings$.subscribe((weightings: IWeightings) => {
      this.weightings = weightings;
    });
    this.effort$.subscribe((effort: IEffort) => {
      this.effort = effort;
    });

    this.actions$
      .pipe(
        ofActionSuccessful(UpdateSettings)
      )
      .subscribe(() => {
        this.updateScore();
      })

    if (savedSettings) {
      this.updateAppSettings(savedSettings);
    }
  }

  public get calculatedComplexity(): number {
    return (this.complexity?.data ?? 0) * (this.weightings.complexity / 100);
  }

  public get calculatedWorkload(): number {
    return (this.workload?.data ?? 0) * (this.weightings.workload / 100);
  }

  public get calculatedRisk(): number {
    return (this.risk?.data ?? 0) * (this.weightings.risk / 100);
  }

  public get calculatedUncertainty(): number {
    return (this.uncertainty?.data ?? 0) * (this.weightings.uncertainty / 100);
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

  public setComplexityWeighting(event: Event) {
    this.updateWeightings('complexity', (event.target as HTMLInputElement).value);
  }

  public setWorkloadWeighting(event: Event) {
    this.updateWeightings('workload', (event.target as HTMLInputElement).value);
  }

  public setRiskWeighting(event: Event) {
    this.updateWeightings('risk', (event.target as HTMLInputElement).value);
  }

  public setUncertaintyWeighting(event: Event) {
    this.updateWeightings('uncertainty', (event.target as HTMLInputElement).value);
  }

  public updateScore(): void {
    requestAnimationFrame(() => {
      if (this.totalWeightedPercentage !== 1) {
        return;
      }

      if (this.complexity && this.workload && this.risk && this.uncertainty) {
        const complexityValue = this.calculatedComplexity;
        const workloadValue = this.calculatedWorkload;
        const riskValue = this.calculatedRisk;
        const uncertaintyValue = this.calculatedUncertainty;
        const score = complexityValue + workloadValue + riskValue + uncertaintyValue;
        const scoreDifference = score / 5;
        const lowestScore = this.effort.lowest;
        const highestScore = this.effort.highest;
        const lowestScoreIndex = this.fibonnaciSequence.indexOf(lowestScore);
        const highestScoreIndex = this.fibonnaciSequence.indexOf(highestScore);
        const limitedSequence = this.fibonnaciSequence.slice(lowestScoreIndex, highestScoreIndex + 1); // Slice removes just before the last index
        const increment = 5 / limitedSequence.length; // We have 5 levels of measure
        let index = 0;

        this.scoreMappings = limitedSequence.reduce((memo: Map<number, number>, item: number) => {
          memo.set(+index.toFixed(1), item);
          index = index + increment;

          return memo;
        }, new Map<number, number>());
        const rangeIndexes = [
          ...Array.from(this.scoreMappings.keys()),
          5
        ];
        const correctedScore = +(score * scoreDifference).toFixed(1);
        const matchingIndex = rangeIndexes.find((rangeIndex: number, arrIndex: number, arr: number[]) => {
          return correctedScore > rangeIndex && correctedScore <= arr[arrIndex + 1];
        }) ?? 0;

        this.score = this.scoreMappings.get(matchingIndex);
      }
    });
  }

  public upLowestSprintStep() {
    const currentFibonacciValue = this.effort.lowest;
    const highestValue = this.fibonnaciSequence[this.fibonnaciSequence.length - 1];

    if (currentFibonacciValue !== highestValue) {
      const nextValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) + 1];

      if (nextValue < this.effort.highest) {
        this.updateEffort('lowest', nextValue);
      }
    }
  }

  public downLowestSprintStep() {
    const currentFibonacciValue = this.effort.lowest;
    const lowestValue = this.fibonnaciSequence[0];

    if (currentFibonacciValue !== lowestValue) {
      const nextValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) - 1];

      this.updateEffort('lowest', nextValue);
    }
  }

  public upHighestSprintStep() {
    const currentFibonacciValue = this.effort.highest;
    const highestValue = this.fibonnaciSequence[this.fibonnaciSequence.length - 1];

    if (currentFibonacciValue !== highestValue) {
      const nextValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) + 1];

      this.updateEffort('highest', nextValue);
    }
  }

  public downHighestSprintStep() {
    const currentFibonacciValue = this.effort.highest;
    const lowestValue = this.fibonnaciSequence[0];

    if (currentFibonacciValue !== lowestValue) {
      const nextValue = this.fibonnaciSequence[this.fibonnaciSequence.indexOf(currentFibonacciValue) - 1];

      if (nextValue > this.effort.lowest) {
        this.updateEffort('highest', nextValue);
      }
    }
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

  private updateWeightings(key: keyof IWeightings, value: string | number) {
    const weightings = this.weightings;
    const effort = this.effort;
    const settings: IAppSettings = {
      weightings: {
        ...weightings,
        [key]: +value
      },
      effort
    };

    this.updateAppSettings(settings);
  }

  private updateEffort(key: keyof IEffort, value: string | number) {
    const weightings = this.weightings;
    const effort = this.effort;
    const settings: IAppSettings = {
      weightings,
      effort: {
        ...effort,
        [key]: +value
      }
    };

    this.updateAppSettings(settings);
  }

  private updateAppSettings(settings: IAppSettings) {
    this.store.dispatch(new UpdateSettings(settings));
  }
}
