import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConnectionStatusComponent } from './connection-status.component';
import { ConnectionStatus } from '../task-tree.facade';

describe('ConnectionStatusComponent', () => {
  let component: ConnectionStatusComponent;
  let fixture: ComponentFixture<ConnectionStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionStatusComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ConnectionStatusComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display connected status correctly', () => {
    fixture.componentRef.setInput('status', 'connected');
    fixture.detectChanges();

    expect(component.status()).toBe('connected');
    expect(component.statusBadge()).toBeTruthy();
    expect(component.statusColor()).toBe('green');
  });

  it('should display disconnected status correctly', () => {
    fixture.componentRef.setInput('status', 'disconnected');
    fixture.detectChanges();

    expect(component.status()).toBe('disconnected');
    expect(component.statusColor()).toBe('red');
  });

  it('should display reconnecting status correctly', () => {
    fixture.componentRef.setInput('status', 'reconnecting');
    fixture.detectChanges();

    expect(component.status()).toBe('reconnecting');
    expect(component.statusColor()).toBe('orange');
  });

  it('should show reconnect button when disconnected', () => {
    fixture.componentRef.setInput('status', 'disconnected');
    fixture.detectChanges();

    expect(component.showReconnectButton()).toBe(true);
  });

  it('should hide reconnect button when connected', () => {
    fixture.componentRef.setInput('status', 'connected');
    fixture.detectChanges();

    expect(component.showReconnectButton()).toBe(false);
  });

  it('should call reconnect function when button clicked', () => {
    const mockReconnectFn = jasmine.createSpy('reconnectFn');
    fixture.componentRef.setInput('status', 'disconnected');
    fixture.componentRef.setInput('reconnectFn', mockReconnectFn);
    fixture.detectChanges();

    component.onReconnectClick();

    expect(mockReconnectFn).toHaveBeenCalled();
  });

  it('should display last updated timestamp', () => {
    const timestamp = '2025-01-01T10:00:00Z';
    fixture.componentRef.setInput('lastUpdated', timestamp);
    fixture.detectChanges();

    expect(component.lastUpdated()).toBe(timestamp);
    expect(component.formattedLastUpdated()).toBeTruthy();
  });

  it('should compute status tooltip text correctly', () => {
    const statuses: ConnectionStatus[] = ['connected', 'disconnected', 'reconnecting'];

    statuses.forEach(status => {
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();
      
      const tooltip = component.statusTooltip();
      expect(tooltip).toBeTruthy();
      expect(typeof tooltip).toBe('string');
    });
  });

  it('should handle signal-based reactivity', () => {
    fixture.componentRef.setInput('status', 'connected');
    fixture.detectChanges();
    
    expect(component.statusColor()).toBe('green');

    // Change status
    fixture.componentRef.setInput('status', 'disconnected');
    fixture.detectChanges();

    expect(component.statusColor()).toBe('red');
  });

  it('should format timestamp correctly', () => {
    const timestamp = '2025-01-01T10:00:00Z';
    fixture.componentRef.setInput('lastUpdated', timestamp);
    fixture.detectChanges();

    const formatted = component.formattedLastUpdated();
    expect(formatted).toBeTruthy();
    // Should include date and time
    expect(formatted.length).toBeGreaterThan(0);
  });
});
