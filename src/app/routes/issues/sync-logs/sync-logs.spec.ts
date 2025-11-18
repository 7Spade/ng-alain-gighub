import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncLogs } from './sync-logs';

describe('SyncLogs', () => {
  let component: SyncLogs;
  let fixture: ComponentFixture<SyncLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyncLogs]
    }).compileComponents();

    fixture = TestBed.createComponent(SyncLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
