import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotsTasksSkeletonComponent } from './bots-tasks-skeleton.component';

describe('BotsTasksSkeletonComponent', () => {
  let component: BotsTasksSkeletonComponent;
  let fixture: ComponentFixture<BotsTasksSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotsTasksSkeletonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BotsTasksSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have createSampleBotTask method', () => {
    expect(component.createSampleBotTask).toBeDefined();
    spyOn(console, 'log');
    component.createSampleBotTask();
    expect(console.log).toHaveBeenCalledWith('建立範例機器人任務 (未實作)');
  });
});
