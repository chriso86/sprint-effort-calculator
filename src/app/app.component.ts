import {Component} from '@angular/core';
import {IRadioOption} from "../shared/radio-button/radio-option";
import {Actions, ofActionSuccessful, Select, Store} from "@ngxs/store";
import {ToggleAdvancedSettings, UpdateSettings} from "./core/app.actions";
import {IAppSettings, IEffort, IWeightings} from "./core/app-settings.interface";
import {LocalStorageHelper} from "./core/local-storage.helper";
import {Observable} from "rxjs";
import {AppState} from "./core/app.state";
import version from "../assets/version.json";

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
  public scoreMappings?: Map<number, number> = new Map<number, number>();
  public version = version.version;

  @Select(AppState.weightings) weightings$!: Observable<IWeightings>;
  @Select(AppState.effort) effort$!: Observable<IEffort>;

  constructor(
    private store: Store,
    private actions$: Actions
  ) {
    const savedSettings = LocalStorageHelper.GetItem<IAppSettings>('settings');

    this.actions$
      .pipe(
        ofActionSuccessful(UpdateSettings)
      )
      .subscribe(() => {
        this.updateScore();
      })

    if (savedSettings) {
      const { weightings, effort } = savedSettings;

      this.updateAppSettings(weightings, effort);
    }
  }

  public get isAdvancedSettingsOpen(): boolean {
    return this.store.selectSnapshot<IAppSettings>(s => s.app)?.isAdvancedSettingsOpen ?? false;
  }

  public get calculatedComplexity(): number {
    const state = this.store.selectSnapshot<IAppSettings>(s => s.app);

    return this.calculateWeightedValue(
      this.complexity?.data ?? 0,
      state.weightings.complexity
    );
  }

  public get calculatedWorkload(): number {
    const state = this.store.selectSnapshot<IAppSettings>(s => s.app);

    return this.calculateWeightedValue(
      this.workload?.data ?? 0,
      state.weightings.workload
    );
  }

  public get calculatedRisk(): number {
    const state = this.store.selectSnapshot<IAppSettings>(s => s.app);

    return this.calculateWeightedValue(
      this.risk?.data ?? 0,
      state.weightings.risk
    );
  }

  public get calculatedUncertainty(): number {
    const state = this.store.selectSnapshot<IAppSettings>(s => s.app);

    return this.calculateWeightedValue(
      this.uncertainty?.data ?? 0,
      state.weightings.uncertainty
    );
  }

  public get totalWeightedPercentage(): number {
    const state = this.store.selectSnapshot<IAppSettings>(s => s.app);
    const weightings = state.weightings;

    return +((weightings.complexity * 0.01)
      + (weightings.workload * 0.01)
      + (weightings.risk * 0.01)
      + (weightings.uncertainty * 0.01)).toFixed(2);
  }

  public toggleAdvancedSettings(): void {
    this.store.dispatch(new ToggleAdvancedSettings(
      this.isAdvancedSettingsOpen
        ? 'close'
        : 'open'
    ));
  }

  public closeAdvancedSettings(): void {
    this.store.dispatch(new ToggleAdvancedSettings('close'));
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
        const state = this.store.selectSnapshot<IAppSettings>(s => s.app);
        const complexityValue = this.calculatedComplexity;
        const workloadValue = this.calculatedWorkload;
        const riskValue = this.calculatedRisk;
        const uncertaintyValue = this.calculatedUncertainty;
        const score = complexityValue + workloadValue + riskValue + uncertaintyValue;
        const scoreDifference = score / 5;
        const lowestScore = state.effort.lowest;
        const highestScore = state.effort.highest;
        const lowestScoreIndex = state.fibonacciSequence.indexOf(lowestScore);
        const highestScoreIndex = state.fibonacciSequence.indexOf(highestScore);
        const limitedSequence = state.fibonacciSequence.slice(lowestScoreIndex, highestScoreIndex + 1); // Slice removes just before the last index
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

  private updateAppSettings(weightings: IWeightings, effort: IEffort) {
    this.store.dispatch(new UpdateSettings(weightings, effort));
  }

  private calculateWeightedValue(value: number, weighting: number): number {
    return +(value * (weighting / 100)).toFixed(2);
  }
}
