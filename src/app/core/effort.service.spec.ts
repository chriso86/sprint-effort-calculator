import { TestBed } from '@angular/core/testing';

import { EffortService } from './effort.service';

describe('EffortService', () => {
  let service: EffortService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EffortService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
