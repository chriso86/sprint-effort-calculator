import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowIconButtonComponent } from './arrow-icon-button.component';

describe('ArrowIconButtonComponent', () => {
  let component: ArrowIconButtonComponent;
  let fixture: ComponentFixture<ArrowIconButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArrowIconButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArrowIconButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
