import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BotTasks } from './bot-tasks';

describe('BotTasks', () => {
  let component: BotTasks;
  let fixture: ComponentFixture<BotTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotTasks]
    }).compileComponents();

    fixture = TestBed.createComponent(BotTasks);
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
