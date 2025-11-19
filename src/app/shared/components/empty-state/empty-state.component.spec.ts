import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyStateComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default description', () => {
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('暫無資料');
  });

  it('should display custom description', () => {
    fixture.componentRef.setInput('description', '找不到相關資料');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('找不到相關資料');
  });

  it('should call action function when action button clicked', () => {
    const actionSpy = jasmine.createSpy('actionSpy');
    fixture.componentRef.setInput('actionText', '新增');
    fixture.componentRef.setInput('action', actionSpy);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(actionSpy).toHaveBeenCalled();
  });
});
