import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { QualityCheckDetail } from './quality-check-detail';
import { QualityCheckService } from '@shared';

describe('QualityCheckDetail', () => {
  let component: QualityCheckDetail;
  let fixture: ComponentFixture<QualityCheckDetail>;

  beforeEach(async () => {
    const mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: (key: string) => 'test-id'
        }
      }
    };

    const mockQualityCheckService = {
      getById: jasmine.createSpy('getById').and.returnValue(Promise.resolve(null)),
      update: jasmine.createSpy('update').and.returnValue(Promise.resolve({})),
      loading: jasmine.createSpy('loading').and.returnValue(of(false)),
      error: jasmine.createSpy('error').and.returnValue(of(null))
    };

    await TestBed.configureTestingModule({
      imports: [QualityCheckDetail],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: QualityCheckService, useValue: mockQualityCheckService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QualityCheckDetail);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have edit form initialized', () => {
    expect(component.editForm).toBeDefined();
    expect(component.editForm.controls.status).toBeDefined();
    expect(component.editForm.controls.findings).toBeDefined();
    expect(component.editForm.controls.recommendations).toBeDefined();
  });

  it('should toggle edit mode', () => {
    expect(component.isEditMode()).toBe(false);
    component.toggleEditMode();
    expect(component.isEditMode()).toBe(true);
    component.toggleEditMode();
    expect(component.isEditMode()).toBe(false);
  });
});
