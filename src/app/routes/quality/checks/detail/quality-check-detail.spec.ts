import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { QualityCheckService } from '@shared';
import { of } from 'rxjs';

import { QualityCheckDetailComponent } from './quality-check-detail';

describe('QualityCheckDetailComponent', () => {
  let component: QualityCheckDetailComponent;
  let fixture: ComponentFixture<QualityCheckDetailComponent>;

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
      imports: [QualityCheckDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: QualityCheckService, useValue: mockQualityCheckService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QualityCheckDetailComponent);
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
