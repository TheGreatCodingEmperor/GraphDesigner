import { TestBed } from '@angular/core/testing';

import { DatasetManagerService } from './dataset-manager.service';

describe('DatasetManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetManagerService = TestBed.get(DatasetManagerService);
    expect(service).toBeTruthy();
  });
});
