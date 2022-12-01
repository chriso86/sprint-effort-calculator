import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {CreateRoom, ToggleAdvancedSettings, UpdateEffort, UpdateSettings, UpdateWeightings} from "./app.actions";
import {IAppSettings, IEffort, IWeightings} from "./app-settings.interface";
import {LocalStorageHelper} from "./local-storage.helper";
import {
  DEFAULT_COMPLEXITY_WEIGHTING, DEFAULT_HIGHEST_EFFORT, DEFAULT_LOWEST_EFFORT,
  DEFAULT_RISK_WEIGHTING,
  DEFAULT_UNCERTAINTY_WEIGHTING,
  DEFAULT_WORKLOAD_WEIGHTING
} from "./defaults";
import {getFibonacciNumbers} from "./fibonacci-helper";

@State<IAppSettings>({
  name: 'app',
  defaults: {
    weightings: {
      complexity: DEFAULT_COMPLEXITY_WEIGHTING * 100,
      workload: DEFAULT_WORKLOAD_WEIGHTING * 100,
      risk: DEFAULT_RISK_WEIGHTING * 100,
      uncertainty: DEFAULT_UNCERTAINTY_WEIGHTING * 100
    },
    effort: {
      lowest: DEFAULT_LOWEST_EFFORT,
      highest: DEFAULT_HIGHEST_EFFORT
    },
    isAdvancedSettingsOpen: false,
    fibonacciSequence: getFibonacciNumbers()
  }
})
@Injectable()
export class AppState {
  @Selector()
  public static weightings(state: IAppSettings) {
    return state.weightings;
  }

  @Selector()
  public static effort(state: IAppSettings) {
    return state.effort;
  }

  @Selector()
  public static fibonnaciSequence(state: IAppSettings) {
    return state.fibonacciSequence;
  }

  @Action(UpdateSettings)
  public updateSettings(ctx: StateContext<IAppSettings>, { weightings, effort }: UpdateSettings): void {
    ctx.dispatch(new UpdateWeightings(weightings));
    ctx.dispatch(new UpdateEffort(effort));

    this.updateSettingsInLocalStorage(weightings, effort);
  }

  @Action(UpdateWeightings)
  public updateWeightings(ctx: StateContext<IAppSettings>, { weightings }: UpdateWeightings): void {
    const settings = {
      ...ctx.getState(),
      weightings
    };

    ctx.patchState(settings);

    this.updateSettingsInLocalStorage(
      weightings,
      ctx.getState().effort
    );
  }

  @Action(UpdateEffort)
  public updateEffort(ctx: StateContext<IAppSettings>, { effort }: UpdateEffort): void {
    const settings = {
      ...ctx.getState(),
      effort
    };

    ctx.patchState(settings);

    this.updateSettingsInLocalStorage(
      ctx.getState().weightings,
      effort
    );
  }

  @Action(ToggleAdvancedSettings)
  public toggleAdvancedSettings(ctx: StateContext<IAppSettings>, { state }: ToggleAdvancedSettings): void {
    ctx.patchState({
      isAdvancedSettingsOpen: state === 'open'
    });
  }

  @Action(CreateRoom)
  public createRoom(ctx: StateContext<IAppSettings>, { username, hideScores }: CreateRoom): void {

  }

  private updateSettingsInLocalStorage(weightings: IWeightings, effort: IEffort): void {
    LocalStorageHelper.SetItem('settings', {
      weightings,
      effort
    });
  }
}
