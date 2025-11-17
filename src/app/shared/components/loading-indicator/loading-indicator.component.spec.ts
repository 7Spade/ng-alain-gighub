import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingIndicatorComponent } from './loading-indicator.component';

describe('LoadingIndicatorComponent', () => {
  let component: LoadingIndicatorComponent;
  let fixture: ComponentFixture<LoadingIndicatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingIndicatorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(LoadingIndicatorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display when loading is false', () => {
    fixture.componentRef.setInput('loading', false);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.loading-container');
    expect(container).toBeNull();
  });

  it('should display when loading is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.loading-container');
    expect(container).toBeTruthy();
  });

  it('should display custom text', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('text', '處理中...');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('處理中...');
  });

  it('should apply fullscreen class when fullscreen is true', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.componentRef.setInput('fullscreen', true);
    fixture.detectChanges();

    const container = fixture.nativeElement.querySelector('.loading-container');
    expect(container.classList.contains('fullscreen')).toBe(true);
  });
});
