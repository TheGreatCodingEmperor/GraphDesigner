import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinDesignerComponent } from './join-designer.component';

describe('JoinDesignerComponent', () => {
  let component: JoinDesignerComponent;
  let fixture: ComponentFixture<JoinDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinDesignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinDesignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
