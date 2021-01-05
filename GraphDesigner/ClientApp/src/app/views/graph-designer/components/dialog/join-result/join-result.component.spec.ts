import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinResultComponent } from './join-result.component';

describe('JoinResultComponent', () => {
  let component: JoinResultComponent;
  let fixture: ComponentFixture<JoinResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
