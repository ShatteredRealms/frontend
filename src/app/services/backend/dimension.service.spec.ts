import { TestBed } from '@angular/core/testing';

import { DimensionService } from './dimension.service';

describe('DimensionService', () => {
  let service: DimensionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DimensionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
