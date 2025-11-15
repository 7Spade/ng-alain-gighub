import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationRulesComponent } from './notification-rules.component';

describe('NotificationRulesComponent', () => {
  let component: NotificationRulesComponent;
  let fixture: ComponentFixture<NotificationRulesComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [NotificationRulesComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(NotificationRulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});
