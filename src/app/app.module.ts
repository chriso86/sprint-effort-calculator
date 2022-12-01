import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ComplexityComponent} from './complexity/complexity.component';
import {WorkloadComponent} from './workload/workload.component';
import {RiskComponent} from './risk/risk.component';
import {UncertaintyComponent} from './uncertainty/uncertainty.component';
import {SharedModule} from "../shared/shared.module";
import {ScoreComponent} from './score/score.component';
import {NgxsModule} from "@ngxs/store";
import {environment} from "../environments/environment";
import {AppState} from "./core/app.state";
import {TeamListComponent} from './team-list/team-list.component';
import {TeamMemberComponent} from './team-list/team-member/team-member.component';
import { AdvancedSettingsComponent } from './advanced-settings/advanced-settings.component';

@NgModule({
  declarations: [
    AppComponent,
    ComplexityComponent,
    WorkloadComponent,
    RiskComponent,
    UncertaintyComponent,
    ScoreComponent,
    TeamListComponent,
    TeamMemberComponent,
    AdvancedSettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    NgxsModule.forRoot([AppState], {
      developmentMode: !environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
