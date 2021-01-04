import { TestBed } from '@angular/core/testing';

import { ProjectEditorService } from './project-editor.service';

describe('ProjectEditorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectEditorService = TestBed.get(ProjectEditorService);
    expect(service).toBeTruthy();
  });
});
