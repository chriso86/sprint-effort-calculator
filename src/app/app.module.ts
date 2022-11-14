import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComplexityComponent } from './complexity/complexity.component';
import { WorkloadComponent } from './workload/workload.component';
import { RiskComponent } from './risk/risk.component';
import { UncertaintyComponent } from './uncertainty/uncertainty.component';
import {SharedModule} from "../shared/shared.module";
import {FlexModule} from "@angular/flex-layout";
import { ScoreComponent } from './score/score.component';
import {FormsModule} from "@angular/forms";
import {NgxsModule} from "@ngxs/store";
import {environment} from "../environments/environment";
import {AppState} from "./core/app.state";

@NgModule({
  declarations: [
    AppComponent,
    ComplexityComponent,
    WorkloadComponent,
    RiskComponent,
    UncertaintyComponent,
    ScoreComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    FlexModule,
    FormsModule,
    NgxsModule.forRoot([AppState], {
      developmentMode: !environment.production
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
