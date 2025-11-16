import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

import { QualityInspectionDetail } from './quality-inspection-detail';

describe('QualityInspectionDetail', () => {
  let component: QualityInspectionDetail;
  let fixture: ComponentFixture<QualityInspectionDetail>;
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
      } as any
    };
    mockMessageService = jasmine.createSpyObj('NzMessageService', ['info', 'error', 'success']);

    await TestBed.configureTestingModule({
      imports: [QualityInspectionDetail],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NzMessageService, useValue: mockMessageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QualityInspectionDetail);
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
      expect(component.inspection()).toBeTruthy();
      expect(component.inspectionItems().length).toBeGreaterThan(0);
      expect(component.photos().length).toBeGreaterThan(0);
      expect(component.history().length).toBeGreaterThan(0);
      done();
    }, 1000);
  });

  it('should compute correct status color', done => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.statusColor()).toBeTruthy();
      done();
    }, 1000);
  });

  it('should compute correct status text', done => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.statusText()).toBeTruthy();
      done();
    }, 1000);
  });

  it('should compute pass rate correctly', done => {
    fixture.detectChanges();

    setTimeout(() => {
      const rate = component.passRate();
      expect(rate).toContain('%');
      done();
    }, 1000);
  });

  it('should compute total items correctly', done => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.totalItems()).toBeGreaterThan(0);
      done();
    }, 1000);
  });

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/quality/inspections']);
  });

  it('should show info message when approve is called', () => {
    component.approve();
    expect(mockMessageService.info).toHaveBeenCalledWith('核准功能待實作');
  });

  it('should show info message when reject is called', () => {
    component.reject();
    expect(mockMessageService.info).toHaveBeenCalledWith('退回功能待實作');
  });

  it('should show info message when exportReport is called', () => {
    component.exportReport();
    expect(mockMessageService.info).toHaveBeenCalledWith('匯出報表功能待實作');
  });

  it('should return correct result color', () => {
    expect(component.getResultColor('pass')).toBe('success');
    expect(component.getResultColor('fail')).toBe('error');
    expect(component.getResultColor('na')).toBe('default');
  });

  it('should return correct result text', () => {
    expect(component.getResultText('pass')).toBe('合格');
    expect(component.getResultText('fail')).toBe('不合格');
    expect(component.getResultText('na')).toBe('不適用');
  });
});
