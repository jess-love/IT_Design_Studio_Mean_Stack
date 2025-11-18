import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentTracker } from './assignment-tracker';

describe('AssignmentTracker', () => {
  let component: AssignmentTracker;
  let fixture: ComponentFixture<AssignmentTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignmentTracker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignmentTracker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
