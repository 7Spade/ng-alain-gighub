import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsService } from '@shared';
import { of } from 'rxjs';

import { ActivityLogDetailComponent } from './activity-log-detail.component';

describe('ActivityLogDetailComponent', () => {
  let component: ActivityLogDetailComponent;
  let fixture: ComponentFixture<ActivityLogDetailComponent>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'test-id'
        }
      }
    };

    const mockAnalyticsService = {
      getActivityLogById: jasmine.createSpy('getActivityLogById').and.returnValue(Promise.resolve(null)),
      loading: jasmine.createSpy('loading').and.returnValue(of(false)),
      error: jasmine.createSpy('error').and.returnValue(of(null))
    };

    await TestBed.configureTestingModule({
      imports: [ActivityLogDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityLogDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have signals initialized', () => {
    expect(component.activityLog()).toBeNull();
    expect(component.loading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should format resource type labels', () => {
    expect(component.getResourceTypeLabel('task')).toBe('任務');
    expect(component.getResourceTypeLabel('blueprint')).toBe('藍圖');
    expect(component.getResourceTypeLabel('unknown')).toBe('unknown');
  });
});
