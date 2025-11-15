import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskProgress } from './task-progress';

describe('TaskProgress', () => {
  let component: TaskProgress;
  let fixture: ComponentFixture<TaskProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskProgress]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskProgress);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
