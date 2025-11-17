import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StudyGroup } from './study-group';

describe('StudyGroup', () => {
  let component: StudyGroup;
  let fixture: ComponentFixture<StudyGroup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudyGroup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudyGroup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
