import {Component} from '@angular/core';
import {IAppSettings, IEffort, IWeightings} from "../core/app-settings.interface";
import {ToggleAdvancedSettings, UpdateEffort, UpdateWeightings} from "../core/app.actions";
import {Select, Store} from "@ngxs/store";
import {AppState} from "../core/app.state";
import {Observable} from "rxjs";

@Component({
  selector: 'app-advanced-settings',
  templateUrl: './advanced-settings.component.html',
  styleUrls: ['./advanced-settings.component.scss']
})
export class AdvancedSettingsComponent {
  public weightings!: IWeightings;
  public effort!: IEffort;
  @Select(AppState.weightings) weightings$!: Observable<IWeightings>;
  @Select(AppState.effort) effort$!: Observable<IEffort>;

  constructor(
    private store: Store
  ) {
    this.weightings$.subscribe((weightings: IWeightings) => {
      this.weightings = weightings;
    });
    this.effort$.subscribe((effort: IEffort) => {
      this.effort = effort;
    });
  }

  public get fibonnaciSequence(): number[] {
    return this.store.selectSnapshot<IAppSettings>(s => s.app)?.fibonacciSequence ?? [];
  }

  public get totalWeightedPercentage(): number {
    const state = this.store.selectSnapshot<IAppSettings>(s => s.app);
    const weightings = state.weightings;

    return +((weightings.complexity * 0.01)
      + (weightings.workload * 0.01)
      + (weightings.risk * 0.01)
      + (weightings.uncertainty * 0.01)).toFixed(2);
  }

  public get isAdvancedSettingsOpen(): boolean {
    return this.store.selectSnapshot<IAppSettings>(s => s.app)?.isAdvancedSettingsOpen ?? false;
  }

  public toggleAdvancedSettings(): void {
    this.store.dispatch(new ToggleAdvancedSettings(
      this.isAdvancedSettingsOpen
        ? 'close'
        : 'open'
    ));
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

  private updateWeightings(key: keyof IWeightings, value: string | number) {
    const weightings: IWeightings = {
      ...this.weightings,
      [key]: +value
    };

    this.store.dispatch(new UpdateWeightings(weightings));
  }

  private updateEffort(key: keyof IEffort, value: string | number) {
    const effort: IEffort = {
      ...this.effort,
      [key]: +value
    };

    this.store.dispatch(new UpdateEffort(effort));
  }
}
