import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-arrow-icon-button',
  templateUrl: './arrow-icon-button.component.html',
  styleUrls: ['./arrow-icon-button.component.scss']
})
export class ArrowIconButtonComponent {
  @Input() direction: 'up' | 'down' = 'up';

  @Output() shift: EventEmitter<void> = new EventEmitter<void>();
}
