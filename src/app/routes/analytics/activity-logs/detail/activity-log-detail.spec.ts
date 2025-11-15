import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogDetail } from './activity-log-detail';

describe('ActivityLogDetail', () => {
  let component: ActivityLogDetail;
  let fixture: ComponentFixture<ActivityLogDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityLogDetail]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityLogDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
