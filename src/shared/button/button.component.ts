import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() type: 'normal' | 'cta' = 'normal';
  @Input() text?: string;
  @Input() icon?: string;
}
