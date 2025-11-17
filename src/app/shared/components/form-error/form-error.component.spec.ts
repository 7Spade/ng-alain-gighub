import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormErrorComponent } from './form-error.component';

describe('FormErrorComponent', () => {
  let component: FormErrorComponent;
  let fixture: ComponentFixture<FormErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormErrorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(FormErrorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display errors when errors is null', () => {
    fixture.componentRef.setInput('errors', null);
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.form-error');
    expect(errorElement).toBeNull();
  });

  it('should display required error message', () => {
    fixture.componentRef.setInput('errors', { required: true });
    fixture.detectChanges();

    const errorText = fixture.nativeElement.textContent;
    expect(errorText).toContain('此欄位為必填');
  });

  it('should display email error message', () => {
    fixture.componentRef.setInput('errors', { email: true });
    fixture.detectChanges();

    const errorText = fixture.nativeElement.textContent;
    expect(errorText).toContain('請輸入有效的電子郵件地址');
  });

  it('should display minlength error with required length', () => {
    fixture.componentRef.setInput('errors', {
      minlength: { requiredLength: 5, actualLength: 3 }
    });
    fixture.detectChanges();

    const errorText = fixture.nativeElement.textContent;
    expect(errorText).toContain('最少需要 5 個字元');
  });

  it('should display multiple errors', () => {
    fixture.componentRef.setInput('errors', {
      required: true,
      minlength: { requiredLength: 5 }
    });
    fixture.detectChanges();

    const errorElements = fixture.nativeElement.querySelectorAll('small');
    expect(errorElements.length).toBe(2);
  });
});
