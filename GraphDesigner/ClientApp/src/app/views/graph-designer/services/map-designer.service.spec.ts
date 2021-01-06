import { TestBed } from '@angular/core/testing';

import { MapDesignerService } from './map-designer.service';

describe('MapDesignerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapDesignerService = TestBed.get(MapDesignerService);
    expect(service).toBeTruthy();
  });
});
