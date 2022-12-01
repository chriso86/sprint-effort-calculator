import {Component, Input} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppState} from "../core/app.state";
import {Observable} from "rxjs";
import {IEffort, IWeightings} from "../core/app-settings.interface";

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent {
  @Input() score?: number;
  @Input() complexity?: number = 0;
  @Input() workload?: number = 0;
  @Input() risk?: number = 0;
  @Input() uncertainty?: number = 0;
  @Input() calculatedComplexity: number = 0;
  @Input() calculatedWorkload: number = 0;
  @Input() calculatedRisk: number = 0;
  @Input() calculatedUncertainty: number = 0;
  @Input() scoreMappings?: Map<number, number>;

  @Select(AppState.weightings) weightings$!: Observable<IWeightings>;
  @Select(AppState.effort) effort$!: Observable<IEffort>;

  public isAdvancedScore: boolean = false;

  public get calculatedTotal(): number {
    return +(this.calculatedComplexity + this.calculatedWorkload + this.calculatedRisk + this.calculatedUncertainty).toFixed(2);
  }

  public get correctedScore(): number {
    return +(this.calculatedTotal * this.balancedTotal).toFixed(1);
  }

  public get balancedTotal(): number {
    return +(this.calculatedTotal / 5).toFixed(2);
  }

  public get scoreMappingsDescription(): string {
    const keys = Array.from(this.scoreMappings?.keys() ?? []);

    keys.push(5); // Final upper limit

    return keys
      .map((key, index) => {
        if (index < keys.length - 1) {
          return `<p>Range: ${key} - ${keys[index + 1]} = Effort: ${this.scoreMappings?.get(key)}</p>`;
        }

        return '';
      })
      .filter(i => !!i)
      .join('\r\n');
  }
}
