import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotTasks } from './bot-tasks';

describe('BotTasks', () => {
  let component: BotTasks;
  let fixture: ComponentFixture<BotTasks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotTasks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotTasks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});