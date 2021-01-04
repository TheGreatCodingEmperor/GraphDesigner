import { TestBed } from '@angular/core/testing';

import { JoinDesignerService } from './join-designer.service';

describe('JoinDesignerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JoinDesignerService = TestBed.get(JoinDesignerService);
    expect(service).toBeTruthy();
  });
});
