import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotTasksComponent } from './bot-tasks';

describe('BotTasksComponent', () => {
  let component: BotTasksComponent;
  let fixture: ComponentFixture<BotTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotTasksComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(BotTasksComponent);
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
