import { TestBed } from '@angular/core/testing';

import { JoinResultService } from './join-result.service';

describe('JoinResultService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JoinResultService = TestBed.get(JoinResultService);
    expect(service).toBeTruthy();
  });
});
