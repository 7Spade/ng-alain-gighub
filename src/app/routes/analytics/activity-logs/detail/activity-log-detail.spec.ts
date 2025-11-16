import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ActivityLogDetail } from './activity-log-detail';
import { AnalyticsService } from '@shared';

describe('ActivityLogDetail', () => {
  let component: ActivityLogDetail;
  let fixture: ComponentFixture<ActivityLogDetail>;

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
      imports: [ActivityLogDetail],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AnalyticsService, useValue: mockAnalyticsService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityLogDetail);
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
