import {Action, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {UpdateEffort, UpdateSettings, UpdateWeightings} from "./app.actions";
import {IAppSettings} from "./app-settings.interface";
import {LocalStorageHelper} from "./local-storage.helper";
import {
  DEFAULT_COMPLEXITY_WEIGHTING, DEFAULT_HIGHEST_EFFORT, DEFAULT_LOWEST_EFFORT,
  DEFAULT_RISK_WEIGHTING,
  DEFAULT_UNCERTAINTY_WEIGHTING,
  DEFAULT_WORKLOAD_WEIGHTING
} from "./defaults";

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
    }
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

  @Action(UpdateSettings)
  public updateSettings(ctx: StateContext<IAppSettings>, { settings }: UpdateSettings): void {
    ctx.patchState(settings);

    this.updateSettingsInLocalStorage(settings);
  }

  @Action(UpdateWeightings)
  public updateWeightings(ctx: StateContext<IAppSettings>, { weightings }: UpdateWeightings): void {
    const settings = {
      effort: ctx.getState().effort,
      weightings
    };

    ctx.patchState(settings);

    this.updateSettingsInLocalStorage(settings);
  }

  @Action(UpdateEffort)
  public updateEffort(ctx: StateContext<IAppSettings>, { effort }: UpdateEffort): void {
    const settings = {
      weightings: ctx.getState().weightings,
      effort
    };

    ctx.patchState(settings);

    this.updateSettingsInLocalStorage(settings);
  }

  private updateSettingsInLocalStorage(settings: IAppSettings): void {
    LocalStorageHelper.SetItem('settings', settings);
  }
}
