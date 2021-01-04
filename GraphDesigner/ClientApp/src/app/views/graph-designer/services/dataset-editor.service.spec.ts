import { TestBed } from '@angular/core/testing';

import { DatasetEditorService } from './dataset-editor.service';

describe('DatasetEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatasetEditorService = TestBed.get(DatasetEditorService);
    expect(service).toBeTruthy();
  });
});
