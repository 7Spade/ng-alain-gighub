import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { TaskProgressComponent } from './task-progress';

describe('TaskProgress', () => {
  let component: TaskProgressComponent;
  let fixture: ComponentFixture<TaskProgressComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;
  let mockMessageService: jasmine.SpyObj<NzMessageService>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get').and.returnValue(null)
        }
      } as unknown as ActivatedRoute['snapshot']
    };
    mockMessageService = jasmine.createSpyObj('NzMessageService', ['info', 'error', 'success']);

    await TestBed.configureTestingModule({
      imports: [TaskProgressComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NzMessageService, useValue: mockMessageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskProgressComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with loading state', () => {
    expect(component.loading()).toBe(true);
  });

  it('should load mock data on init when no id provided', done => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.loading()).toBe(false);
      expect(component.taskProgress()).toBeTruthy();
      expect(component.progressItems().length).toBeGreaterThan(0);
      expect(component.milestones().length).toBeGreaterThan(0);
      done();
    }, 1000);
  });

  it('should compute overall progress correctly', done => {
    fixture.detectChanges();

    setTimeout(() => {
      const progress = component.overallProgress();
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(100);
      done();
    }, 1000);
  });

  it('should compute completion rate correctly', done => {
    fixture.detectChanges();

    setTimeout(() => {
      const rate = component.completionRate();
      expect(rate).toContain('%');
      done();
    }, 1000);
  });

  it('should compute schedule status correctly', done => {
    fixture.detectChanges();

    setTimeout(() => {
      const status = component.scheduleStatus();
      expect(['success', 'normal', 'exception']).toContain(status);
      done();
    }, 1000);
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  it('should show info message when exportReport is called', () => {
    component.exportReport();
    expect(mockMessageService.info).toHaveBeenCalledWith('匯出報表功能待實作');
  });

  it('should show info message when viewDetails is called', () => {
    component.viewDetails('item-1');
    expect(mockMessageService.info).toHaveBeenCalledWith('查看項目 item-1 詳情');
  });

  it('should return correct status color', () => {
    expect(component.getStatusColor('completed')).toBe('success');
    expect(component.getStatusColor('qc')).toBe('processing');
    expect(component.getStatusColor('staging')).toBe('warning');
    expect(component.getStatusColor('issue')).toBe('error');
    expect(component.getStatusColor('pending')).toBe('default');
  });

  it('should return correct status text', () => {
    expect(component.getStatusText('completed')).toBe('已完成');
    expect(component.getStatusText('qc')).toBe('品檢中');
    expect(component.getStatusText('staging')).toBe('暫存區');
    expect(component.getStatusText('issue')).toBe('問題追蹤');
    expect(component.getStatusText('pending')).toBe('進行中');
  });
});
