import {Action, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {UpdateSettings} from "./app.actions";
import {IAppSettings} from "./app-settings.interface";
import {LocalStorageHelper} from "./local-storage.helper";

@State<IAppSettings>({
  name: 'app',
  defaults: {
    weightings: {
      complexity: 25,
      workload: 25,
      risk: 25,
      uncertainty: 25
    },
    effort: {
      lowest: 1,
      highest: 13
    }
  }
})
@Injectable()
export class AppState {
  @Action(UpdateSettings)
  public updateSettings(ctx: StateContext<IAppSettings>, { settings }: UpdateSettings): void {
    LocalStorageHelper.SetItem('settings', settings);
    ctx.patchState(settings);
  }
}
