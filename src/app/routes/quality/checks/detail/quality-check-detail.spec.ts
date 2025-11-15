import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityCheckDetail } from './quality-check-detail';

describe('QualityCheckDetail', () => {
  let component: QualityCheckDetail;
  let fixture: ComponentFixture<QualityCheckDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QualityCheckDetail]
    }).compileComponents();

    fixture = TestBed.createComponent(QualityCheckDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
