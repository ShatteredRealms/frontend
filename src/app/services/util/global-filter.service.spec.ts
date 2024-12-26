import { TestBed } from '@angular/core/testing';

import { GlobalFilterService } from './global-filter.service';

describe('GlobalFilterService', () => {
  let service: GlobalFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
