import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { of } from 'rxjs';

import { PullRequestDetail } from './pull-request-detail';

describe('PullRequestDetail', () => {
  let component: PullRequestDetail;
  let fixture: ComponentFixture<PullRequestDetail>;
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
      imports: [PullRequestDetail],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: NzMessageService, useValue: mockMessageService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PullRequestDetail);
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
      expect(component.pullRequest()).toBeTruthy();
      expect(component.activities().length).toBeGreaterThan(0);
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

  it('should navigate back when goBack is called', () => {
    component.goBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/blueprints/pull-requests']);
  });

  it('should show info message when merge is called', () => {
    component.merge();
    expect(mockMessageService.info).toHaveBeenCalledWith('合併功能待實作');
  });

  it('should show info message when close is called', () => {
    component.close();
    expect(mockMessageService.info).toHaveBeenCalledWith('關閉功能待實作');
  });

  it('should show info message when approve is called', () => {
    component.approve();
    expect(mockMessageService.info).toHaveBeenCalledWith('核准功能待實作');
  });

  it('should show info message when requestChanges is called', () => {
    component.requestChanges();
    expect(mockMessageService.info).toHaveBeenCalledWith('請求變更功能待實作');
  });
});
