import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityInspectionDetail } from './quality-inspection-detail';

describe('QualityInspectionDetail', () => {
  let component: QualityInspectionDetail;
  let fixture: ComponentFixture<QualityInspectionDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityInspectionDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QualityInspectionDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});