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
        console.log('UPDATING SCORE');
        this.updateScore();
      })

    console.log(savedSettings, 'SAVED SETTINGS');

    if (savedSettings) {
      this.updateAppSettings(savedSettings);
    }
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
    this.updateWeightings('complexity', event);
  }

  public setWorkloadWeighting(event: Event) {
    this.updateWeightings('workload', event);
  }

  public setRiskWeighting(event: Event) {
    this.updateWeightings('risk', event);
  }

  public setUncertaintyWeighting(event: Event) {
    this.updateWeightings('uncertainty', event);
  }

  public setLowestEffort(event: Event) {
    this.updateEffort('lowest', event);
  }

  public setHighestEffort(event: Event) {
    this.updateEffort('highest', event);
  }

  public updateScore(): void {
    requestAnimationFrame(() => {
      if (this.totalWeightedPercentage !== 1) {
        return;
      }

      if (this.complexity && this.workload && this.risk && this.uncertainty) {
        const complexityValue = this.complexity.data * (this.weightings.complexity / 100);
        const workloadValue = this.workload.data * (this.weightings.workload / 100);
        const riskValue = this.risk.data * (this.weightings.risk / 100);
        const uncertaintyValue = this.uncertainty.data * (this.weightings.uncertainty / 100);
        const score = complexityValue + workloadValue + riskValue + uncertaintyValue;
        const lowestScore = this.effort.lowest;
        const highestScore = this.effort.highest;
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

    numbers.shift(); // Remove the duplicate 1

    return numbers;
  }

  private updateWeightings(key: keyof IWeightings, event: Event) {
    const inputEvent = (event.target as HTMLInputElement);
    const weightings = this.weightings;
    const effort = this.effort;
    const settings: IAppSettings = {
      weightings: {
        ...weightings,
        [key]: inputEvent.value
      },
      effort
    };

    this.updateAppSettings(settings);
  }

  private updateEffort(key: keyof IEffort, event: Event) {
    const inputEvent = (event.target as HTMLInputElement);
    const weightings = this.weightings;
    const effort = this.effort;
    const settings: IAppSettings = {
      weightings,
      effort: {
        ...effort,
        [key]: inputEvent.value
      }
    };

    this.updateAppSettings(settings);
  }

  private updateAppSettings(settings: IAppSettings) {
    console.log('UPDATING SETTINGS', settings);

    this.store.dispatch(new UpdateSettings(settings));
  }
}
